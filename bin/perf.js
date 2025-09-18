#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import puppeteer from 'puppeteer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const performanceMetrics = {
	FCP: { name: 'First Contentful Paint', target: 1800, unit: 'ms' },
	LCP: { name: 'Largest Contentful Paint', target: 2500, unit: 'ms' },
	FID: { name: 'First Input Delay', target: 100, unit: 'ms' },
	CLS: { name: 'Cumulative Layout Shift', target: 0.1, unit: '' },
	TTFB: { name: 'Time to First Byte', target: 600, unit: 'ms' },
	TTI: { name: 'Time to Interactive', target: 3800, unit: 'ms' },
	TBT: { name: 'Total Blocking Time', target: 300, unit: 'ms' },
	SI: { name: 'Speed Index', target: 3400, unit: 'ms' },
};

async function startDevServer() {
	const spinner = ora('Starting development server...').start();

	const server = spawn('npm', ['run', 'dev'], {
		cwd: rootDir,
		stdio: 'pipe',
		shell: true,
	});

	await new Promise((resolve) => {
		server.stdout.on('data', (data) => {
			if (data.toString().includes('Local:')) {
				spinner.succeed(chalk.green('Development server started'));
				resolve();
			}
		});
	});

	return server;
}

async function measurePerformance(url = 'http://localhost:5173') {
	console.log(chalk.cyan.bold('\n📊 Measuring performance metrics...\n'));

	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();

	await page.setViewport({ width: 1280, height: 800 });

	const metrics = {};
	const spinner = ora('Loading page...').start();

	try {
		await page.goto(url, { waitUntil: 'networkidle0' });

		spinner.text = 'Collecting metrics...';

		const performanceTiming = JSON.parse(
			await page.evaluate(() => JSON.stringify(window.performance.timing))
		);

		const paintMetrics = await page.evaluate(() => {
			const paint = {};
			performance.getEntriesByType('paint').forEach((entry) => {
				paint[entry.name] = entry.startTime;
			});
			return paint;
		});

		const layoutShift = await page.evaluate(() => {
			let cls = 0;
			const observer = new PerformanceObserver((list) => {
				for (const entry of list.getEntries()) {
					if (!entry.hadRecentInput) {
						cls += entry.value;
					}
				}
			});
			observer.observe({ type: 'layout-shift', buffered: true });
			return cls;
		});

		metrics.TTFB = performanceTiming.responseStart - performanceTiming.fetchStart;
		metrics.FCP = paintMetrics['first-contentful-paint'] || 0;
		metrics.LCP = await page.evaluate(() => {
			return new Promise((resolve) => {
				const observer = new PerformanceObserver((list) => {
					const entries = list.getEntries();
					const lastEntry = entries[entries.length - 1];
					resolve(lastEntry.startTime);
				});
				observer.observe({ type: 'largest-contentful-paint', buffered: true });
				setTimeout(() => resolve(0), 5000);
			});
		});
		metrics.CLS = layoutShift;
		metrics.TTI = performanceTiming.domInteractive - performanceTiming.fetchStart;

		const resources = await page.evaluate(() => {
			return performance.getEntriesByType('resource').map((entry) => ({
				name: entry.name,
				type: entry.initiatorType,
				duration: entry.duration,
				size: entry.transferSize,
			}));
		});

		metrics.resources = resources;

		spinner.succeed(chalk.green('Metrics collected successfully'));

		await browser.close();

		return metrics;
	} catch (error) {
		spinner.fail(chalk.red('Failed to collect metrics'));
		await browser.close();
		throw error;
	}
}

async function analyzeMetrics(metrics) {
	console.log(chalk.cyan.bold('\n📈 Performance Analysis:\n'));

	let score = 100;
	const results = [];

	Object.entries(performanceMetrics).forEach(([key, config]) => {
		const value = metrics[key];
		if (value !== undefined) {
			const isGood = value <= config.target;
			const percentage = ((config.target / value) * 100).toFixed(0);

			if (!isGood) {
				score -= 10;
			}

			results.push({
				metric: config.name,
				value: value + config.unit,
				target: config.target + config.unit,
				status: isGood ? '✅' : '⚠️',
				percentage: isGood ? '100%' : `${percentage}%`,
			});
		}
	});

	const maxNameLength = Math.max(...results.map((r) => r.metric.length));
	results.forEach((result) => {
		const name = result.metric.padEnd(maxNameLength);
		const value = result.value.toString().padStart(10);
		const target = result.target.toString().padStart(10);
		const percentage = result.percentage.padStart(6);

		const color = result.status === '✅' ? chalk.green : chalk.yellow;

		console.log(
			`${result.status} ${chalk.white(name)} ${color(value)} (target: ${chalk.gray(target)}) ${color(percentage)}`
		);
	});

	console.log(chalk.cyan('\n━'.repeat(50)));
	console.log(chalk.cyan.bold(`Performance Score: ${score}/100`));

	if (score >= 90) {
		console.log(chalk.green('✨ Excellent! Your site is very fast.'));
	} else if (score >= 70) {
		console.log(chalk.yellow('👍 Good! Some room for improvement.'));
	} else {
		console.log(chalk.red('⚠️  Needs improvement. Consider optimization.'));
	}

	return score;
}

async function analyzeResources(resources) {
	console.log(chalk.cyan.bold('\n📦 Resource Analysis:\n'));

	const byType = {};
	resources.forEach((resource) => {
		if (!byType[resource.type]) {
			byType[resource.type] = {
				count: 0,
				totalSize: 0,
				totalDuration: 0,
			};
		}
		byType[resource.type].count++;
		byType[resource.type].totalSize += resource.size || 0;
		byType[resource.type].totalDuration += resource.duration || 0;
	});

	Object.entries(byType).forEach(([type, stats]) => {
		console.log(chalk.yellow(`${type}:`));
		console.log(chalk.gray(`  Count: ${stats.count}`));
		console.log(chalk.gray(`  Total Size: ${(stats.totalSize / 1024).toFixed(2)} KB`));
		console.log(chalk.gray(`  Avg Duration: ${(stats.totalDuration / stats.count).toFixed(2)} ms`));
	});

	const largestResources = resources
		.filter((r) => r.size)
		.sort((a, b) => b.size - a.size)
		.slice(0, 5);

	if (largestResources.length > 0) {
		console.log(chalk.cyan.bold('\n🏋️ Largest Resources:'));
		largestResources.forEach((resource) => {
			const name = resource.name.split('/').pop().substring(0, 40);
			const size = `${(resource.size / 1024).toFixed(2)} KB`;
			console.log(chalk.gray(`  ${name.padEnd(40)} ${size.padStart(12)}`));
		});
	}
}

async function generateReport(metrics, score) {
	const report = {
		timestamp: new Date().toISOString(),
		score,
		metrics: Object.entries(performanceMetrics).reduce((acc, [key, config]) => {
			acc[key] = {
				name: config.name,
				value: metrics[key],
				target: config.target,
				unit: config.unit,
				passed: metrics[key] <= config.target,
			};
			return acc;
		}, {}),
		resources: metrics.resources,
	};

	const reportPath = resolve(rootDir, 'reports', `performance-${Date.now()}.json`);
	await fs.mkdir(resolve(rootDir, 'reports'), { recursive: true });
	await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

	console.log(chalk.cyan(`\n📄 Report saved to: ${reportPath}`));

	return report;
}

async function compareToPrevious(currentScore) {
	try {
		const reportsDir = resolve(rootDir, 'reports');
		const files = await fs.readdir(reportsDir);
		const perfReports = files.filter((f) => f.startsWith('performance-'));

		if (perfReports.length > 1) {
			perfReports.sort();
			const previousReport = JSON.parse(
				await fs.readFile(resolve(reportsDir, perfReports[perfReports.length - 2]), 'utf-8')
			);

			const diff = currentScore - previousReport.score;
			if (diff > 0) {
				console.log(chalk.green(`📈 Performance improved by ${diff} points since last run!`));
			} else if (diff < 0) {
				console.log(
					chalk.yellow(`📉 Performance decreased by ${Math.abs(diff)} points since last run.`)
				);
			} else {
				console.log(chalk.gray(`→ Performance unchanged since last run.`));
			}
		}
	} catch (error) {
		// No previous reports to compare
	}
}

async function main() {
	console.log(chalk.cyan.bold('\n🚀 Performance Monitor\n'));

	const args = process.argv.slice(2);
	const url = args[0] || 'http://localhost:5173';
	let server = null;

	try {
		if (!args[0]) {
			server = await startDevServer();
			await new Promise((resolve) => setTimeout(resolve, 2000));
		}

		const metrics = await measurePerformance(url);
		const score = await analyzeMetrics(metrics);
		await analyzeResources(metrics.resources);
		await generateReport(metrics, score);
		await compareToPrevious(score);

		console.log(chalk.cyan.bold('\n💡 Optimization suggestions:'));

		if (metrics.LCP > performanceMetrics.LCP.target) {
			console.log(chalk.gray('  • Optimize largest content element loading'));
		}
		if (metrics.CLS > performanceMetrics.CLS.target) {
			console.log(chalk.gray('  • Add size attributes to images and embeds'));
		}
		if (metrics.TTFB > performanceMetrics.TTFB.target) {
			console.log(chalk.gray('  • Improve server response time'));
		}
		if (metrics.resources.filter((r) => r.type === 'script').length > 10) {
			console.log(chalk.gray('  • Consider bundling JavaScript files'));
		}
	} catch (error) {
		console.error(chalk.red('Error:'), error);
		process.exit(1);
	} finally {
		if (server) {
			server.kill();
		}
	}
}

main();
