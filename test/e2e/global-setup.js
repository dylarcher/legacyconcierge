export default async function globalSetup() {
	console.log('🎭 Setting up Playwright test environment...');
	process.env.TEST_ENV = 'e2e';
	return async () => {
		console.log('🧹 Cleaning up Playwright test environment...');
	};
}
