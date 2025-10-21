/**
 * Legacy Concierge Card Components
 * Custom elements for various card types
 */

import { cloneTemplate } from "../../scripts/core/component-loader.js";
import {
  getAttributeOr,
  getBooleanAttribute,
} from "../../scripts/core/helpers.js";

/**
 * Base Card Component
 */
class LCCard extends HTMLElement {
  connectedCallback() {
    const variant = getAttributeOr(this, "variant", "base");
    const templateId = `lc-card-${variant}-template`;

    const template = cloneTemplate(templateId);
    if (!template) {
      console.warn(`Card template not found: ${templateId}`);
      return;
    }

    // Move existing content to slots
    const existingContent = Array.from(this.childNodes);
    this.innerHTML = "";
    this.appendChild(template);

    // Restore existing content
    for (const node of existingContent) {
      this.appendChild(node);
    }

    // Add variant class
    const card = this.querySelector(".card");
    if (card && variant !== "base") {
      card?.classList.add(`card-${variant}`);
    }

    // Handle clickable cards
    if (this.hasAttribute("href")) {
      this.makeClickable();
    }

    // Handle elevation
    const elevation = getAttributeOr(this, "elevation", null);
    if (elevation && card) {
      card?.classList.add(`elevation-${elevation}`);
    }

    // Handle animations
    if (getBooleanAttribute(this, "animated")) {
      this.setupAnimations();
    }
  }

  /**
   * Make the entire card clickable
   */
  makeClickable() {
    const href = this.getAttribute("href");
    const target = getAttributeOr(this, "target", "_self");
    const card = this.querySelector(".card");

    if (!card) return;

    card.style.cursor = "pointer";
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");

    const handleClick = (e) => {
      if (e.target.tagName === "A" || e.target.closest("a")) {
        return; // Don't interfere with nested links
      }

      if (
        e.type === "click" ||
        (e.type === "keydown" && (e.key === "Enter" || e.key === " "))
      ) {
        if (e.type === "keydown") e.preventDefault();
        window.open(href, target);
      }
    };

    card.addEventListener("click", handleClick);
    card.addEventListener("keydown", handleClick);
  }

  /**
   * Setup scroll animations
   */
  setupAnimations() {
    const card = this.querySelector(".card");
    if (!card) return;

    card?.classList.add("fade-in");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target?.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(card);
  }
}

/**
 * Card Grid Component
 */
class LCCardGrid extends HTMLElement {
  connectedCallback() {
    const template = cloneTemplate("lc-card-grid-template");
    if (!template) {
      console.error("Card grid template not found");
      return;
    }

    // Move existing cards to slot
    const cards = Array.from(this.children);
    this.innerHTML = "";
    this.appendChild(template);

    const slot = this.querySelector("slot");
    for (const card of cards) {
      slot.parentNode.insertBefore(card, slot);
    }

    // Apply column settings
    const columns = getAttributeOr(this, "columns", "auto");
    const grid = this.querySelector(".card-grid");

    if (grid) {
      if (columns === "auto") {
        // Default responsive behavior
        grid.style.setProperty("--grid-columns", "auto-fit");
      } else {
        grid.style.setProperty("--grid-columns", `repeat(${columns}, 1fr)`);
      }

      // Gap
      const gap = getAttributeOr(this, "gap", null);
      if (gap) {
        grid.style.setProperty("--grid-gap", gap);
      }
    }
  }
}

/**
 * Bento Grid Component (masonry-style with variable sizes)
 */
class LCBentoGrid extends HTMLElement {
  connectedCallback() {
    const template = cloneTemplate("lc-bento-grid-template");
    if (!template) {
      console.error("Bento grid template not found");
      return;
    }

    // Move existing cards to slot
    const cards = Array.from(this.children);
    this.innerHTML = "";
    this.appendChild(template);

    const slot = this.querySelector("slot");
    for (const card of cards) {
      slot.parentNode.insertBefore(card, slot);
    }

    // Apply custom grid layout
    this.applyBentoLayout();
  }

  /**
   * Apply bento box grid layout with varying card sizes
   */
  applyBentoLayout() {
    const grid = this.querySelector(".bento-grid");
    if (!grid) return;

    const cards = grid.querySelectorAll(".bento-card");

    // Define size patterns (can be customized via attributes)
    const sizePattern = getAttributeOr(this, "pattern", "default");
    const patterns = {
      default: [
        { span: 2, spanRow: 2 }, // Large
        { span: 1, spanRow: 1 }, // Small
        { span: 1, spanRow: 1 }, // Small
        { span: 1, spanRow: 2 }, // Tall
        { span: 2, spanRow: 1 }, // Wide
        { span: 1, spanRow: 1 }, // Small
      ],
      uniform: [
        { span: 1, spanRow: 1 }, // All same size
      ],
    };

    const pattern = patterns[sizePattern] || patterns.default;

    cards.forEach((card, index) => {
      const size = pattern[index % pattern.length];
      card.style.gridColumn = `span ${size.span}`;
      card.style.gridRow = `span ${size.spanRow}`;
    });
  }
}

// Register custom elements
customElements.define("lc-card", LCCard);
customElements.define("lc-card-grid", LCCardGrid);
customElements.define("lc-bento-grid", LCBentoGrid);
