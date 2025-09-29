export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'feat', // New feature
				'fix', // Bug fix
				'docs', // Documentation changes
				'style', // Code style changes (formatting, missing semi colons, etc)
				'refactor', // Code refactoring
				'perf', // Performance improvements
				'test', // Adding or updating tests
				'build', // Build system or external dependencies changes
				'ci', // CI/CD configuration changes
				'chore', // Other changes that don't modify src or test files
				'revert', // Reverts a previous commit
				'security', // Security improvements
				'deps', // Dependency updates
				'breaking', // Breaking changes
			],
		],
		'type-case': [2, 'always', 'lower-case'],
		'type-empty': [2, 'never'],
		'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
		'subject-empty': [2, 'never'],
		'subject-full-stop': [2, 'never', '.'],
		'header-max-length': [2, 'always', 100],
		'body-leading-blank': [2, 'always'],
		'body-max-line-length': [2, 'always', 100],
		'footer-leading-blank': [2, 'always'],
		'footer-max-line-length': [2, 'always', 100],
	},
};
