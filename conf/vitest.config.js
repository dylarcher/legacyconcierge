import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	test: {
		globals: true,
		environment: 'happy-dom',
		environmentOptions: {
			happyDOM: {
				settings: {
					navigator: {
						userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
					},
				},
			},
		},
		setupFiles: ['./test/setup.js'],
		globalSetup: './test/global-setup.js',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'lcov'],
			reportsDirectory: './coverage',
			all: true,
			clean: true,
			skipFull: false,
			thresholds: {
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80,
			},
			include: ['src/**/*.{js,mjs}'],
			exclude: [
				'node_modules/',
				'dist/',
				'coverage/',
				'**/*.config.{js,mjs}',
				'**/*.test.{js,mjs}',
				'**/*.spec.{js,mjs}',
				'**/*.stories.{js,mjs}',
				'**/test/**',
				'**/tests/**',
				'**/__tests__/**',
				'**/__mocks__/**',
				'**/*.d.ts',
			],
		},
		include: [
			'src/**/*.{test,spec}.{js,mjs}',
			'test/**/*.{test,spec}.{js,mjs}',
		],
		exclude: [
			'node_modules',
			'dist',
			'.idea',
			'.git',
			'.cache',
			'test/e2e/**',
			'**/*.e2e.{test,spec}.{js,mjs}',
			'**/*.playwright.{test,spec}.{js,mjs}',
		],
		testTimeout: 10000,
		hookTimeout: 10000,
		teardownTimeout: 10000,
		isolate: true,
		pool: 'threads',
		poolOptions: {
			threads: {
				singleThread: false,
				isolate: true,
				useAtomics: true,
			},
		},
		mockReset: true,
		restoreMocks: true,
		clearMocks: true,
		reporters: ['verbose'],
		outputFile: {
			json: './reports/test-results.json',
			html: './reports/test-results.html',
			junit: './reports/junit.xml',
		},
		benchmark: {
			include: ['**/*.bench.{js,mjs}'],
			exclude: ['node_modules', 'dist'],
			reporters: ['verbose'],
			outputFile: './reports/benchmark.json',
		},
		typecheck: {
			enabled: false,
			checker: 'tsc',
			include: ['**/*.{test,spec}.ts'],
			tsconfig: './tsconfig.json',
		},
		cache: {
			dir: './.vitest',
		},
		sequence: {
			shuffle: false,
		},
		watch: true,
		watchExclude: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
		passWithNoTests: true,
		allowOnly: true,
		dangerouslyIgnoreUnhandledErrors: false,
		slowTestThreshold: 300,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@utils': path.resolve(__dirname, './src/utils'),
			'@styles': path.resolve(__dirname, './src/styles'),
			'@hooks': path.resolve(__dirname, './src/hooks'),
			'@services': path.resolve(__dirname, './src/services'),
			'@constants': path.resolve(__dirname, './src/constants'),
			'@types': path.resolve(__dirname, './src/types'),
			'@contexts': path.resolve(__dirname, './src/contexts'),
			'@test': path.resolve(__dirname, './test'),
		},
	},
	define: {
		__DEV__: process.env.NODE_ENV !== 'production',
		__TEST__: true,
	},
});