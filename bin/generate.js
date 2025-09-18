#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import fs from 'fs/promises';
import chalk from 'chalk';
import inquirer from 'inquirer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

const componentTemplates = {
	ui: {
		js: `/**
 * @component {{ComponentName}}
 * @description {{description}}
 */
export class {{ComponentName}} extends HTMLElement {
	static observedAttributes = ['disabled', 'variant'];

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.render();
	}

	/**
	 * Component lifecycle - called when connected to DOM
	 * @returns {void}
	 */
	connectedCallback() {
		this.setAttribute('role', this.getAttribute('role') || 'button');
		this.addEventListener('click', this.handleClick.bind(this));
		this.addEventListener('keydown', this.handleKeydown.bind(this));
	}

	/**
	 * Component lifecycle - called when disconnected from DOM
	 * @returns {void}
	 */
	disconnectedCallback() {
		this.removeEventListener('click', this.handleClick);
		this.removeEventListener('keydown', this.handleKeydown);
	}

	/**
	 * Component lifecycle - called when attributes change
	 * @param {string} name - Attribute name
	 * @param {string} oldValue - Previous value
	 * @param {string} newValue - New value
	 * @returns {void}
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) {
			this.render();
		}
	}

	/**
	 * Handle click events
	 * @param {MouseEvent} event - Click event
	 * @returns {void}
	 */
	handleClick(event) {
		if (this.disabled) {
			event.preventDefault();
			return;
		}
		this.dispatchEvent(new CustomEvent('{{eventName}}', {
			detail: { value: this.value },
			bubbles: true,
			composed: true,
		}));
	}

	/**
	 * Handle keyboard events
	 * @param {KeyboardEvent} event - Keyboard event
	 * @returns {void}
	 */
	handleKeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this.click();
		}
	}

	/**
	 * Render component
	 * @returns {void}
	 */
	render() {
		const style = \`
			<style>
				:host {
					display: inline-block;
					--component-color: var(--color-primary, #000);
					--component-bg: var(--color-background, #fff);
				}

				:host([hidden]) {
					display: none;
				}

				:host([disabled]) {
					opacity: 0.5;
					cursor: not-allowed;
					pointer-events: none;
				}

				.{{componentName}} {
					padding: var(--spacing-md, 1rem);
					color: var(--component-color);
					background-color: var(--component-bg);
					border: 1px solid currentColor;
					border-radius: var(--border-radius-md, 0.25rem);
					cursor: pointer;
					transition: all var(--transition-fast, 150ms ease);
				}

				.{{componentName}}:hover:not([disabled]) {
					background-color: var(--component-color);
					color: var(--component-bg);
				}

				.{{componentName}}:focus-visible {
					outline: 2px solid var(--color-accent, #0066cc);
					outline-offset: 2px;
				}

				@media (prefers-reduced-motion: reduce) {
					.{{componentName}} {
						transition: none;
					}
				}
			</style>
		\`;

		const template = \`
			<div class="{{componentName}}" tabindex="0">
				<slot></slot>
			</div>
		\`;

		this.shadowRoot.innerHTML = style + template;
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(value) {
		if (value) {
			this.setAttribute('disabled', '');
		} else {
			this.removeAttribute('disabled');
		}
	}

	get value() {
		return this.getAttribute('value') || '';
	}

	set value(val) {
		this.setAttribute('value', val);
	}
}

customElements.define('{{component-name}}', {{ComponentName}});`,
		test: `import { describe, it, expect, beforeEach, vi } from 'vitest';
import './{{ComponentName}}.js';

describe('{{ComponentName}}', () => {
	let element;

	beforeEach(() => {
		document.body.innerHTML = '';
		element = document.createElement('{{component-name}}');
		document.body.appendChild(element);
	});

	it('should render correctly', () => {
		expect(element).toBeDefined();
		expect(element.shadowRoot).toBeDefined();
	});

	it('should handle disabled state', () => {
		element.disabled = true;
		expect(element.hasAttribute('disabled')).toBe(true);
		expect(element.disabled).toBe(true);

		element.disabled = false;
		expect(element.hasAttribute('disabled')).toBe(false);
		expect(element.disabled).toBe(false);
	});

	it('should emit custom event on click', () => {
		const handler = vi.fn();
		element.addEventListener('{{eventName}}', handler);

		element.click();

		expect(handler).toHaveBeenCalled();
	});

	it('should not emit event when disabled', () => {
		const handler = vi.fn();
		element.addEventListener('{{eventName}}', handler);
		element.disabled = true;

		element.click();

		expect(handler).not.toHaveBeenCalled();
	});

	it('should handle keyboard navigation', () => {
		const handler = vi.fn();
		element.addEventListener('{{eventName}}', handler);

		const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
		element.dispatchEvent(enterEvent);

		expect(handler).toHaveBeenCalled();
	});
});`,
		index: `export { {{ComponentName}} } from './{{ComponentName}}.js';`,
	},
	layout: {
		js: `/**
 * @component {{ComponentName}}
 * @description {{description}}
 */
export class {{ComponentName}} {
	/**
	 * Create a new {{ComponentName}} instance
	 * @param {HTMLElement} container - Container element
	 * @param {Object} options - Configuration options
	 */
	constructor(container, options = {}) {
		this.container = container;
		this.options = {
			gap: 'var(--spacing-md)',
			columns: 'auto',
			...options,
		};
		this.init();
	}

	/**
	 * Initialize the component
	 * @returns {void}
	 */
	init() {
		this.setupStyles();
		this.setupResizeObserver();
		this.render();
	}

	/**
	 * Setup component styles
	 * @returns {void}
	 */
	setupStyles() {
		this.container.style.display = 'grid';
		this.container.style.gap = this.options.gap;
		this.container.style.gridTemplateColumns = this.options.columns;
	}

	/**
	 * Setup resize observer for responsive behavior
	 * @returns {void}
	 */
	setupResizeObserver() {
		if ('ResizeObserver' in window) {
			this.resizeObserver = new ResizeObserver(entries => {
				for (const entry of entries) {
					this.handleResize(entry.contentRect);
				}
			});
			this.resizeObserver.observe(this.container);
		}
	}

	/**
	 * Handle container resize
	 * @param {DOMRectReadOnly} rect - Container dimensions
	 * @returns {void}
	 */
	handleResize(rect) {
		const width = rect.width;
		if (width < 768) {
			this.container.style.gridTemplateColumns = '1fr';
		} else if (width < 1024) {
			this.container.style.gridTemplateColumns = 'repeat(2, 1fr)';
		} else {
			this.container.style.gridTemplateColumns = this.options.columns;
		}
	}

	/**
	 * Render the component
	 * @returns {void}
	 */
	render() {
		this.container.setAttribute('data-layout', '{{componentName}}');
	}

	/**
	 * Update component options
	 * @param {Object} newOptions - New configuration options
	 * @returns {void}
	 */
	update(newOptions) {
		this.options = { ...this.options, ...newOptions };
		this.setupStyles();
	}

	/**
	 * Destroy the component
	 * @returns {void}
	 */
	destroy() {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}
		this.container.removeAttribute('data-layout');
		this.container.removeAttribute('style');
	}
}`,
	},
	service: {
		js: `/**
 * @service {{ComponentName}}
 * @description {{description}}
 */
export class {{ComponentName}} {
	/**
	 * Create a new {{ComponentName}} service
	 * @param {Object} config - Service configuration
	 */
	constructor(config = {}) {
		this.config = {
			baseUrl: '/api',
			timeout: 30000,
			...config,
		};
		this.abortControllers = new Map();
	}

	/**
	 * Make an API request
	 * @param {string} endpoint - API endpoint
	 * @param {Object} options - Request options
	 * @returns {Promise<any>} Response data
	 */
	async request(endpoint, options = {}) {
		const url = \`\${this.config.baseUrl}\${endpoint}\`;
		const requestId = \`\${options.method || 'GET'}-\${endpoint}\`;

		if (this.abortControllers.has(requestId)) {
			this.abortControllers.get(requestId).abort();
		}

		const controller = new AbortController();
		this.abortControllers.set(requestId, controller);

		const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

		try {
			const response = await fetch(url, {
				...options,
				signal: controller.signal,
				headers: {
					'Content-Type': 'application/json',
					...options.headers,
				},
			});

			clearTimeout(timeoutId);
			this.abortControllers.delete(requestId);

			if (!response.ok) {
				throw new Error(\`HTTP error! status: \${response.status}\`);
			}

			return await response.json();
		} catch (error) {
			clearTimeout(timeoutId);
			this.abortControllers.delete(requestId);

			if (error.name === 'AbortError') {
				throw new Error('Request was cancelled or timed out');
			}

			throw error;
		}
	}

	/**
	 * GET request
	 * @param {string} endpoint - API endpoint
	 * @param {Object} params - Query parameters
	 * @returns {Promise<any>} Response data
	 */
	async get(endpoint, params = {}) {
		const queryString = new URLSearchParams(params).toString();
		const url = queryString ? \`\${endpoint}?\${queryString}\` : endpoint;
		return this.request(url, { method: 'GET' });
	}

	/**
	 * POST request
	 * @param {string} endpoint - API endpoint
	 * @param {Object} data - Request body
	 * @returns {Promise<any>} Response data
	 */
	async post(endpoint, data) {
		return this.request(endpoint, {
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	/**
	 * PUT request
	 * @param {string} endpoint - API endpoint
	 * @param {Object} data - Request body
	 * @returns {Promise<any>} Response data
	 */
	async put(endpoint, data) {
		return this.request(endpoint, {
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	/**
	 * DELETE request
	 * @param {string} endpoint - API endpoint
	 * @returns {Promise<any>} Response data
	 */
	async delete(endpoint) {
		return this.request(endpoint, { method: 'DELETE' });
	}

	/**
	 * Cancel all pending requests
	 * @returns {void}
	 */
	cancelAll() {
		this.abortControllers.forEach(controller => controller.abort());
		this.abortControllers.clear();
	}
}`,
	},
};

function toCamelCase(str) {
	return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function toPascalCase(str) {
	const camel = toCamelCase(str);
	return camel.charAt(0).toUpperCase() + camel.slice(1);
}

async function generateComponent(type, name, description) {
	const componentName = toPascalCase(name);
	const componentNameLower = name.toLowerCase();
	const eventName = toCamelCase(name) + 'Action';

	const templates = componentTemplates[type] || componentTemplates.ui;

	const replacements = {
		'{{ComponentName}}': componentName,
		'{{componentName}}': toCamelCase(name),
		'{{component-name}}': componentNameLower,
		'{{description}}': description,
		'{{eventName}}': eventName,
	};

	const processTemplate = (template) => {
		let processed = template;
		Object.entries(replacements).forEach(([key, value]) => {
			processed = processed.replace(new RegExp(key, 'g'), value);
		});
		return processed;
	};

	const componentDir = resolve(rootDir, 'src', 'components', type, componentName);

	try {
		await fs.mkdir(componentDir, { recursive: true });

		if (templates.js) {
			await fs.writeFile(
				join(componentDir, `${componentName}.js`),
				processTemplate(templates.js)
			);
		}

		if (templates.test) {
			await fs.writeFile(
				join(componentDir, `${componentName}.test.js`),
				processTemplate(templates.test)
			);
		}

		if (templates.index) {
			await fs.writeFile(
				join(componentDir, 'index.js'),
				processTemplate(templates.index)
			);
		}

		const cssContent = `/* ${componentName} styles */
.${componentNameLower} {
	/* Component styles here */
}`;

		await fs.writeFile(
			join(componentDir, `${componentName}.css`),
			cssContent
		);

		console.log(chalk.green(`✓ Component created successfully at:`));
		console.log(chalk.cyan(`  ${componentDir}`));
		console.log(chalk.gray('\nFiles created:'));
		console.log(chalk.gray(`  - ${componentName}.js`));
		console.log(chalk.gray(`  - ${componentName}.css`));
		console.log(chalk.gray(`  - ${componentName}.test.js`));
		console.log(chalk.gray(`  - index.js`));

	} catch (error) {
		console.error(chalk.red('Failed to create component:'), error);
		process.exit(1);
	}
}

async function main() {
	console.log(chalk.cyan.bold('\n🎨 Component Generator\n'));

	const answers = await inquirer.prompt([
		{
			type: 'list',
			name: 'type',
			message: 'What type of component would you like to create?',
			choices: [
				{ name: 'UI Component (Button, Input, etc.)', value: 'ui' },
				{ name: 'Layout Component (Grid, Container, etc.)', value: 'layout' },
				{ name: 'Form Component', value: 'forms' },
				{ name: 'Feedback Component (Toast, Modal, etc.)', value: 'feedback' },
				{ name: 'Navigation Component', value: 'navigation' },
				{ name: 'Data Display Component (Table, List, etc.)', value: 'data-display' },
				{ name: 'Service/Utility', value: 'service' },
			],
		},
		{
			type: 'input',
			name: 'name',
			message: 'Component name (kebab-case):',
			validate: (input) => {
				if (!/^[a-z]+(-[a-z]+)*$/.test(input)) {
					return 'Please use kebab-case (e.g., my-component)';
				}
				return true;
			},
		},
		{
			type: 'input',
			name: 'description',
			message: 'Brief description:',
			default: 'A custom web component',
		},
	]);

	await generateComponent(answers.type, answers.name, answers.description);
}

main();