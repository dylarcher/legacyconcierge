/**
 * Legacy Concierge Footer Component
 * Custom element for consistent footer across all pages
 */

import { cloneTemplate } from "../../scripts/core/component-loader.js";
import { getAttributeOr } from "../../scripts/core/helpers.js";

class LCFooter extends HTMLElement {
  /**
   * Called when element is inserted into DOM
   */
  connectedCallback() {
    this.render();
  }

  /**
   * Render the footer from template
   */
  render() {
    const template = cloneTemplate("lc-footer-template");
    if (!template) {
      console.error("Footer template not found");
      return;
    }

    // Insert template content
    this.appendChild(template);

    // Apply variant if specified
    const variant = getAttributeOr(this, "variant", "default");
    const footer = this.querySelector("footer");

    if (footer && variant !== "default") {
      footer?.classList.add(`footer-${variant}`);
    }

    // Update copyright year dynamically
    this.updateCopyrightYear();
  }

  /**
   * Update copyright year to current year
   */
  updateCopyrightYear() {
    const copyrightElement = this.querySelector(
      '[data-i18n="footer.copyright"]',
    );
    if (copyrightElement) {
      const currentYear = new Date().getFullYear();
      // If translation hasn't loaded yet, set a default
      if (!copyrightElement.textContent) {
        copyrightElement.textContent = `© ${currentYear} Legacy Concierge. All Rights Reserved.`;
      } else {
        // Update year in existing text
        copyrightElement.textContent = copyrightElement.textContent.replace(
          /©\s*\d{4}/,
          `© ${currentYear}`,
        );
      }
    }
  }
}

// Register the custom element
customElements.define("lc-footer", LCFooter);
