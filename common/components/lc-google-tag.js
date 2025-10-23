/**
 * Google Tag Manager Component for Legacy Concierge
 * Injects the Google Analytics GTM script into the page head.
 * This component is "headless" and does not render any visible output.
 *
 * @example
 * <!-- Basic usage -->
 * <lc-google-tag gtm-id="G-RZZK2MB7DJ"></lc-google-tag>
 *
 * <!-- Disabled for development -->
 * <lc-google-tag gtm-id="G-RZZK2MB7DJ" disabled></lc-google-tag>
 *
 * <!-- With additional configuration for a specific page -->
 * <lc-google-tag
 *   gtm-id="G-RZZK2MB7DJ"
 *   config='{"page_title": "Contact Us", "page_path": "/contact"}'
 * ></lc-google-tag>
 *
 * @attributes
 * - gtm-id: (Required) The Google Tag Manager measurement ID (e.g., "G-XXXXXXXXXX").
 * - disabled: If present, the GTM script will not be injected.
 * - config: A JSON string of additional parameters to pass to the `gtag('config', ...)` call.
 */

class LCGoogleTag extends HTMLElement {
	// Use a static flag to ensure the script is injected only once per page load.
	static isInitialized = false;
	static gtmId = "G-RZZK2MB7DJ";

	connectedCallback() {
		// Do not run if the component is disabled.
		if (this.hasAttribute("disabled")) {
			this.remove();
			return;
		}

		// If the script has already been injected by another instance of this component,
		// do nothing and remove this instance from the DOM.
		if (LCGoogleTag.isInitialized) {
			this.remove();
			return;
		}

		if (!this.getAttribute("gtm-id")) {
			this.gtmId = LCGoogleTag.gtmId;
			console.warn(
				'"gtm-id" value not provided&mdash;using default of: ',
				this.gtmId,
			);
			this.remove();
			return;
		} else {
			this.gtmId = this.getAttribute("gtm-id");
		}

		// Parse additional configuration from the 'config' attribute.
		let configObject = {};
		const configAttr = this.getAttribute("config");
		if (configAttr) {
			try {
				configObject = JSON.parse(configAttr);
			} catch (e) {
				console.error(
					"lc-google-tag: Failed to parse invalid JSON in `config` attribute.",
					e,
				);
			}
		}
		const configString = JSON.stringify(configObject);

		// 1. Add a preconnect link to warm up the connection to Google's servers,
		// which can improve performance.
		const preconnectLink = document.createElement("link");
		preconnectLink.rel = "preconnect";
		preconnectLink.href = "https://www.googletagmanager.com";
		preconnectLink.setAttribute("crossorigin", "");
		document.head.appendChild(preconnectLink);

		// 2. Add the main Google Tag Manager script. The `async` attribute
		// prevents it from blocking page rendering.
		const gtagScript = document.createElement("script");
		gtagScript.async = true;
		gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${gtmId}`;
		document.head.appendChild(gtagScript);

		// 3. Add the inline script to initialize the dataLayer and configure the tag.
		const inlineScript = document.createElement("script");
		inlineScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gtmId}', ${configString});
    `;
		document.head.appendChild(inlineScript);

		// Mark as initialized and remove the custom element from the DOM
		// as it has served its purpose.
		LCGoogleTag.isInitialized = true;
		this.remove();
	}
}

// Define the custom element for use in HTML.
customElements.define("lc-google-tag", LCGoogleTag);

// Export the class for potential use in other modules.
export { LCGoogleTag };
