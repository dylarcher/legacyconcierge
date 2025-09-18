export default {
	printWidth: 100,
	tabWidth: 2,
	useTabs: true,
	semi: true,
	singleQuote: true,
	quoteProps: 'as-needed',
	jsxSingleQuote: false,
	trailingComma: 'es5',
	bracketSpacing: true,
	bracketSameLine: false,
	arrowParens: 'always',
	endOfLine: 'lf',
	embeddedLanguageFormatting: 'auto',
	singleAttributePerLine: false,
	htmlWhitespaceSensitivity: 'css',
	proseWrap: 'preserve',
	experimentalTernaries: true,
	overrides: [
		{
			files: ['*.html'],
			options: {
				printWidth: 120,
				tabWidth: 2,
				useTabs: true,
				singleAttributePerLine: true,
			},
		},
		{
			files: ['*.css'],
			options: {
				singleQuote: false,
			},
		},
		{
			files: ['*.json', '*.jsonc', 'package.json'],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
		{
			files: ['*.md'],
			options: {
				proseWrap: 'always',
				printWidth: 80,
				useTabs: false,
			},
		},
		{
			files: ['*.yml', '*.yaml'],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
};