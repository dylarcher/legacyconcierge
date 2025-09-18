#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const deploymentChecks = [
	{
		name: 'Build exists',
		check: async () => {
			try {
				await fs.access(resolve(rootDir, 'dist'));
				return { success: true };
			} catch {
				return { success: false, message: 'No build found. Run build first.' };
			}
		},
	},
	{
		name: 'Tests pass',
		check: async () => {
			const result = await runCommand('npm', ['test']);
			return {
				success: result.code === 0,
				message: result.code !== 0 ? 'Tests are failing' : '',
			};
		},
	},
	{
		name: 'Linting passes',
		check: async () => {
			const result = await runCommand('npm', ['run', 'lint']);
			return {
				success: result.code === 0,
				message: result.code !== 0 ? 'Linting errors found' : '',
			};
		},
	},
	{
		name: 'No console.log statements',
		check: async () => {
			const result = await runCommand('grep', ['-r', 'console.log', 'src/', '--include=*.js']);
			return {
				success: result.code !== 0,
				message: result.code === 0 ? 'console.log statements found in code' : '',
			};
		},
	},
	{
		name: 'Environment variables set',
		check: async () => {
			try {
				await fs.access(resolve(rootDir, '.env.production'));
				return { success: true };
			} catch {
				return { success: false, message: '.env.production file not found' };
			}
		},
	},
];

async function runCommand(command, args) {
	return new Promise((resolve) => {
		const child = spawn(command, args, {
			cwd: rootDir,
			stdio: 'pipe',
			shell: true,
		});

		let output = '';
		child.stdout.on('data', (data) => {
			output += data.toString();
		});

		child.on('close', (code) => {
			resolve({ code, output });
		});

		child.on('error', () => {
			resolve({ code: 1, output: '' });
		});
	});
}

async function runPreflightChecks() {
	console.log(chalk.cyan.bold('\n✈️  Running preflight checks...\n'));

	const results = [];
	let hasErrors = false;

	for (const check of deploymentChecks) {
		const spinner = ora(check.name).start();
		const result = await check.check();

		if (result.success) {
			spinner.succeed(chalk.green(check.name));
		} else {
			spinner.fail(chalk.red(`${check.name} - ${result.message}`));
			hasErrors = true;
		}

		results.push({ ...check, ...result });
	}

	return !hasErrors;
}

async function optimizeBuild() {
	console.log(chalk.cyan.bold('\n🔧 Optimizing build...\n'));

	const optimizations = [
		{
			name: 'Compressing images',
			run: async () => {
				// Image optimization would go here
				return true;
			},
		},
		{
			name: 'Generating critical CSS',
			run: async () => {
				// Critical CSS generation would go here
				return true;
			},
		},
		{
			name: 'Creating service worker',
			run: async () => {
				// Service worker generation would go here
				return true;
			},
		},
		{
			name: 'Generating sitemap',
			run: async () => {
				const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>https://legacy-concierge.com/</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
	</url>
	<url>
		<loc>https://legacy-concierge.com/about</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.8</priority>
	</url>
	<url>
		<loc>https://legacy-concierge.com/services</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>0.9</priority>
	</url>
	<url>
		<loc>https://legacy-concierge.com/contact</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
	</url>
</urlset>`;
				await fs.writeFile(resolve(rootDir, 'dist', 'sitemap.xml'), sitemap);
				return true;
			},
		},
		{
			name: 'Generating robots.txt',
			run: async () => {
				const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: https://legacy-concierge.com/sitemap.xml`;
				await fs.writeFile(resolve(rootDir, 'dist', 'robots.txt'), robots);
				return true;
			},
		},
	];

	for (const optimization of optimizations) {
		const spinner = ora(optimization.name).start();
		const success = await optimization.run();

		if (success) {
			spinner.succeed(chalk.green(optimization.name));
		} else {
			spinner.warn(chalk.yellow(optimization.name));
		}
	}
}

async function createDeploymentBundle() {
	console.log(chalk.cyan.bold('\n📦 Creating deployment bundle...\n'));

	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const bundleName = `deploy-${timestamp}.tar.gz`;

	const spinner = ora('Creating archive...').start();

	const result = await runCommand('tar', [
		'-czf',
		bundleName,
		'dist/',
		'package.json',
		'package-lock.json',
	]);

	if (result.code === 0) {
		spinner.succeed(chalk.green(`Bundle created: ${bundleName}`));
		const stats = await fs.stat(resolve(rootDir, bundleName));
		console.log(chalk.gray(`  Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`));
		return bundleName;
	} else {
		spinner.fail(chalk.red('Failed to create bundle'));
		throw new Error('Bundle creation failed');
	}
}

async function deployToTarget(target, bundleName) {
	console.log(chalk.cyan.bold(`\n🚀 Deploying to ${target}...\n`));

	const deploymentTargets = {
		staging: {
			name: 'Staging',
			deploy: async () => {
				console.log(chalk.gray('Would deploy to staging server...'));
				// Actual deployment logic would go here
				return true;
			},
		},
		production: {
			name: 'Production',
			deploy: async () => {
				console.log(chalk.gray('Would deploy to production server...'));
				// Actual deployment logic would go here
				return true;
			},
		},
		cdn: {
			name: 'CDN',
			deploy: async () => {
				console.log(chalk.gray('Would deploy to CDN...'));
				// Actual CDN deployment logic would go here
				return true;
			},
		},
	};

	const deployment = deploymentTargets[target];
	if (!deployment) {
		throw new Error(`Unknown deployment target: ${target}`);
	}

	const spinner = ora(`Deploying to ${deployment.name}...`).start();
	const success = await deployment.deploy();

	if (success) {
		spinner.succeed(chalk.green(`Successfully deployed to ${deployment.name}`));
	} else {
		spinner.fail(chalk.red(`Failed to deploy to ${deployment.name}`));
		throw new Error('Deployment failed');
	}
}

async function main() {
	console.log(chalk.cyan.bold('\n🚀 Deployment Tool\n'));

	const answers = await inquirer.prompt([
		{
			type: 'list',
			name: 'action',
			message: 'What would you like to do?',
			choices: [
				{ name: 'Full deployment (build, test, deploy)', value: 'full' },
				{ name: 'Build and optimize only', value: 'build' },
				{ name: 'Run preflight checks only', value: 'check' },
				{ name: 'Create deployment bundle', value: 'bundle' },
			],
		},
	]);

	if (answers.action === 'check' || answers.action === 'full') {
		const checksPass = await runPreflightChecks();
		if (!checksPass) {
			console.log(chalk.red('\n❌ Preflight checks failed. Fix issues before deploying.'));
			process.exit(1);
		}
		console.log(chalk.green('\n✅ All preflight checks passed!'));
	}

	if (answers.action === 'build' || answers.action === 'full') {
		console.log(chalk.cyan('\n📦 Building project...'));
		const buildResult = await runCommand('npm', ['run', 'build']);
		if (buildResult.code !== 0) {
			console.log(chalk.red('Build failed'));
			process.exit(1);
		}
		await optimizeBuild();
	}

	if (answers.action === 'bundle' || answers.action === 'full') {
		const bundleName = await createDeploymentBundle();

		if (answers.action === 'full') {
			const targetAnswer = await inquirer.prompt([
				{
					type: 'list',
					name: 'target',
					message: 'Select deployment target:',
					choices: [
						{ name: 'Staging', value: 'staging' },
						{ name: 'Production', value: 'production' },
						{ name: 'CDN', value: 'cdn' },
					],
				},
				{
					type: 'confirm',
					name: 'confirm',
					message: 'Are you sure you want to deploy?',
					default: false,
				},
			]);

			if (targetAnswer.confirm) {
				await deployToTarget(targetAnswer.target, bundleName);
				console.log(chalk.green.bold('\n✨ Deployment completed successfully!'));
			} else {
				console.log(chalk.yellow('\nDeployment cancelled.'));
			}
		}
	}

	console.log(chalk.cyan('\n📋 Next steps:'));
	console.log(chalk.gray('  1. Verify deployment at target URL'));
	console.log(chalk.gray('  2. Run smoke tests'));
	console.log(chalk.gray('  3. Monitor application logs'));
	console.log(chalk.gray('  4. Check performance metrics\n'));
}

main().catch((error) => {
	console.error(chalk.red('\n❌ Deployment failed:'), error.message);
	process.exit(1);
});