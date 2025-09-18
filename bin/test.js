#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const testOptions = {
	unit: {
		name: 'Unit Tests',
		command: 'vitest',
		args: [],
		description: 'Run unit tests',
	},
	watch: {
		name: 'Watch Tests',
		command: 'vitest',
		args: ['--watch'],
		description: 'Run tests in watch mode',
	},
	coverage: {
		name: 'Coverage Report',
		command: 'vitest',
		args: ['--coverage'],
		description: 'Generate test coverage report',
	},
	ui: {
		name: 'Test UI',
		command: 'vitest',
		args: ['--ui'],
		description: 'Open test UI in browser',
	},
	a11y: {
		name: 'Accessibility Tests',
		command: 'pa11y-ci',
		args: [],
		description: 'Run accessibility tests',
	},
	e2e: {
		name: 'E2E Tests',
		command: 'playwright',
		args: ['test'],
		description: 'Run end-to-end tests',
	},
	specific: {
		name: 'Test Specific File',
		command: 'vitest',
		args: [],
		description: 'Run tests for a specific file',
		needsInput: true,
	},
};

async function runTest(type, additionalArgs = []) {
	const test = testOptions[type];

	console.log(chalk.cyan(`\n🧪 Running ${test.name}...\n`));

	return new Promise((resolve, reject) => {
		const child = spawn('npx', [test.command, ...test.args, ...additionalArgs], {
			cwd: rootDir,
			stdio: 'inherit',
			shell: true,
		});

		child.on('close', (code) => {
			if (code === 0) {
				console.log(chalk.green(`\n✓ ${test.name} completed successfully!`));
				resolve(code);
			} else {
				console.log(chalk.red(`\n✗ ${test.name} failed with code ${code}`));
				reject(code);
			}
		});

		child.on('error', (error) => {
			console.error(chalk.red(`\n✗ Failed to run ${test.name}:`), error);
			reject(error);
		});
	});
}

async function interactiveMode() {
	const answers = await inquirer.prompt([
		{
			type: 'list',
			name: 'testType',
			message: 'Which tests would you like to run?',
			choices: Object.entries(testOptions).map(([key, value]) => ({
				name: `${value.name} - ${chalk.gray(value.description)}`,
				value: key,
			})),
		},
	]);

	const testType = answers.testType;
	let additionalArgs = [];

	if (testOptions[testType].needsInput) {
		const input = await inquirer.prompt([
			{
				type: 'input',
				name: 'file',
				message: 'Enter the file path or pattern to test:',
				default: 'src/**/*.test.js',
			},
		]);
		additionalArgs = [input.file];
	}

	try {
		await runTest(testType, additionalArgs);
	} catch (error) {
		process.exit(1);
	}
}

async function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		await interactiveMode();
	} else {
		const testType = args[0];

		if (!testOptions[testType]) {
			console.error(chalk.red(`Unknown test type: ${testType}`));
			console.log(chalk.cyan('\nAvailable test types:'));
			Object.entries(testOptions).forEach(([key, value]) => {
				console.log(chalk.gray(`  ${key.padEnd(10)} - ${value.description}`));
			});
			process.exit(1);
		}

		try {
			await runTest(testType, args.slice(1));
		} catch (error) {
			process.exit(1);
		}
	}
}

main();