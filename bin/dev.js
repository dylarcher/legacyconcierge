#!/usr/bin/env node

import { spawn } from 'child_process';
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import chalk from 'chalk';
import ora from 'ora';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const spinner = ora('Starting development server...').start();

async function startDevServer() {
	try {
		const server = await createServer({
			configFile: resolve(rootDir, 'conf/vite.config.js'),
			root: resolve(rootDir, 'src'),
			server: {
				port: process.env.PORT || 5173,
				open: true,
				host: true,
			},
		});

		await server.listen();

		spinner.succeed(chalk.green('Development server started successfully!'));

		server.printUrls();

		console.log('\n' + chalk.cyan('Available commands:'));
		console.log(chalk.gray('  Press r to restart the server'));
		console.log(chalk.gray('  Press u to show server url'));
		console.log(chalk.gray('  Press o to open in browser'));
		console.log(chalk.gray('  Press c to clear console'));
		console.log(chalk.gray('  Press q to quit\n'));

		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.setEncoding('utf8');

		process.stdin.on('data', async (key) => {
			if (key === 'q') {
				await server.close();
				process.exit(0);
			} else if (key === 'r') {
				console.log(chalk.yellow('\nRestarting server...'));
				await server.restart();
				console.log(chalk.green('Server restarted!'));
			} else if (key === 'u') {
				server.printUrls();
			} else if (key === 'o') {
				spawn('open', [`http://localhost:${server.config.server.port}`]);
			} else if (key === 'c') {
				console.clear();
				server.printUrls();
			}
		});
	} catch (error) {
		spinner.fail(chalk.red('Failed to start development server'));
		console.error(error);
		process.exit(1);
	}
}

startDevServer();
