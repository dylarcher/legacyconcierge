// @ts-nocheck
/**
 * Web Vitals Performance Monitoring
 *
 * Tracks and displays Core Web Vitals metrics for development and testing.
 * Metrics tracked:
 * - CLS (Cumulative Layout Shift)
 * - FID (First Input Delay) / INP (Interaction to Next Paint)
 * - LCP (Largest Contentful Paint)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 *
 * Usage:
 * - Automatically displays metrics overlay in development mode
 * - Can be toggled with keyboard shortcut: Ctrl+Shift+V
 * - Logs detailed metrics to console
 *
 * @see https://web.dev/vitals/
 */

import {
    onCLS,
    onFCP,
    onINP,
    onLCP,
    onTTFB,
} from "/node_modules/web-vitals/dist/web-vitals.js";

// Store metrics data
const metrics = {
	CLS: null,
	INP: null,
	LCP: null,
	FCP: null,
	TTFB: null,
};
// Thresholds for metric evaluation (good/needs-improvement/poor)
const thresholds = {
	CLS: { good: 0.1, poor: 0.25 },
	FID: { good: 100, poor: 300 },
	INP: { good: 200, poor: 500 },
	LCP: { good: 2500, poor: 4000 },
	FCP: { good: 1800, poor: 3000 },
	TTFB: { good: 800, poor: 1800 },
};

/**
 * Determine rating based on metric value and thresholds
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @returns {string} - 'good', 'needs-improvement', or 'poor'
 */
function _getRating(name, value) {
	const threshold = thresholds[name];
	if (!threshold) return "unknown";

	if (value <= threshold.good) return "good";
	if (value <= threshold.poor) return "needs-improvement";
	return "poor";
}

/**
 * Format metric value for display
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 * @returns {string} - Formatted value with units
 */
function formatValue(name, value) {
	if (name === "CLS") {
		return value.toFixed(3);
	}
	return `${Math.round(value)}ms`;
}

/**
 * Get color for rating
 * @param {string} rating - 'good', 'needs-improvement', or 'poor'
 * @returns {string} - CSS color value
 */
function getRatingColor(rating) {
	switch (rating) {
		case "good":
			return "#0cce6b";
		case "needs-improvement":
			return "#ffa400";
		case "poor":
			return "#ff4e42";
		default:
			return "#888";
	}
}

/**
 * Log metric to console with formatting
 * @param {Object} metric - Metric object from web-vitals
 */
function logMetric(metric) {
	const { name, value, rating } = metric;
	const formattedValue = formatValue(name, value);

	console.log(
		`%c${name}%c ${formattedValue} %c${rating}`,
		"font-weight: bold; font-size: 12px;",
		"font-size: 12px;",
		`font-size: 11px; color: ${getRatingColor(rating)};`,
	);
}

/**
 * Update metric in storage and UI
 * @param {Object} metric - Metric object from web-vitals
 */
function updateMetric(metric) {
	const { name, value, rating } = metric;

	metrics[name] = {
		value,
		rating,
		formattedValue: formatValue(name, value),
	};

	logMetric(metric);
	updateOverlay();
}

/**
 * Create and inject the metrics overlay UI
 */
function createOverlay() {
	const overlay = document.createElement("div");
	overlay.id = "web-vitals-overlay";
	overlay.innerHTML = `
    <style>
      #web-vitals-overlay {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 16px;
        border-radius: 8px;
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 12px;
        z-index: 999999;
        min-width: 240px;
        max-width: 280px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s ease;
        pointer-events: auto;
      }

      #web-vitals-overlay.hidden {
        opacity: 0;
        pointer-events: none;
      }

      #web-vitals-overlay .header {
        font-weight: bold;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      #web-vitals-overlay .close-btn {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        line-height: 1;
        opacity: 0.7;
        transition: opacity 0.2s;
      }

      #web-vitals-overlay .close-btn:hover {
        opacity: 1;
      }

      #web-vitals-overlay .metric {
        display: flex;
        justify-content: space-between;
        margin: 8px 0;
        padding: 4px 0;
      }

      #web-vitals-overlay .metric-name {
        font-weight: 600;
        margin-right: 12px;
      }

      #web-vitals-overlay .metric-value {
        font-weight: bold;
      }

      #web-vitals-overlay .metric-loading {
        color: #888;
      }

      #web-vitals-overlay .footer {
        margin-top: 12px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 10px;
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
      }
    </style>

    <div class="header">
      <span>⚡ Web Vitals</span>
      <button class="close-btn" aria-label="Close Web Vitals overlay">✕</button>
    </div>

    <div class="metrics">
      <div class="metric" data-metric="LCP">
        <span class="metric-name">LCP</span>
        <span class="metric-value metric-loading">Loading...</span>
      </div>
      <div class="metric" data-metric="INP">
        <span class="metric-name">INP</span>
        <span class="metric-value metric-loading">Waiting...</span>
      </div>
      <div class="metric" data-metric="CLS">
        <span class="metric-name">CLS</span>
        <span class="metric-value metric-loading">Loading...</span>
      </div>
      <div class="metric" data-metric="FCP">
        <span class="metric-name">FCP</span>
        <span class="metric-value metric-loading">Loading...</span>
      </div>
      <div class="metric" data-metric="TTFB">
        <span class="metric-name">TTFB</span>
        <span class="metric-value metric-loading">Loading...</span>
      </div>
    </div>

    <div class="footer">
      Press Ctrl+Shift+V to toggle
    </div>
  `;

	document.body.appendChild(overlay);

	// Add close button handler
	const closeBtn = overlay.querySelector(".close-btn");
	closeBtn.addEventListener("click", () => {
		overlay.classList.add("hidden");
	});

	return overlay;
}

/**
 * Update overlay with current metric values
 */
function updateOverlay() {
	const overlay = document.getElementById("web-vitals-overlay");
	if (!overlay) return;

	for (const [name, data] of Object.entries(metrics)) {
		if (!data) continue;

		const metricEl = overlay.querySelector(
			`[data-metric="${name}"] .metric-value`,
		);
		if (metricEl) {
			metricEl.textContent = data.formattedValue;
			metricEl.style.color = getRatingColor(data.rating);
			metricEl.classList.remove("metric-loading");
		}
	}
}

/**
 * Toggle overlay visibility
 */
function toggleOverlay() {
	const overlay = document.getElementById("web-vitals-overlay");
	if (overlay) {
		overlay.classList.toggle("hidden");
	}
}

/**
 * Initialize Web Vitals monitoring
 */
function initWebVitals() {
	console.log(
		"%c⚡ Web Vitals Monitoring Enabled",
		"font-weight: bold; font-size: 14px; color: #0cce6b;",
	);
	console.log(
		"%cPress Ctrl+Shift+V to toggle overlay",
		"font-size: 12px; color: #888;",
	);

	// Create overlay
	createOverlay();

	// Track all metrics
	onCLS(updateMetric);
	onINP(updateMetric);
	onLCP(updateMetric);
	onFCP(updateMetric);
	onTTFB(updateMetric);
	// Add keyboard shortcut to toggle overlay
	document.addEventListener("keydown", (e) => {
		if (e.ctrlKey && e.shiftKey && e.key === "V") {
			e.preventDefault();
			toggleOverlay();
		}
	});
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initWebVitals);
} else {
	initWebVitals();
}
