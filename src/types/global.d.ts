/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_APP_TITLE: string;
	readonly VITE_API_URL: string;
	readonly VITE_PUBLIC_URL: string;
	readonly MODE: 'development' | 'production' | 'test';
	readonly DEV: boolean;
	readonly PROD: boolean;
	readonly SSR: boolean;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
	readonly url: string;
	readonly hot?: {
		readonly accept: (cb?: (mod: any) => void) => void;
		readonly dispose: (cb: () => void) => void;
		readonly invalidate: () => void;
		readonly on: (event: string, cb: (...args: any[]) => void) => void;
		readonly send: (event: string, data?: any) => void;
	};
}

declare global {
	const __DEV__: boolean;
	const __TEST__: boolean;

	interface Window {
		__APP_VERSION__: string;
		__APP_NAME__: string;
	}

	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production' | 'test';
			VITE_APP_TITLE?: string;
			VITE_API_URL?: string;
			VITE_PUBLIC_URL?: string;
		}
	}
}

export {};