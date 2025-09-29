export default {
	extends: ['stylelint-config-standard'],
	rules: {
		'alpha-value-notation': 'number',
		'at-rule-empty-line-before': [
			'always',
			{
				except: ['blockless-after-same-name-blockless', 'first-nested'],
				ignore: ['after-comment'],
				ignoreAtRules: ['layer', 'scope', 'container', 'supports', 'media'],
			},
		],
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: ['layer', 'scope', 'container', 'starting-style'],
			},
		],
		'color-function-notation': 'modern',
		'color-hex-length': 'long',
		'custom-property-pattern': '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
		'declaration-block-no-duplicate-properties': [
			true,
			{
				ignore: ['consecutive-duplicates-with-different-syntaxes'],
			},
		],
		'declaration-block-no-redundant-longhand-properties': [
			true,
			{
				ignoreShorthands: ['/grid/', 'container'],
			},
		],
		'declaration-empty-line-before': 'never',
		'font-family-name-quotes': 'always-where-recommended',
		'function-name-case': [
			'lower',
			{
				ignoreFunctions: ['/^(oklch|oklab|color-mix|light-dark|color)$/'],
			},
		],
		'function-url-quotes': 'always',
		'import-notation': 'url',
		'keyframes-name-pattern': '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
		'media-feature-range-notation': 'context',
		'no-descending-specificity': null,
		'no-invalid-position-at-import-rule': [
			true,
			{
				ignoreAtRules: ['layer'],
			},
		],
		'property-no-vendor-prefix': [
			true,
			{
				ignoreProperties: ['appearance', 'backdrop-filter', 'clip-path', 'mask-image', 'mask-size'],
			},
		],
		'rule-empty-line-before': [
			'always',
			{
				except: ['first-nested'],
				ignore: ['after-comment'],
			},
		],
		'selector-attribute-quotes': 'always',
		'selector-class-pattern': [
			'^([a-z][a-z0-9]*)(-[a-z0-9]+)*(__[a-z][a-z0-9]*(-[a-z0-9]+)*)?(--[a-z][a-z0-9]*(-[a-z0-9]+)*)?$',
			{
				message: 'Expected class selector to be in BEM format',
				resolveNestedSelectors: true,
			},
		],
		'selector-id-pattern': '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
		'selector-not-notation': 'complex',
		'selector-no-vendor-prefix': true,
		'selector-pseudo-element-colon-notation': 'double',
		'selector-type-no-unknown': [
			true,
			{
				ignore: ['custom-elements'],
				ignoreTypes: ['/^app-/', '/^legacy-/'],
			},
		],
		'value-keyword-case': [
			'lower',
			{
				ignoreKeywords: [
					'currentColor',
					'transparent',
					'inherit',
					'revert',
					'revert-layer',
					'unset',
				],
				camelCaseSvgKeywords: true,
			},
		],
		'value-no-vendor-prefix': [
			true,
			{
				ignoreValues: ['grab', 'grabbing', 'sticky'],
			},
		],
		'property-no-unknown': [
			true,
			{
				ignoreProperties: [
					'container-type',
					'container-name',
					'container',
					'view-timeline',
					'view-timeline-name',
					'view-timeline-axis',
					'view-timeline-inset',
					'animation-timeline',
					'animation-range',
					'animation-range-start',
					'animation-range-end',
					'timeline-scope',
					'scroll-timeline',
					'scroll-timeline-name',
					'scroll-timeline-axis',
					'anchor-name',
					'anchor-scope',
					'position-anchor',
					'position-area',
					'position-try',
					'position-try-options',
					'position-try-order',
					'position-visibility',
					'inset-area',
				],
			},
		],
		'unit-no-unknown': [
			true,
			{
				ignoreUnits: [
					'dvh',
					'dvw',
					'svh',
					'svw',
					'lvh',
					'lvw',
					'cqw',
					'cqh',
					'cqi',
					'cqb',
					'cqmin',
					'cqmax',
				],
			},
		],
		'function-no-unknown': [
			true,
			{
				ignoreFunctions: [
					'light-dark',
					'color-mix',
					'oklch',
					'oklab',
					'color',
					'hwb',
					'lch',
					'lab',
					'color-contrast',
					'device-cmyk',
					'scroll',
					'view',
					'anchor',
					'anchor-size',
				],
			},
		],
		'number-max-precision': 4,
		'shorthand-property-no-redundant-values': true,
		'declaration-block-single-line-max-declarations': 1,
		'selector-max-compound-selectors': 4,
		'selector-max-specificity': '0,4,2',
		'max-nesting-depth': [
			3,
			{
				ignore: ['blockless-at-rules', 'pseudo-classes'],
				ignoreAtRules: ['media', 'supports', 'container'],
			},
		],
		'declaration-property-value-no-unknown': true,
		'annotation-no-unknown': true,
		'comment-empty-line-before': [
			'always',
			{
				except: ['first-nested'],
				ignore: ['after-comment', 'stylelint-commands'],
			},
		],
		'comment-whitespace-inside': 'always',
	},
	ignoreFiles: [
		'node_modules/**',
		'dist/**',
		'build/**',
		'coverage/**',
		'**/*.min.css',
		'**/*.js',
		'**/*.ts',
		'**/*.jsx',
		'**/*.tsx',
	],
	reportDescriptionlessDisables: true,
	reportInvalidScopeDisables: true,
	reportNeedlessDisables: true,
};
