import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	root: 'src',
	base: '/',
	publicDir: '../public',
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
		},
	},
	build: {
		outDir: '../dist',
		emptyOutDir: true,
		sourcemap: true,
		modulePreload: {
			polyfill: true,
		},
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'src/index.html'),
			},
			output: {
				assetFileNames: (assetInfo) => {
					const info = assetInfo.name.split('.');
					const ext = info[info.length - 1];
					if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
						return `assets/images/[name]-[hash][extname]`;
					}
					if (/woff2?|ttf|otf|eot/i.test(ext)) {
						return `assets/fonts/[name]-[hash][extname]`;
					}
					return `assets/[name]-[hash][extname]`;
				},
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
			},
		},
		target: 'esnext',
		minify: 'esbuild',
		cssMinify: 'lightningcss',
		cssCodeSplit: true,
		reportCompressedSize: true,
		assetsInlineLimit: 4096,
		chunkSizeWarningLimit: 500,
	},
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			targets: {
				chrome: 120,
				firefox: 120,
				safari: 17,
				edge: 120,
			},
			drafts: {
				customMedia: true,
				nesting: true,
			},
		},
		devSourcemap: true,
	},
	plugins: [
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'safari-pinned-tab.svg'],
			manifest: {
				name: 'Legacy Concierge',
				short_name: 'Legacy',
				description:
					'A modern vanilla JavaScript website and CMS with focus on accessibility, performance, and SEO',
				theme_color: '#000000',
				background_color: '#ffffff',
				display: 'standalone',
				scope: '/',
				start_url: '/?source=pwa',
				orientation: 'any',
				dir: 'ltr',
				lang: 'en',
				categories: ['business', 'productivity'],
				iarc_rating_id: '',
				prefer_related_applications: false,
				icons: [
					{
						src: '/icon-72.png',
						sizes: '72x72',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: '/icon-96.png',
						sizes: '96x96',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: '/icon-128.png',
						sizes: '128x128',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: '/icon-144.png',
						sizes: '144x144',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: '/icon-152.png',
						sizes: '152x152',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: '/icon-192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: '/icon-384.png',
						sizes: '384x384',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any',
					},
					{
						src: '/icon-maskable-192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'maskable',
					},
					{
						src: '/icon-maskable-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
				shortcuts: [
					{
						name: 'Dashboard',
						url: '/dashboard',
						icons: [{ src: '/icon-96.png', sizes: '96x96' }],
					},
				],
				edge_side_panel: {
					preferred_width: 480,
				},
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,avif,woff2,json}'],
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
				cleanupOutdatedCaches: true,
				clientsClaim: true,
				skipWaiting: true,
				navigateFallback: '/index.html',
				navigateFallbackDenylist: [/^\/api\//, /^\/admin\//],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts',
							expiration: {
								maxEntries: 20,
								maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|avif|ico|bmp|tiff)$/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'images',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						urlPattern: /\.(woff2?|ttf|otf|eot)$/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'fonts',
							expiration: {
								maxEntries: 20,
								maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						urlPattern: /^https:\/\/api\./i,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'api',
							networkTimeoutSeconds: 5,
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60, // 1 hour
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
				],
			},
			devOptions: {
				enabled: true,
				type: 'module',
			},
		}),
	],
	optimizeDeps: {
		include: [],
		exclude: [],
		esbuildOptions: {
			target: 'esnext',
			supported: {
				'top-level-await': true,
			},
		},
	},
	server: {
		port: 5173,
		strictPort: false,
		host: true,
		open: true,
		cors: true,
		headers: {
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'SAMEORIGIN',
			'X-XSS-Protection': '1; mode=block',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
			'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
		},
		warmup: {
			clientFiles: ['./src/index.js', './src/**/*.js'],
		},
	},
	preview: {
		port: 4173,
		strictPort: false,
		host: true,
		open: true,
		cors: true,
		headers: {
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'SAMEORIGIN',
			'X-XSS-Protection': '1; mode=block',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
			'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
			'Content-Security-Policy':
				"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
		},
	},
});
