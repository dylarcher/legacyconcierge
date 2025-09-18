#!/usr/bin/env node

import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import ora from 'ora';
import { gzipSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

async function cleanDist() {
	const distPath = resolve(rootDir, 'dist');
	try {
		await fs.rm(distPath, { recursive: true, force: true });
		console.log(chalk.gray('✓ Cleaned dist directory'));
	} catch (error) {
		console.error(chalk.red('Failed to clean dist directory'), error);
	}
}

async function buildProject() {
	const startTime = Date.now();
	const spinner = ora('Building project...').start();

	try {
		await cleanDist();

		const result = await build({
			configFile: resolve(rootDir, 'conf/vite.config.js'),
			root: resolve(rootDir, 'src'),
			build: {
				emptyOutDir: true,
				reportCompressedSize: false,
			},
		});

		spinner.succeed(chalk.green('Build completed successfully!'));

		const endTime = Date.now();
		const buildTime = ((endTime - startTime) / 1000).toFixed(2);

		console.log(chalk.cyan(`\nBuild time: ${buildTime}s`));

		await analyzeBuildSize();

	} catch (error) {
		spinner.fail(chalk.red('Build failed'));
		console.error(error);
		process.exit(1);
	}
}

async function analyzeBuildSize() {
	console.log(chalk.cyan('\n📊 Build Analysis:\n'));

	const distPath = resolve(rootDir, 'dist');
	const assets = [];

	async function walkDir(dir) {
		const files = await fs.readdir(dir, { withFileTypes: true });

		for (const file of files) {
			const fullPath = resolve(dir, file.name);

			if (file.isDirectory()) {
				await walkDir(fullPath);
			} else {
				const stats = await fs.stat(fullPath);
				const content = await fs.readFile(fullPath);
				const gzipSize = gzipSync(content).length;

				assets.push({
					path: fullPath.replace(distPath, ''),
					size: stats.size,
					gzipSize: gzipSize,
				});
			}
		}
	}

	await walkDir(distPath);

	const jsFiles = assets.filter(a => a.path.endsWith('.js'));
	const cssFiles = assets.filter(a => a.path.endsWith('.css'));
	const htmlFiles = assets.filter(a => a.path.endsWith('.html'));
	const imageFiles = assets.filter(a => /\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/i.test(a.path));

	const formatSize = (bytes) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
	};

	const printFileGroup = (name, files) => {
		if (files.length === 0) return;

		const totalSize = files.reduce((acc, f) => acc + f.size, 0);
		const totalGzipSize = files.reduce((acc, f) => acc + f.gzipSize, 0);

		console.log(chalk.yellow(`${name}:`));
		files.slice(0, 5).forEach(file => {
			console.log(
				chalk.gray(`  ${file.path.padEnd(50)} `) +
				chalk.white(`${formatSize(file.size).padStart(10)} `) +
				chalk.gray('→ ') +
				chalk.green(`${formatSize(file.gzipSize).padStart(10)} gzip`)
			);
		});

		if (files.length > 5) {
			console.log(chalk.gray(`  ... and ${files.length - 5} more files`));
		}

		console.log(
			chalk.cyan(`  Total: ${formatSize(totalSize)} → ${formatSize(totalGzipSize)} gzip\n`)
		);
	};

	printFileGroup('JavaScript', jsFiles);
	printFileGroup('CSS', cssFiles);
	printFileGroup('HTML', htmlFiles);
	printFileGroup('Images', imageFiles);

	const totalSize = assets.reduce((acc, f) => acc + f.size, 0);
	const totalGzipSize = assets.reduce((acc, f) => acc + f.gzipSize, 0);

	console.log(chalk.green.bold(`Total build size: ${formatSize(totalSize)}`));
	console.log(chalk.green.bold(`Total gzip size: ${formatSize(totalGzipSize)}`));
	console.log(chalk.gray(`Compression ratio: ${((1 - totalGzipSize / totalSize) * 100).toFixed(1)}%\n`));

	if (totalGzipSize > 500 * 1024) {
		console.log(chalk.yellow('⚠️  Warning: Total gzip size exceeds 500KB'));
		console.log(chalk.gray('   Consider code splitting or lazy loading\n'));
	}

	const perfScore = calculatePerformanceScore(totalGzipSize, jsFiles.length, cssFiles.length);
	console.log(chalk.cyan(`Performance Score: ${perfScore}/100`));

	if (perfScore >= 90) {
		console.log(chalk.green('✨ Excellent! Your build is highly optimized.'));
	} else if (perfScore >= 70) {
		console.log(chalk.yellow('👍 Good! Some room for optimization.'));
	} else {
		console.log(chalk.red('⚠️  Needs improvement. Consider optimization strategies.'));
	}
}

function calculatePerformanceScore(gzipSize, jsCount, cssCount) {
	let score = 100;

	if (gzipSize > 100 * 1024) score -= 10;
	if (gzipSize > 200 * 1024) score -= 10;
	if (gzipSize > 300 * 1024) score -= 10;
	if (gzipSize > 500 * 1024) score -= 20;

	if (jsCount > 10) score -= 10;
	if (jsCount > 20) score -= 10;

	if (cssCount > 5) score -= 5;
	if (cssCount > 10) score -= 5;

	return Math.max(0, score);
}

buildProject();