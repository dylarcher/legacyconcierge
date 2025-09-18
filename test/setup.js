import { beforeAll, afterEach, afterAll } from 'vitest';

beforeAll(() => {
	global.CSS = {
		supports: () => true,
		escape: (str) => str,
	};

	global.CSSStyleSheet = class CSSStyleSheet {
		constructor() {
			this.cssRules = [];
		}
		insertRule() {
			return 0;
		}
		deleteRule() {}
		replaceSync() {}
	};

	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: vi.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});

	Object.defineProperty(window, 'IntersectionObserver', {
		writable: true,
		value: vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn(),
			takeRecords: vi.fn(),
		})),
	});

	Object.defineProperty(window, 'ResizeObserver', {
		writable: true,
		value: vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			unobserve: vi.fn(),
			disconnect: vi.fn(),
		})),
	});

	Object.defineProperty(window, 'MutationObserver', {
		writable: true,
		value: vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			disconnect: vi.fn(),
			takeRecords: vi.fn(),
		})),
	});

	Object.defineProperty(window, 'scrollTo', {
		writable: true,
		value: vi.fn(),
	});

	Object.defineProperty(window, 'requestAnimationFrame', {
		writable: true,
		value: vi.fn((callback) => {
			setTimeout(callback, 0);
			return 0;
		}),
	});

	Object.defineProperty(window, 'cancelAnimationFrame', {
		writable: true,
		value: vi.fn(),
	});

	Object.defineProperty(window, 'requestIdleCallback', {
		writable: true,
		value: vi.fn((callback) => {
			setTimeout(callback, 0);
			return 0;
		}),
	});

	Object.defineProperty(window, 'cancelIdleCallback', {
		writable: true,
		value: vi.fn(),
	});

	global.fetch = vi.fn();

	global.structuredClone =
		global.structuredClone ||
		((obj) => {
			return JSON.parse(JSON.stringify(obj));
		});

	global.CustomEvent =
		global.CustomEvent ||
		class CustomEvent extends Event {
			constructor(event, params) {
				super(event, params);
				this.detail = params?.detail || null;
			}
		};

	global.localStorage = {
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
		key: vi.fn(),
		length: 0,
	};

	global.sessionStorage = {
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
		key: vi.fn(),
		length: 0,
	};
});

afterEach(() => {
	vi.clearAllMocks();
	vi.restoreAllMocks();
	document.body.innerHTML = '';
	document.head.innerHTML = '';
});

afterAll(() => {
	vi.resetAllMocks();
});