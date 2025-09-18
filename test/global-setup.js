export async function setup() {
	console.log('⚙️  Setting up test environment...');
	process.env.NODE_ENV = 'test';
}

export async function teardown() {
	console.log('🧹 Cleaning up test environment...');
}
