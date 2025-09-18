#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import chalk from 'chalk';
import ora from 'ora';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const checks = [
	{
		name: 'ESLint',
		command: 'npx',
		args: ['eslint', 'src/**/*.js'],
		errorMessage: 'JavaScript linting failed',
	},
	{
		name: 'Stylelint',
		command: 'npx',
		args: ['stylelint', 'src/**/*.css'],
		errorMessage: 'CSS linting failed',
	},
	{
		name: 'Prettier',
		command: 'npx',
		args: ['prettier', '--check', '.'],
		errorMessage: 'Code formatting check failed',
	},
	{
		name: 'HTML Validate',
		command: 'npx',
		args: ['html-validate', 'src/**/*.html'],
		errorMessage: 'HTML validation failed',
	},
	{
		name: 'TypeScript Check',
		command: 'npx',
		args: ['tsc', '--noEmit'],
		errorMessage: 'TypeScript type checking failed',
	},
];

async function runCheck(check) {
	return new Promise((resolve) => {
		const child = spawn(check.command, check.args, {
			cwd: rootDir,
			stdio: 'pipe',
			shell: true,
		});

		let output = '';
		let errorOutput = '';

		child.stdout.on('data', (data) => {
			output += data.toString();
		});

		child.stderr.on('data', (data) => {
			errorOutput += data.toString();
		});

		child.on('close', (code) => {
			resolve({
				success: code === 0,
				output,
				errorOutput,
				code,
			});
		});

		child.on('error', (error) => {
			resolve({
				success: false,
				output: '',
				errorOutput: error.message,
				code: 1,
			});
		});
	});
}

async function runAllChecks() {
	console.log(chalk.cyan.bold('\n🔍 Running code quality checks...\n'));

	const results = [];
	let hasErrors = false;

	for (const check of checks) {
		const spinner = ora(`Running ${check.name}...`).start();

		const result = await runCheck(check);
		results.push({ ...check, ...result });

		if (result.success) {
			spinner.succeed(chalk.green(`${check.name} passed`));
		} else {
			spinner.fail(chalk.red(`${check.name} failed`));
			hasErrors = true;

			if (result.errorOutput) {
				console.log(chalk.gray(result.errorOutput));
			}
			if (result.output) {
				console.log(chalk.gray(result.output));
			}
		}
	}

	console.log('\n' + chalk.cyan('━'.repeat(50)));
	console.log(chalk.cyan.bold('Summary:'));
	console.log(chalk.cyan('━'.repeat(50)));

	const passed = results.filter(r => r.success).length;
	const failed = results.filter(r => !r.success).length;

	console.log(chalk.green(`✓ Passed: ${passed}`));
	if (failed > 0) {
		console.log(chalk.red(`✗ Failed: ${failed}`));
	}

	if (!hasErrors) {
		console.log(chalk.green.bold('\n🎉 All checks passed! Your code is looking great!'));
		await runQuickFix();
	} else {
		console.log(chalk.yellow.bold('\n⚠️  Some checks failed. Would you like to auto-fix?'));
		await promptAutoFix();
	}

	process.exit(hasErrors ? 1 : 0);
}

async function promptAutoFix() {
	const readline = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	readline.question(chalk.cyan('Run auto-fix? (y/n): '), async (answer) => {
		readline.close();

		if (answer.toLowerCase() === 'y') {
			await runAutoFix();
		} else {
			console.log(chalk.gray('Skipping auto-fix.'));
		}
	});
}

async function runAutoFix() {
	console.log(chalk.cyan('\n🔧 Running auto-fix...\n'));

	const fixes = [
		{
			name: 'ESLint fix',
			command: 'npx',
			args: ['eslint', 'src/**/*.js', '--fix'],
		},
		{
			name: 'Stylelint fix',
			command: 'npx',
			args: ['stylelint', 'src/**/*.css', '--fix'],
		},
		{
			name: 'Prettier format',
			command: 'npx',
			args: ['prettier', '--write', '.'],
		},
	];

	for (const fix of fixes) {
		const spinner = ora(`Running ${fix.name}...`).start();

		const result = await runCheck(fix);

		if (result.success) {
			spinner.succeed(chalk.green(`${fix.name} completed`));
		} else {
			spinner.warn(chalk.yellow(`${fix.name} had issues`));
		}
	}

	console.log(chalk.green('\n✓ Auto-fix completed. Please review the changes.'));
}

async function runQuickFix() {
	console.log(chalk.gray('\n💡 Tip: Run `npm run format` to auto-format your code'));
}

runAllChecks();