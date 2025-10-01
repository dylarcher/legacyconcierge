# Design-to-Dev Handoff Guide

**Version 1.0**

**For Vanilla HTML/CSS/JavaScript Implementation**

**Adobe Creative Suite Workflow**

---

## Table of Contents

1. [Introduction &amp; Purpose](#introduction--purpose)
2. [Design Tokens](#design-tokens)
3. [Foundation Systems](#foundation-systems)
4. [Component Specification Template](#component-specification-template)
5. [Naming Conventions](#naming-conventions)
6. [Asset Export Guidelines](#asset-export-guidelines)
7. [Accessibility Requirements](#accessibility-requirements)
8. [Animation &amp; Interaction Specifications](#animation--interaction-specifications)
9. [Responsive Design Documentation](#responsive-design-documentation)
10. [Handoff Checklist](#handoff-checklist)
11. [Example Component Documentation](#example-component-documentation)
12. [Common Pitfalls &amp; Solutions](#common-pitfalls--solutions)

---

## Introduction & Purpose

### What This Guide Provides

This document serves as the bridge between design and development teams, ensuring that every design decision is accurately translated into production-ready code. Since we're working with vanilla HTML, CSS, and JavaScript (no frameworks) and Adobe Creative Suite (not Figma/Sketch), this guide addresses the unique challenges of this workflow.

### Why Design-to-Dev Handoff Matters

Without proper handoff documentation:

* Developers make assumptions that don't match design intent
* Accessibility requirements get missed
* Inconsistencies emerge across components
* Implementation takes longer due to back-and-forth questions
* The final product doesn't match the design vision

### Who Should Use This Guide

* **Designers** : Use this as a checklist for what information developers need
* **Developers** : Reference this to understand design specifications
* **Product Managers** : Understand what constitutes a complete design deliverable
* **QA Teams** : Verify implementations match design specifications

---

## Design Tokens

Design tokens are the atomic values of your design system—the smallest design decisions that build everything else. They must be documented precisely for implementation as CSS custom properties.

### Color Tokens

#### Structure

```
Category → Purpose → Variant → State
```

#### Documentation Template

**Token Name** : `--color-[category]-[purpose]-[variant]-[state]`

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Token Name</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Hex Value</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">RGB</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Usage</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Accessibility Notes</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--color-primary-brand-default</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem] inline-flex items-center h-5"><span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#0066CC</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">rgb(0, 102, 204)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Primary brand actions, links</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">4.5:1 contrast on white</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--color-primary-brand-hover</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem] inline-flex items-center h-5"><span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#0052A3</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">rgb(0, 82, 163)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Hover state for primary</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">5.8:1 contrast on white</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--color-primary-brand-active</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem] inline-flex items-center h-5"><span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#003D7A</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">rgb(0, 61, 122)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Active/pressed state</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">7.2:1 contrast on white</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--color-primary-brand-disabled</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem] inline-flex items-center h-5"><span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#CCE0F5</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">rgb(204, 224, 245)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Disabled primary actions</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Must combine with opacity</td></tr></tbody></table></pre>

#### Required Color Documentation

For each color token, provide:

1. **Hex and RGB values** (for CSS implementation)
2. **Color name** (human-readable, e.g., "Ocean Blue")
3. **Purpose** (where and why it's used)
4. **Contrast ratios** (against backgrounds it will be used on)
5. **State variations** (default, hover, active, focus, disabled)
6. **Dark mode equivalent** (if applicable)

#### Color Categories to Define

```
Primary Colors
├── Brand colors (primary, secondary, tertiary)
├── Action colors (success, warning, error, info)
└── State colors (hover, active, focus, disabled)

Neutral Colors
├── Background colors (levels 1-5)
├── Surface colors (elevated, recessed)
├── Border colors (subtle, default, strong)
└── Text colors (primary, secondary, tertiary, disabled)

Semantic Colors
├── Success (default, light, dark)
├── Warning (default, light, dark)
├── Error (default, light, dark)
└── Info (default, light, dark)
```

### Typography Tokens

#### Font Family Tokens

css

```css
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-secondary: 'Georgia', 'Times New Roman', serif;
--font-family-mono: 'Fira Code', 'Courier New', monospace;
```

#### Font Size Scale

Document your type scale with precise pixel values and rem equivalents:

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Token Name</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Pixel Size</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">REM Value</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Line Height</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Letter Spacing</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Usage</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--font-size-xs</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">12px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">0.75rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px (1.33)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">0.02em</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Small labels, captions</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--font-size-sm</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">14px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">0.875rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">20px (1.43)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">0.01em</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Body small, secondary text</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--font-size-base</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">24px (1.5)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">0</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Body text, default</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--font-size-lg</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">18px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1.125rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">28px (1.56)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">-0.01em</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Large body, subheadings</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--font-size-xl</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">20px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1.25rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">28px (1.4)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">-0.01em</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">H4, card titles</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--font-size-2xl</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">24px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1.5rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">32px (1.33)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">-0.02em</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">H3</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--font-size-3xl</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">30px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1.875rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">36px (1.2)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">-0.02em</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">H2</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--font-size-4xl</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">36px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">2.25rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">40px (1.11)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">-0.02em</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">H1</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--font-size-5xl</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">48px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">3rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">48px (1)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">-0.03em</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Display large</td></tr></tbody></table></pre>

#### Font Weight Tokens

css

```css
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

#### Line Height Tokens

css

```css
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
--line-height-loose: 2;
```

### Spacing Tokens

Use a consistent spacing scale based on multiples of a base unit (typically 4px or 8px).

#### Base-8 Spacing Scale

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Token Name</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Pixel Value</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">REM Value</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Usage Example</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-0</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">0px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">0</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Reset/none</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-1</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">4px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">0.25rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Micro spacing, icon gaps</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-2</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">8px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">0.5rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Compact spacing</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-3</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">12px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">0.75rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Input padding</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-4</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Default component spacing</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-5</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">20px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1.25rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Comfortable spacing</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-6</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">24px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1.5rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Section gaps</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-8</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">32px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">2rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Large component spacing</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-10</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">40px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">2.5rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Section padding</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-12</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">48px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">3rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Container padding</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-16</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">64px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">4rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Layout sections</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-20</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">80px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">5rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Major sections</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--space-24</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">96px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">6rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Page sections</td></tr></tbody></table></pre>

### Border & Radius Tokens

#### Border Width

css

```css
--border-width-thin: 1px;
--border-width-default: 2px;
--border-width-thick: 4px;
```

#### Border Radius

css

```css
--radius-none: 0;
--radius-sm: 2px;
--radius-default: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-2xl: 16px;
--radius-full: 9999px; /* For circular elements */
```

### Shadow Tokens

Document elevation system with precise shadow specifications:

css

```css
/* Elevation Level 1 - Subtle */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Elevation Level 2 - Default */
--shadow-default: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
                  0 1px 2px 0 rgba(0, 0, 0, 0.06);

/* Elevation Level 3 - Raised */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Elevation Level 4 - Floating */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Elevation Level 5 - Modal */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Elevation Level 6 - Maximum */
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

For each shadow, document:

* **When to use** : Specific components or contexts
* **Visual example** : Screenshot or mockup showing the shadow
* **Accessibility note** : Shadows must not be the only indicator of state

### Animation & Timing Tokens

css

```css
/* Duration */
--duration-instant: 0ms;
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--duration-slower: 500ms;

/* Easing Functions */
--ease-linear: cubic-bezier(0, 0, 1, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Z-Index Scale

Document your stacking context hierarchy:

css

```css
--z-index-base: 0;
--z-index-dropdown: 1000;
--z-index-sticky: 1100;
--z-index-fixed: 1200;
--z-index-modal-backdrop: 1300;
--z-index-modal: 1400;
--z-index-popover: 1500;
--z-index-tooltip: 1600;
--z-index-notification: 1700;
```

---

## Foundation Systems

### Grid System

#### Layout Grid Specifications

**Desktop Grid (1440px viewport)**

* Columns: 12
* Gutter width: 24px
* Margin: 80px (left and right)
* Column width: Fluid
* Max container width: 1280px

**Tablet Grid (768px viewport)**

* Columns: 8
* Gutter width: 16px
* Margin: 40px
* Column width: Fluid

**Mobile Grid (375px viewport)**

* Columns: 4
* Gutter width: 16px
* Margin: 16px
* Column width: Fluid

#### CSS Implementation Template

css

```css
.container {
  width: 100%;
  max-width: var(--container-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
}

:root {
  --container-max-width: 1280px;
  --container-padding: 16px;
  --grid-columns: 4;
  --grid-gutter: 16px;
}

@media (min-width: 768px) {
  :root {
    --container-padding: 40px;
    --grid-columns: 8;
    --grid-gutter: 16px;
  }
}

@media (min-width: 1024px) {
  :root {
    --container-padding: 80px;
    --grid-columns: 12;
    --grid-gutter: 24px;
  }
}
```

### Breakpoint System

Define precise breakpoint values and naming:

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Breakpoint Name</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Min Width</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Max Width</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Target Devices</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Usage</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">mobile-sm</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">320px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">374px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Small phones</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Edge case handling</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">mobile</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">375px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">767px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Phones</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Mobile-first base styles</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">tablet</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">768px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1023px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Tablets, small laptops</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Tablet layout adjustments</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">desktop</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1024px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1439px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Laptops, desktops</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Desktop default</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">desktop-lg</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1440px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1919px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Large desktops</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Enhanced layouts</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">desktop-xl</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1920px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">∞</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Extra large screens</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Maximum layout</td></tr></tbody></table></pre>

#### Media Query Convention

css

```css
/* Mobile-first approach (preferred) */
.component {
  /* Mobile styles (320px+) */
}

@media (min-width: 768px) {
  .component {
    /* Tablet styles */
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop styles */
  }
}

/* Desktop-first (when needed) */
@media (max-width: 1023px) {
  .component {
    /* Below desktop */
  }
}
```

### Iconography System

#### Icon Specifications

**Standard Icon Sizes**

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Size Name</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Dimensions</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Usage</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Token Name</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Extra Small</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">12×12px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Inline text icons</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--icon-size-xs</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Small</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16×16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Navigation, small buttons</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--icon-size-sm</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Medium</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">24×24px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Default, most UI elements</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--icon-size-md</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Large</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">32×32px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Feature cards, large buttons</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--icon-size-lg</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Extra Large</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">48×48px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Hero sections, empty states</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">--icon-size-xl</code></td></tr></tbody></table></pre>

#### Icon Export Requirements (Adobe Illustrator/Photoshop)

**File Format** : SVG (required), PNG backup (optional)

**Artboard Setup** :

* Size: 24×24px (for medium icons)
* Viewbox:`viewBox="0 0 24 24"`
* Padding: 2px internal padding from artboard edge
* Stroke width: 2px (for outline icons)
* Fill: Black (`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#000000`) for single-color icons

**Export Settings** :

```
Format: SVG
Styling: Inline Style
Font: Convert to Outlines
Images: Embed
Object IDs: Layer Names
Decimal: 2
Minify: Yes
Responsive: Yes
```

**Naming Convention** :

```
icon-[name]-[variant]-[size].svg

Examples:
icon-search-outline-24.svg
icon-user-filled-24.svg
icon-chevron-right-outline-16.svg
```

#### SVG Code Requirements

**Required SVG attributes** :

svg

```svg
<svg 
  width="24" 
  height="24" 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  focusable="false"
>
  <!-- Icon paths here -->
</svg>
```

**Color Implementation** :

* Use`currentColor` for stroke/fill to inherit text color
* Document when icons need specific colors

---

## Component Specification Template

For every component in the design system, designers must provide the following information. Use this template as a checklist.

### Component Overview

**Component Name** : [Exact name, e.g., "Primary Button"]

**Component Type** : [Atom/Molecule/Organism]

**Version** : [1.0]

**Designer** : [Name]

**Date** : [YYYY-MM-DD]

**Status** : [Draft/Review/Approved/Deprecated]

**Purpose** : [1-2 sentence description of what this component does and when to use it]

**When to Use** :

* [Specific use case 1]
* [Specific use case 2]
* [Specific use case 3]

**When NOT to Use** :

* [Specific anti-pattern 1]
* [Specific anti-pattern 2]

### Anatomy

Provide a labeled diagram showing every element of the component.

**Required Labels** :

1. Container/wrapper
2. Every visible element (text, icons, borders, backgrounds)
3. Padding/margin measurements
4. Element positioning relationships

**Example Anatomy Documentation** :

```
Primary Button Anatomy:
┌─────────────────────────────────────┐
│  [Icon] Button Label                │  ← Container: height 44px
│  ↑     ↑                             │
│  16px  Text (--font-size-base)      │
│  icon                                │
└─────────────────────────────────────┘
 ↑                                   ↑
 Padding left: 20px                  Padding right: 20px

Components:
1. Container (.button-primary)
2. Icon (optional, .button__icon)
3. Label text (.button__label)
4. Border (2px, --color-primary-brand-default)
5. Background (--color-primary-brand-default)
```

### Visual Specifications

#### Default State Specifications

Provide exact measurements for:

**Dimensions** :

* Width: [e.g., "min-width: 120px, max-width: 100% of container, auto-size to content"]
* Height: [exact pixel value, e.g., "44px"]
* Padding: [top, right, bottom, left in pixels]
* Margin: [if default margins exist]

**Typography** :

* Font family: [token name]
* Font size: [token name + pixel/rem value]
* Font weight: [token name + numeric value]
* Line height: [token name + value]
* Letter spacing: [value]
* Text color: [token name + hex]
* Text alignment: [left/center/right]
* Text transform: [none/uppercase/lowercase/capitalize]

**Colors** :

* Background color: [token name + hex + RGB]
* Text color: [token name + hex + RGB]
* Border color: [token name + hex + RGB]
* Icon color: [token name + hex + RGB]

**Border** :

* Border width: [token name + pixel value]
* Border style: [solid/dashed/dotted/none]
* Border color: [token name + hex]
* Border radius: [token name + pixel value]

**Effects** :

* Box shadow: [token name + full CSS value]
* Opacity: [value, if applicable]
* Transform: [if applicable]

### States & Variations

Document EVERY possible state with specifications. Missing states cause implementation delays.

#### Interactive States

**Required States for Interactive Components** :

1. **Default/Rest** : Initial appearance
2. **Hover** : Mouse cursor over component
3. **Active/Pressed** : Mouse button down
4. **Focus** : Keyboard focus (CRITICAL for accessibility)
5. **Disabled** : Cannot be interacted with
6. **Loading** : During asynchronous operations (if applicable)
7. **Error** : Invalid or error state (if applicable)
8. **Success** : Successful completion (if applicable)

#### State Documentation Template

For EACH state, provide:

**State Name** : [e.g., "Hover"]

**Trigger** : [What causes this state? e.g., "Mouse cursor enters button bounds"]

**Visual Changes** :

* Background color: [token + value]
* Text color: [token + value]
* Border color: [token + value]
* Shadow: [token + value]
* Transform: [e.g., "scale(1.02)"]
* Cursor: [e.g., "pointer"]
* Any other visual change

**Animation** :

* Duration: [token name + milliseconds]
* Timing function: [token name + easing]
* Properties animated: [list all, e.g., "background-color, box-shadow"]

**Example State Specification** :

```
STATE: Hover
Trigger: Mouse enters button bounds
Background: --color-primary-brand-hover (#0052A3)
Border: --color-primary-brand-hover (#0052A3)
Shadow: --shadow-md
Transform: translateY(-1px)
Cursor: pointer
Transition: all 150ms ease-out
```

#### Size Variants

If component comes in multiple sizes, document each:

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Size</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Height</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Padding (H/V)</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Font Size</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Icon Size</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Use Case</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Small</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">32px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">12px / 8px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">--font-size-sm</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Compact UIs, tables</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Medium</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">44px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">20px / 12px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">--font-size-base</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">20px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Default, most uses</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Large</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">56px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">28px / 16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">--font-size-lg</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">24px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Hero sections, emphasis</td></tr></tbody></table></pre>

#### Style Variants

Document each visual variant:

**Primary Button** :

* Background: Filled with primary color
* Use: Main call-to-action

**Secondary Button** :

* Background: Transparent
* Border: Primary color border
* Use: Secondary actions

**Tertiary Button** :

* Background: Transparent
* Border: None
* Use: Low-emphasis actions

#### Content Variants

Document how component handles different content scenarios:

**With Icon** :

* Icon position: Left of text, 8px gap
* Icon size: Matches size variant

**Icon Only** :

* Width equals height (square)
* Aria-label required

**Long Text** :

* Max width: [value or "none"]
* Text overflow: [truncate/wrap/ellipsis]
* Number of lines: [value]

**Multiple Lines** :

* Height: [auto/specific value]
* Alignment: [specify vertical alignment]

### Behavior Specifications

#### Interaction Behaviors

Document precisely what happens on interaction:

**On Click/Tap** :

* Action: [Navigate to URL / Submit form / Toggle state / etc.]
* Loading state: [Show spinner / Disable button / etc.]
* Success feedback: [Show checkmark / Change text / etc.]
* Error handling: [Show error message / Reset state / etc.]

**On Focus** (keyboard navigation):

* Focus indicator: [Outline style and color]
* Focus order: [Tab sequence position]
* Keyboard shortcuts: [If applicable, e.g., "Enter/Space to activate"]

**On Long Press** (mobile):

* Behavior: [If applicable]
* Duration threshold: [milliseconds]

#### Validation & Error States

**Validation Rules** :

* [Rule 1, e.g., "Required field"]
* [Rule 2, e.g., "Minimum 8 characters"]
* [Rule 3, e.g., "Must contain @"]

**Error Display** :

* Error message position: [Below field / Above field / Inline]
* Error message styling: [Color, icon, font size]
* Field styling on error: [Border color, background, etc.]
* When to show error: [On blur / On submit / Real-time]

**Example Error Specification** :

```
On validation failure:
- Border color changes to --color-error-default
- Border width increases to 2px
- Error icon (16px) appears at right edge of input
- Error message appears below field in --color-error-default
- Error message font size: --font-size-sm
- Field gets aria-invalid="true" attribute
- Error message gets id linked via aria-describedby
```

### Responsive Behavior

Document how component adapts across breakpoints:

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Breakpoint</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Width</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Height</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Padding</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Font Size</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Layout Changes</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Mobile (375px)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">100%</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">44px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px H</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Full width, stacked</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Tablet (768px)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Auto</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">44px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">20px H</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Inline, maintains spacing</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Desktop (1024px+)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Auto</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">48px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">24px H</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Inline, increased padding</td></tr></tbody></table></pre>

**Layout Changes** :

* Mobile: [Describe mobile-specific layout]
* Tablet: [Describe tablet-specific layout]
* Desktop: [Describe desktop-specific layout]

**Touch Targets** :

* Minimum touch target size: 44×44px on mobile (WCAG requirement)
* Spacing between interactive elements: Minimum 8px

### Content Guidelines

#### Character Limits

Specify content constraints:

* **Minimum characters** : [number]
* **Maximum characters** : [number or "unlimited"]
* **Recommended length** : [range]
* **Truncation point** : [number of characters before ellipsis]

#### Microcopy Examples

Provide actual text examples:

**Do** :

* ✓ "Save changes"
* ✓ "Create account"
* ✓ "Learn more"

**Don't** :

* ✗ "OK"
* ✗ "Click here"
* ✗ "Submit"

**Tone** : [Describe tone: friendly, professional, urgent, etc.]

### Accessibility Requirements

#### WCAG Compliance Level

**Target Level** : [A / AA / AAA]

#### Required Attributes

**Semantic HTML** :

html

```html
<!-- Specify the correct HTML element -->
<button type="button" class="button-primary">
  <!-- Not <div> or <a> unless appropriate -->
</button>
```

**ARIA Attributes** :

* `role`: [if needed, specify which]
* `aria-label`: [when visible text insufficient]
* `aria-labelledby`: [if labeled by another element]
* `aria-describedby`: [for additional descriptions]
* `aria-expanded`: [for expandable components]
* `aria-controls`: [what this controls]
* `aria-pressed`: [for toggle buttons]
* `aria-disabled`: [for disabled state]
* `aria-invalid`: [for error states]
* `aria-live`: [for dynamic content]
* `aria-atomic`: [for live regions]

#### Keyboard Navigation

**Keyboard Support** :

* `Tab`: [Expected behavior]
* `Shift + Tab`: [Expected behavior]
* `Enter`: [Expected behavior]
* `Space`: [Expected behavior]
* `Escape`: [Expected behavior, if applicable]
* `Arrow keys`: [Expected behavior, if applicable]

**Focus Management** :

* Focus indicator must be visible (min 2px outline)
* Focus must not be trapped
* Focus order must be logical

#### Screen Reader Experience

**Screen Reader Announcements** :

* Initial state: "[How component is announced]"
* On interaction: "[What's announced on click/activate]"
* On state change: "[What's announced when state changes]"

**Example Screen Reader Spec** :

```
Button announces as: "Save changes, button"
On click: "Saving" (aria-live region update)
On success: "Changes saved successfully" (aria-live region update)
On error: "Error saving changes. [Error message]" (aria-live region update)
```

#### Color & Contrast

**Contrast Ratios** (measured against background):

* Normal text: Minimum 4.5:1
* Large text (18pt+): Minimum 3:1
* UI components: Minimum 3:1
* Focus indicators: Minimum 3:1

**Non-Color Indicators** :

* States must not rely solely on color
* Include icons, patterns, or text for status
* Example: Error state = red border + error icon + error message

#### Motion & Animation

**Reduced Motion** :

css

```css
@media (prefers-reduced-motion: reduce) {
  .component {
    animation: none;
    transition: none;
  }
}
```

Specify which animations should be removed for users who prefer reduced motion.

### Code Implementation Notes

#### Semantic HTML Structure

Provide the expected HTML structure:

html

```html
<button 
  type="button" 
  class="button button--primary button--medium"
  aria-label="[if needed]"
>
  <span class="button__icon" aria-hidden="true">
    <!-- Icon SVG -->
  </span>
  <span class="button__label">
    Button Text
  </span>
</button>
```

#### CSS Class Naming

Specify exact class names using BEM or your chosen methodology:

**Base class** : `.button`

**Modifier classes** : `.button--primary`, `.button--secondary`, `.button--large`

**Element classes** : `.button__icon`, `.button__label`

**State classes** : `.button--disabled`, `.button--loading`

#### JavaScript Behavior

Document any JavaScript requirements:

**Required Behaviors** :

1. [Behavior 1, e.g., "Prevent double-submission"]
2. [Behavior 2, e.g., "Show loading spinner on click"]
3. [Behavior 3, e.g., "Track analytics event"]

**Event Handlers** :

* `click`: [What should happen]
* `keydown`: [What should happen]
* `focus`: [What should happen]
* `blur`: [What should happen]

### Dependencies

**Required Components/Modules** :

* [e.g., "Icon component"]
* [e.g., "Spinner component for loading state"]
* [e.g., "Tooltip component for help text"]

**Optional Enhancements** :

* [e.g., "Analytics tracking module"]
* [e.g., "Form validation module"]

### Design Files & Assets

**Adobe File Locations** :

* Source file: [Path/to/component-name.ai or .psd]
* Asset exports: [Path/to/exports/]
* Specifications: [Path/to/specs/]

**Asset Export List** :

* [ ] Component in all states (PNG @ 2x for documentation)
* [ ] Icons (SVG)
* [ ] Background images (if any)
* [ ] Texture/pattern files (if any)

---

## Naming Conventions

Consistent naming across design and development is critical. Here are the standards:

### File Naming

#### Design Files (Adobe Illustrator/Photoshop)

**Format** : `[category]-[component-name]-[version].ai`

**Examples** :

* `button-primary-v1.ai`
* `form-input-text-v2.psd`
* `card-product-v1.ai`
* `navigation-header-v3.ai`

**Rules** :

* All lowercase
* Hyphen-separated (kebab-case)
* Include version number
* No spaces or special characters
* Be descriptive but concise

#### Asset Export Naming

**Format** : `[component]-[variant]-[state]-[size]@[scale].[extension]`

**Examples** :

* `button-primary-default-medium@2x.png`
* `icon-search-outline-24.svg`
* `avatar-user-default-large@2x.png`
* `logo-brand-full-color.svg`

### Component Naming

Use consistent names across design, code, and documentation:

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Design Name</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">HTML Class</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">JavaScript</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Avoid</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Primary Button</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.button-primary</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">PrimaryButton</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.btn</code>, <code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.btnPrimary</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Text Input</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.input-text</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">TextInput</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.textbox</code>, <code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.field</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Modal Dialog</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.modal</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">Modal</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.popup</code>, <code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.dialog</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Navigation Bar</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.navbar</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">NavigationBar</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.nav</code>, <code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">.menu</code></td></tr></tbody></table></pre>

### Token Naming Convention

**Structure** : `--[category]-[property]-[variant]-[state]`

**Examples** :

* `--color-primary-background-default`
* `--color-primary-background-hover`
* `--space-component-padding-horizontal`
* `--font-size-heading-large`
* `--border-radius-card-default`

**Rules** :

* Start with double hyphen (CSS custom property)
* Hyphen-separated segments
* Go from general to specific
* Be consistent and predictable

### State Naming

Use standard state names across all components:

**Standard States** :

* `default` - Initial/rest state
* `hover` - Mouse over
* `active` - Pressed/activated
* `focus` - Keyboard focus
* `disabled` - Cannot interact
* `loading` - Processing
* `error` - Error/invalid
* `success` - Success/valid
* `warning` - Warning
* `selected` - Currently selected
* `expanded` - Expanded state
* `collapsed` - Collapsed state

### Variant Naming

**Size Variants** :

* `xs` - Extra small
* `sm` - Small
* `md` - Medium (default)
* `lg` - Large
* `xl` - Extra large

**Style Variants** :

* `primary` - Main/emphasized
* `secondary` - Less emphasis
* `tertiary` - Least emphasis
* `ghost` - Transparent/minimal
* `outline` - Bordered only

**Semantic Variants** :

* `success` - Positive action
* `warning` - Caution
* `error` - Negative/destructive
* `info` - Informational
* `neutral` - Neutral action

---

## Asset Export Guidelines

Working with Adobe Creative Suite requires careful export processes to ensure assets are production-ready.

### Export Settings by File Type

#### SVG Export (Illustrator)

**Primary Use** : Icons, logos, illustrations

**Export Settings** :

1. File > Export > Export As...
2. Format: SVG
3. Styling: Presentation Attributes (not Internal CSS)
4. Font: Convert to Outlines
5. Images: Embed
6. Object IDs: Layer Names
7. Decimal Places: 2
8. Minify: Checked
9. Responsive: Checked

**File Optimization** :
After export, run through SVGO or similar optimizer to:

* Remove unnecessary metadata
* Optimize path data
* Remove empty groups
* Clean up IDs

**Hand-off Checklist** :

* [ ] Artboard matches export size exactly
* [ ] No stray points or hidden elements
* [ ] Compound paths properly merged
* [ ] Colors use hex values (not RGB)
* [ ] Strokes converted to fills (if solid shapes)
* [ ] File size < 10KB (for icons)

#### PNG Export (Photoshop/Illustrator)

**Primary Use** : Raster images, mockups, documentation screenshots

**Export Settings for UI Assets** :

1. File > Export > Export As...
2. Format: PNG-24
3. Transparency: Checked (if needed)
4. Interlaced: Unchecked
5. Convert to sRGB: Checked
6. Metadata: None

**Resolution Requirements** :

* **Standard** : 1x (72 DPI)
* **Retina** : 2x (144 DPI equivalent)
* **High DPI** : 3x (for certain contexts)

**File Naming** :

```
asset-name@1x.png
asset-name@2x.png
asset-name@3x.png
```

**Optimization** :

* Use ImageOptim, TinyPNG, or similar
* Target: < 100KB for most UI assets
* Balance quality vs. file size

#### JPEG Export (Photoshop)

**Primary Use** : Photographs, hero images, backgrounds

**Export Settings** :

1. File > Export > Export As...
2. Format: JPEG
3. Quality: 80-90% (balance quality/size)
4. Format Options: Progressive
5. Convert to sRGB: Checked
6. Metadata: Copyright only (remove EXIF)

**Size Guidelines** :

* Hero images: 1920×1080px @ 2x
* Card images: 600×400px @ 2x
* Thumbnails: 300×200px @ 2x
* Maximum file size: 200KB (compressed)

### Color Profile Management

**Design Phase** (Adobe Creative Suite):

* Working Space: sRGB IEC61966-2.1
* Color Settings: North America Web/Internet

**Export Phase** :

* Always convert to sRGB
* Embed color profile: No (smaller files)
* Consistent across all exports

**Why sRGB?** :

* Standard for web browsers
* Consistent cross-device rendering
* Expected color space for CSS hex values

### Exporting Components in Multiple States

#### Batch Export Process

For components with multiple states (hover, focus, disabled, etc.):

**Illustrator Artboard Method** :

1. Create separate artboard for each state
2. Name artboards clearly:`button-primary-default`,`button-primary-hover`
3. Use File > Export > Export for Screens
4. Select all artboards
5. Export to same folder with consistent naming

**Photoshop Layer Comp Method** :

1. Create layer comp for each state
2. Name comps clearly
3. File > Scripts > Export Layer Comps to Files
4. Choose format and settings
5. Export all comps

#### States to Export

For documentation and development reference, export:

* [ ] Default/rest state
* [ ] Hover state
* [ ] Active/pressed state
* [ ] Focus state (with visible focus ring)
* [ ] Disabled state
* [ ] Loading state (if applicable)
* [ ] Error state (if applicable)
* [ ] Success state (if applicable)

### Icon Export Specifications

#### Preparation Checklist

Before exporting icons:

**Illustrator** :

* [ ] Icon centered in artboard with 2px padding
* [ ] Artboard size matches icon size (16×16, 24×24, etc.)
* [ ] Strokes expanded to fills (Object > Expand)
* [ ] Compound paths created (Pathfinder > Unite)
* [ ] No stray points or anchors
* [ ] Paths simplified (Object > Path > Simplify)
* [ ] Colors: Black (`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#000000`) or white (`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#FFFFFF`)

**Export Process** :

1. Select artboard
2. File > Export > Export As
3. Use settings specified in SVG section above
4. Export each icon size separately

#### Icon Sizing Matrix

Export icons in all required sizes:

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Size</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Use Case</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Artboard</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">File Name</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">12px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Inline with small text</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">12×12px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">icon-name-12.svg</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">UI navigation, small buttons</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16×16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">icon-name-16.svg</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">20px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Medium buttons, labels</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">20×20px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">icon-name-20.svg</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">24px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Default size, most UI</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">24×24px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">icon-name-24.svg</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">32px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Large buttons, features</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">32×32px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">icon-name-32.svg</code></td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">48px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Hero, empty states</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">48×48px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem]">icon-name-48.svg</code></td></tr></tbody></table></pre>

### Asset Delivery Package

When delivering assets to developers, provide:

#### Folder Structure

```
component-library-assets/
├── icons/
│   ├── svg/
│   │   ├── icon-search-16.svg
│   │   ├── icon-search-24.svg
│   │   └── icon-search-32.svg
│   └── png/
│       ├── icon-search-24@2x.png
│       └── icon-search-32@2x.png
├── images/
│   ├── hero-homepage@2x.jpg
│   └── pattern-background.png
├── logos/
│   ├── logo-full-color.svg
│   ├── logo-white.svg
│   └── logo-black.svg
├── components/
│   ├── button-primary-states@2x.png
│   └── input-text-states@2x.png
└── documentation/
    ├── component-specs@2x.png
    └── color-palette.png
```

#### Delivery Checklist

* [ ] All assets in correct folders
* [ ] Consistent naming convention followed
* [ ] All required sizes/resolutions included
* [ ] Files optimized for web
* [ ] README.txt with file structure explanation
* [ ] Version number in folder name
* [ ] Compressed as .zip for delivery

#### README.txt Template

```
Component Library Assets v1.0
Date: 2024-XX-XX
Designer: [Name]

CONTENTS:
- /icons: UI icons in SVG and PNG formats
- /images: Raster images (JPG/PNG)
- /logos: Brand logos in multiple formats
- /components: Component state mockups
- /documentation: Design specs and guides

SPECIFICATIONS:
- Resolution: 2x for retina displays (where applicable)
- Color Space: sRGB
- Icon Format: SVG (primary), PNG (backup)
- Image Format: JPG (photos), PNG (UI elements)

NOTES:
- SVG icons use currentColor for easy color customization
- PNG assets are @2x resolution
- All assets optimized for web delivery
- See design-system-handoff-guide.md for implementation details

QUESTIONS:
Contact [designer-email] for clarification or additional assets.
```

---

## Accessibility Requirements

Accessibility is not optional. Every component must meet WCAG 2.1 Level AA standards minimum.

### Accessibility Checklist for Every Component

Use this checklist when specifying any component:

#### Semantic HTML

* [ ] Uses appropriate HTML element (button, input, nav, etc.)
* [ ] Not using`<div>` or`<span>` for interactive elements
* [ ] Heading hierarchy is logical (h1 → h2 → h3)
* [ ] Lists use`<ul>`,`<ol>`, or`<dl>` appropriately
* [ ] Forms use`<form>`,`<label>`,`<fieldset>`,`<legend>`

#### Keyboard Navigation

* [ ] All interactive elements are keyboard accessible
* [ ] Tab order is logical and follows visual order
* [ ] Focus indicator is clearly visible (min 2px, 3:1 contrast)
* [ ] No keyboard traps
* [ ] Shortcut keys documented (if any)
* [ ] Enter/Space activate interactive elements

#### Screen Readers

* [ ] All images have alt text (or alt="" if decorative)
* [ ] Icon-only buttons have aria-label
* [ ] Dynamic content changes announced (aria-live)
* [ ] Form fields have associated labels
* [ ] Error messages are announced
* [ ] Loading states are announced

#### Color & Contrast

* [ ] Text contrast: 4.5:1 minimum (normal text)
* [ ] Text contrast: 3:1 minimum (large text 18pt+)
* [ ] UI component contrast: 3:1 minimum
* [ ] Focus indicator contrast: 3:1 minimum
* [ ] Information not conveyed by color alone
* [ ] Link text distinguishable from non-link text

#### Touch Targets

* [ ] Minimum size: 44×44px on mobile
* [ ] Adequate spacing between targets (min 8px)
* [ ] Larger targets for primary actions

#### Content

* [ ] Link text is descriptive (not "click here")
* [ ] Headings describe content sections
* [ ] Instructions don't rely on sensory characteristics
* [ ] Error messages are clear and helpful
* [ ] Form labels are visible and descriptive

#### Motion & Animation

* [ ] Respects prefers-reduced-motion
* [ ] No flashing content (seizure risk)
* [ ] Animations can be paused
* [ ] Autoplay can be stopped

### ARIA Attributes Reference

Use ARIA to enhance semantics when HTML is insufficient:

#### Landmark Roles

html

```html
<header role="banner">
<nav role="navigation" aria-label="Main">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">
<form role="search">
```

#### Common Widget Roles

html

```html
<div role="button" tabindex="0">
<div role="checkbox" aria-checked="false">
<div role="tab" aria-selected="true">
<div role="dialog" aria-modal="true">
<div role="alert">
<div role="status">
```

#### States & Properties

**Expanded/Collapsed** :

html

```html
<button aria-expanded="false" aria-controls="menu-id">
  Menu
</button>
```

**Selected** :

html

```html
<div role="tab" aria-selected="true">
  Tab 1
</div>
```

**Disabled** :

html

```html
<button disabled aria-disabled="true">
  Submit
</button>
```

**Invalid/Error** :

html

```html
<input 
  type="email" 
  aria-invalid="true" 
  aria-describedby="email-error"
>
<span id="email-error">Invalid email format</span>
```

**Loading** :

html

```html
<button aria-busy="true">
  <span aria-live="polite">Loading...</span>
</button>
```

**Hidden** :

html

```html
<!-- Visually and from screen readers -->
<div hidden>

<!-- Only from screen readers -->
<div aria-hidden="true">

<!-- Only visually (still available to screen readers) -->
<div class="sr-only">
```

### Focus Management

#### Visible Focus Indicators

**Minimum Requirements** :

* Thickness: 2px minimum
* Contrast: 3:1 against background
* Fully surrounds focusable element
* Clearly distinguishable from non-focused state

**CSS Implementation** :

css

```css
.button:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* Remove default outline */
.button:focus {
  outline: none;
}

/* Only show custom focus for keyboard navigation */
.button:focus-visible {
  /* Custom focus styles */
}
```

**Design Specification** :
When documenting components, show focus state with:

* Focus ring color: [token name + hex]
* Focus ring width: [pixel value]
* Focus ring offset: [pixel value]
* Focus ring style: [solid/dashed]

#### Focus Order

Specify expected tab order:

```
1. Logo (if interactive)
2. Main navigation links
3. Search button
4. Content links
5. Form fields (in visual order)
6. Footer links
```

### Screen Reader Testing Checklist

Test components with screen readers during design validation:

**Testing Tools** :

* NVDA (Windows, free)
* JAWS (Windows, paid)
* VoiceOver (macOS/iOS, built-in)
* TalkBack (Android, built-in)

**What to Test** :

* [ ] Component purpose is clear from announcement
* [ ] All interactive elements are announced
* [ ] Current state is announced (expanded, selected, etc.)
* [ ] State changes are announced
* [ ] Error messages are associated with fields
* [ ] Loading states are announced
* [ ] Instructions are available before form fields

**Document Expected Announcements** :

```
Button component screen reader test:
- Default: "Save changes, button"
- Disabled: "Save changes, button, dimmed"
- Loading: "Saving, button, busy"
- After save: "Changes saved successfully"
```

---

## Animation & Interaction Specifications

Animation must be specified precisely or developers will implement their own interpretation.

### Animation Documentation Template

For EVERY animation, provide:

#### Animation Overview

**Animation Name** : [e.g., "Button Hover Transition"]

**Trigger** : [What causes the animation?]

**Purpose** : [Why does this animate? What does it communicate?]

#### Technical Specifications

**Duration** : [milliseconds, use token]

**Timing Function** : [easing, use token]

**Properties Animated** : [list all CSS properties]

**Delay** : [milliseconds, if any]

**Iteration** : [once / infinite / number]

#### Animation States

**From** (Initial State):

* Property 1: [value]
* Property 2: [value]

**To** (End State):

* Property 1: [value]
* Property 2: [value]

#### CSS Implementation Example

css

```css
.button {
  /* Initial state */
  background-color: var(--color-primary-default);
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
  transition: 
    background-color 150ms ease-out,
    transform 150ms ease-out,
    box-shadow 150ms ease-out;
}

.button:hover {
  /* Animated to state */
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

### Common Animation Patterns

#### Hover Animations

**Lift Effect** (recommended for buttons, cards):

```
Duration: 150ms
Easing: ease-out
Properties:
  - transform: translateY(-2px)
  - box-shadow: increase elevation
```

**Color Transition** (all interactive elements):

```
Duration: 150ms
Easing: ease-out
Properties:
  - background-color
  - color
  - border-color
```

**Scale Effect** (icons, small elements):

```
Duration: 150ms
Easing: ease-out
Properties:
  - transform: scale(1.1)
```

#### Micro-interactions

**Ripple Effect** (material design style):

```
Trigger: Click/tap
Duration: 600ms
Easing: ease-out
Effect: Circular ripple from click point
Radius: Start 0, end 100% of container
Opacity: Start 0.3, end 0
```

**Checkbox Check Animation** :

```
Duration: 200ms
Easing: ease-in-out
Effect: Checkmark draws in using stroke-dashoffset
```

**Toggle Switch Animation** :

```
Duration: 200ms
Easing: ease-in-out
Properties:
  - background-color (track)
  - transform: translateX() (thumb)
```

#### Loading Animations

**Spinner** :

```
Duration: 1000ms
Easing: linear
Iteration: infinite
Effect: 360° rotation
```

**Skeleton Screen** :

```
Duration: 1500ms
Easing: ease-in-out
Iteration: infinite
Effect: Shimmer gradient moving left to right
```

**Progress Bar** :

```
Duration: Variable (based on actual progress)
Easing: ease-out
Effect: Width increases from 0% to completion
Update frequency: Every 100ms
```

#### Page Transitions

**Fade In** :

```
Duration: 300ms
Easing: ease-in
Properties:
  - opacity: 0 → 1
```

**Slide In** (modals, drawers):

```
Duration: 300ms
Easing: ease-out
Properties:
  - transform: translateY(20px) → translateY(0)
  - opacity: 0 → 1
```

**Scale In** (popovers, tooltips):

```
Duration: 200ms
Easing: ease-out
Properties:
  - transform: scale(0.95) → scale(1)
  - opacity: 0 → 1
Transform origin: [specify, e.g., "top left"]
```

### Reduced Motion

**Always specify reduced motion alternatives** :

css

```css
@media (prefers-reduced-motion: reduce) {
  .component {
    /* Remove or simplify animations */
    animation: none;
    transition: none;
  
    /* Or reduce to instant transitions */
    transition-duration: 0.01ms;
  }
}
```

**What to do for reduced motion** :

* Remove decorative animations completely
* Keep functional animations but make them instant/near-instant
* State changes should still be visible, just not animated
* Provide alternative visual indicators if needed

### Animation Performance Notes

**Animate only these properties for best performance** :

* `transform` (translate, scale, rotate)
* `opacity`

**Avoid animating** (causes repaints/reflows):

* `width` /`height`
* `top` /`left` /`right` /`bottom`
* `margin`
* `padding`

**Document Performance Requirements** :

```
This animation must run at 60fps
Use transform and opacity only
Use will-change: transform for complex animations
Remove will-change after animation completes
```

---

## Responsive Design Documentation

Every component must specify how it adapts across breakpoints.

### Responsive Behavior Matrix

For each component, fill out this matrix:

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Aspect</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Mobile (375px)</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Tablet (768px)</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Desktop (1024px)</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Width</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[value]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[value]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[value]</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Height</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[value]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[value]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[value]</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Padding</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[value]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[value]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[value]</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Font Size</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[value]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[value]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[value]</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Layout</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[description]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[description]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[description]</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Visibility</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[what's hidden/shown]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[what's hidden/shown]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[what's hidden/shown]</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Interaction</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[touch/mouse specific]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[touch/mouse specific]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[touch/mouse specific]</td></tr></tbody></table></pre>

### Responsive Patterns

#### Stacking Pattern

**Pattern** : Horizontal on desktop → Vertical on mobile

**Example** : Navigation Menu

* Desktop: Horizontal menu items in header
* Tablet: Same as desktop
* Mobile: Hamburger menu, vertical drawer

**Specification** :

```
Desktop (1024px+):
- Display: flex, flex-direction: row
- All items visible in header
- Height: 64px

Mobile (<768px):
- Display: Hidden behind hamburger icon
- Opens as full-screen drawer
- Vertical stack of menu items
- Drawer slides in from left
```

#### Reflow Pattern

**Pattern** : Multi-column → Fewer columns → Single column

**Example** : Product Grid

* Desktop: 4 columns
* Tablet: 2 columns
* Mobile: 1 column

**Specification** :

```
Desktop (1024px+):
- Grid: 4 columns
- Gap: 24px
- Card width: ~285px

Tablet (768-1023px):
- Grid: 2 columns
- Gap: 16px
- Card width: ~360px

Mobile (<768px):
- Grid: 1 column
- Gap: 16px
- Card width: 100%
```

#### Progressive Disclosure

**Pattern** : Show more content on larger screens

**Example** : Card Component

* Mobile: Title + summary (2 lines)
* Tablet: Title + summary (3 lines) + metadata
* Desktop: Title + full description + metadata + actions

**Specification** :

```
Mobile:
- Show: Title, 2-line summary, primary CTA
- Hide: Full description, secondary actions, metadata

Desktop:
- Show: All content
- Primary and secondary CTAs
- Full metadata row
```

### Touch vs. Mouse Considerations

#### Touch-Specific Design

**Touch Targets** :

* Minimum: 44×44px (WCAG requirement)
* Recommended: 48×48px
* Spacing: Minimum 8px between targets

**Touch Gestures to Document** :

* Tap: Single touch
* Long press: Touch and hold (specify duration)
* Swipe: Direction and what it does
* Pinch: Zoom in/out (if applicable)
* Pan: Scroll or drag

**Example Touch Specification** :

```
Mobile Card Component:
- Tap: Navigate to detail page
- Long press (500ms): Show context menu
- Swipe left: Reveal delete action
- Swipe right: Reveal favorite action
```

#### Mouse-Specific Design

**Desktop Enhancements** :

* Hover states (show additional info)
* Tooltips on hover
* Cursor changes (pointer, grab, etc.)
* Keyboard shortcuts

**Example Mouse Specification** :

```
Desktop Card Component:
- Hover: Show overlay with actions
- Cursor: pointer on entire card
- Keyboard: Tab focuses card, Enter activates
- Tooltip: Show full title on hover if truncated
```

### Responsive Images

#### Image Size Documentation

For each image, specify sizes for different viewports:

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Viewport</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Width</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Height</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">File Size</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Format</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Mobile</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">375px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">211px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">< 50KB</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">JPG/WebP</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Tablet</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">768px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">432px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">< 100KB</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">JPG/WebP</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Desktop</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1440px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">810px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">< 200KB</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">JPG/WebP</td></tr></tbody></table></pre>

#### Responsive Image Implementation

Document expected HTML:

html

```html
<img 
  src="image-375.jpg"
  srcset="
    image-375.jpg 375w,
    image-768.jpg 768w,
    image-1440.jpg 1440w
  "
  sizes="
    (max-width: 767px) 375px,
    (max-width: 1023px) 768px,
    1440px
  "
  alt="Descriptive alt text"
  loading="lazy"
>
```

### Responsive Typography

Document font size scaling:

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Element</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Mobile</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Tablet</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Desktop</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">H1</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">28px / 1.75rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">32px / 2rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">36px / 2.25rem</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">H2</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">24px / 1.5rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">28px / 1.75rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">30px / 1.875rem</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">H3</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">20px / 1.25rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">22px / 1.375rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">24px / 1.5rem</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Body</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px / 1rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px / 1rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px / 1rem</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Small</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">14px / 0.875rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">14px / 0.875rem</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">14px / 0.875rem</td></tr></tbody></table></pre>

**CSS Implementation** :

css

```css
h1 {
  font-size: 1.75rem; /* 28px mobile */
}

@media (min-width: 768px) {
  h1 {
    font-size: 2rem; /* 32px tablet */
  }
}

@media (min-width: 1024px) {
  h1 {
    font-size: 2.25rem; /* 36px desktop */
  }
}
```

---

## Handoff Checklist

Use this checklist before handing off any component to development:

### Pre-Handoff Review

#### Design Files

* [ ] All artboards properly labeled
* [ ] Layers organized and named clearly
* [ ] Unused layers deleted
* [ ] Latest version saved
* [ ] File location documented

#### Component Documentation

* [ ] Component overview completed
* [ ] Anatomy diagram created
* [ ] All states documented (default, hover, focus, disabled, etc.)
* [ ] All variants documented (sizes, styles, content variations)
* [ ] Behavior specifications written
* [ ] Responsive behavior documented for all breakpoints
* [ ] Animation specifications provided
* [ ] Content guidelines written

#### Design Tokens

* [ ] Colors specified with hex and tokens
* [ ] Typography specified with exact values
* [ ] Spacing values specified
* [ ] Border and radius values specified
* [ ] Shadow values specified
* [ ] All tokens match design system standards

#### Accessibility

* [ ] Semantic HTML element specified
* [ ] ARIA attributes documented (if needed)
* [ ] Keyboard navigation specified
* [ ] Focus states designed and documented
* [ ] Screen reader experience documented
* [ ] Color contrast ratios verified (4.5:1 minimum)
* [ ] Touch targets meet 44×44px minimum
* [ ] Reduced motion alternative specified

#### Assets

* [ ] All icons exported in required sizes
* [ ] All images exported at correct resolutions
* [ ] All assets optimized
* [ ] Asset naming follows conventions
* [ ] Assets organized in proper folder structure
* [ ] Export settings documented

#### Code Specifications

* [ ] HTML structure example provided
* [ ] CSS class names specified (BEM or chosen methodology)
* [ ] JavaScript behaviors documented
* [ ] Dependencies listed
* [ ] Code implementation notes provided

### Handoff Meeting Agenda

Schedule a handoff meeting with developers to review:

1. **Component Overview** (5 min)
   * Purpose and use cases
   * When to use / when not to use
2. **Visual Walkthrough** (10 min)
   * All states and variants
   * Responsive behavior
   * Animation and interactions
3. **Technical Specifications** (15 min)
   * Design tokens used
   * Measurements and spacing
   * Accessibility requirements
   * Code structure
4. **Q&A** (10 min)
   * Developer questions
   * Clarifications
   * Edge cases discussion
5. **Next Steps** (5 min)
   * Timeline
   * Implementation approach
   * Review process

### Post-Handoff

#### Developer Access

* [ ] Design files shared with proper permissions
* [ ] Assets folder shared
* [ ] Documentation shared
* [ ] Design system reference shared
* [ ] Communication channel established (Slack, email, etc.)

#### Implementation Support

* [ ] Available for questions during development
* [ ] Review development builds
* [ ] Verify implementation matches design
* [ ] Approve final implementation

#### Documentation Updates

* [ ] Update component status to "In Development"
* [ ] Track feedback and edge cases discovered
* [ ] Document any approved deviations
* [ ] Update design files if changes made

---

## Example Component Documentation

Here's a complete example showing how to document a component properly.

### Example: Primary Button Component

---

## Component: Primary Button

**Version** : 1.0

**Designer** : Jane Smith

**Date** : 2024-10-15

**Status** : Approved

**Type** : Atom

### Overview

**Purpose** : Primary action button used for the most important action on a page. Only one primary button should be visible per section.

**When to Use** :

* Main call-to-action (e.g., "Save", "Submit", "Create Account")
* Completing a workflow
* Confirming an action

**When NOT to Use** :

* For multiple actions of equal importance (use Secondary Button)
* For destructive actions (use Error/Danger Button)
* For navigation (use Link or Tertiary Button)
* When space is limited (consider Icon Button)

### Anatomy

```
Primary Button Structure:
┌─────────────────────────────────────────────────────────┐
│  [icon]  20px gap  Button Label Text                    │  ← Container
│   ↑                 ↑                                    │     44px height
│  20px               16px, --font-weight-medium          │
│  icon               --color-white                       │
│  (optional)                                             │
└─────────────────────────────────────────────────────────┘
 ↑                                                       ↑
 20px padding-left                         20px padding-right

Components:
1. Container (.button-primary)
   - Background: --color-primary-brand-default
   - Border: none
   - Border radius: --radius-default (4px)
   - Height: 44px
   - Min-width: 120px
   - Padding: 0 20px

2. Icon (.button__icon) [optional]
   - Size: 20px
   - Color: currentColor (inherits white)
   - Position: Left of text
   - Margin-right: 8px

3. Label (.button__label)
   - Font: --font-family-primary
   - Size: --font-size-base (16px)
   - Weight: --font-weight-medium (500)
   - Color: --color-white
   - Line-height: --line-height-normal (1.5)
```

### Visual Specifications

#### Default State

**Dimensions** :

* Width: Auto (min-width: 120px, max-width: 100% container)
* Height: 44px
* Padding: 0 20px (horizontal), 0 (vertical, due to line-height)
* Margin: None (defined by context)

**Typography** :

* Font family:`--font-family-primary` (Inter)
* Font size:`--font-size-base` (16px / 1rem)
* Font weight:`--font-weight-medium` (500)
* Line height:`--line-height-normal` (1.5 / 24px)
* Letter spacing: 0
* Text color:`--color-white` (`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#FFFFFF`)
* Text align: center
* Text transform: none

**Colors** :

* Background:`--color-primary-brand-default` (`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#0066CC`)
* Text:`--color-white` (`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#FFFFFF`)
* Border: none
* Icon:`currentColor` (inherits text color)

**Border & Effects** :

* Border: none
* Border radius:`--radius-default` (4px)
* Box shadow: none (default state)
* Opacity: 1

**Cursor** : pointer

### States & Variations

#### 1. Hover State

**Trigger** : Mouse cursor enters button bounds

**Visual Changes** :

* Background:`--color-primary-brand-hover` (`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#0052A3`)
* Shadow:`--shadow-md` (elevation increase)
* Transform:`translateY(-1px)` (subtle lift)
* Cursor: pointer

**Animation** :

css

```css
transition: 
  background-color 150ms ease-out,
  box-shadow 150ms ease-out,
  transform 150ms ease-out;
```

**Duration** : 150ms

**Easing** : ease-out

**Properties** : background-color, box-shadow, transform

#### 2. Active/Pressed State

**Trigger** : Mouse button down on button

**Visual Changes** :

* Background:`--color-primary-brand-active` (`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#003D7A`)
* Transform:`translateY(0)` (return to flat)
* Shadow:`--shadow-sm` (reduced elevation)

**Animation** : Same transition as hover

#### 3. Focus State

**Trigger** : Tab key navigation to button, or click

**Visual Changes** :

* All default styles remain
* Focus ring added:
  * Outline: 2px solid`--color-focus` (`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#4C9AFF`)
  * Outline-offset: 2px
  * Border-radius: 6px (slightly larger than button)

**Keyboard Interaction** :

* Tab: Focus on button
* Enter or Space: Activate button
* Focus ring must be visible for keyboard users

**CSS Implementation** :

css

```css
.button-primary:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

#### 4. Disabled State

**Trigger** : `disabled` attribute set, or `aria-disabled="true"`

**Visual Changes** :

* Background:`--color-neutral-300` (`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#E0E0E0`)
* Text:`--color-neutral-500` (`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#9E9E9E`)
* Shadow: none
* Cursor: not-allowed
* Opacity: 1 (using color change, not opacity)

**Behavior** :

* Cannot be clicked
* Cannot receive focus
* Pointer events disabled
* Screen reader announces "dimmed" or "unavailable"

#### 5. Loading State

**Trigger** : Asynchronous operation in progress (form submission, data fetch, etc.)

**Visual Changes** :

* Text changes to "Loading..." or remains as original text
* Spinner icon appears (replacing icon if present)
* Background:`--color-primary-brand-default` (same as default)
* Button becomes temporarily disabled (cannot be clicked again)
* Cursor: wait or progress

**Spinner Specifications** :

* Size: 20px
* Color: white
* Animation: 360° rotation, 1000ms linear infinite
* Position: Left of text (or centered if icon-only)

**Behavior** :

* Click events disabled during loading
* Screen reader announces: "Loading" (via aria-live region)
* Focus remains on button
* Minimum loading display: 300ms (prevent flicker)

**CSS Implementation** :

css

```css
.button-primary--loading {
  cursor: wait;
  pointer-events: none;
}

.button__spinner {
  animation: spin 1000ms linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Size Variants

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Variant</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Height</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Padding (H)</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Font Size</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Icon Size</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Use Case</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Small</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">32px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">12px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">14px (--font-size-sm)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Compact interfaces, data tables</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Medium (Default)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">44px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">20px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px (--font-size-base)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">20px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Standard usage, most contexts</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Large</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">56px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">28px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">18px (--font-size-lg)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">24px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Hero CTAs, important actions</td></tr></tbody></table></pre>

**Class naming** :

* `.button-primary--small`
* `.button-primary--medium` (or no modifier, as default)
* `.button-primary--large`

### Content Variants

#### With Icon (Left)

**Layout** :

* Icon: 20px, left of text
* Gap: 8px between icon and text
* Icon color: currentColor

**Usage** : Common actions with recognizable icons (Save, Download, etc.)

**Example** :

html

```html
<button class="button-primary">
  <svg class="button__icon" width="20" height="20">...</svg>
  <span class="button__label">Save Changes</span>
</button>
```

#### Icon Only

**Layout** :

* Width equals height (square: 44×44px for medium)
* Icon centered horizontally and vertically
* No padding needed (icon itself provides visual balance)

**Requirements** :

* MUST include`aria-label` (not optional)
* Icon size: 20px for medium button

**Usage** : When space is very limited and icon meaning is universal

**Example** :

html

```html
<button class="button-primary button-primary--icon-only" aria-label="Add item">
  <svg class="button__icon" width="20" height="20">...</svg>
</button>
```

#### Long Text Handling

**Max width** : None (button grows with text)

**Recommended max characters** : 25

**Text overflow** : Do not truncate button text

**Multi-line** : Avoid. If absolutely necessary, center-align and adjust height automatically

**Guideline** : Keep button text concise. If text is long, reconsider the label.

### Behavior Specifications

#### On Click/Tap

**Action** : Executes primary action (submit form, navigate, trigger modal, etc.)

**Loading State** :

1. Immediately enter loading state
2. Show spinner
3. Change text to "Loading..." OR keep original text
4. Disable button (prevent double-submission)
5. Screen reader announces "Loading"

**Success Feedback** (after async operation completes successfully):

* Option A: Replace button text with "Saved!" and checkmark icon (2 seconds), then revert
* Option B: Navigate to next page
* Option C: Show toast notification and return button to default state

**Error Handling** (if operation fails):

* Return button to default state
* Display error message below/near button
* Error message color:`--color-error-default`
* Screen reader announces error message
* Button remains enabled for retry

#### On Focus (Keyboard)

**Visual** :

* Focus ring appears (2px blue outline, 2px offset)
* No other visual changes

**Keyboard Navigation** :

* `Tab`: Focus on button
* `Shift + Tab`: Focus on previous element
* `Enter`: Activate button (same as click)
* `Space`: Activate button (same as click)

#### On Long Press (Mobile)

**Behavior** : None (treated as normal tap)

**Note** : If a tooltip or additional action is needed on long press, specify it explicitly.

### Responsive Behavior

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Breakpoint</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Width</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Height</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Padding</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Font Size</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Changes</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Mobile (375px)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">100%</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">44px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Full width on mobile</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Tablet (768px)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Auto</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">44px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">20px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Auto width, inline</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Desktop (1024px+)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Auto</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">48px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">24px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">16px</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Slightly larger height</td></tr></tbody></table></pre>

**Mobile Considerations** :

* Primary button takes full width of container on mobile
* Placed at bottom of forms for easy thumb reach
* Minimum touch target: 44×44px (WCAG compliant)

**Desktop Considerations** :

* Buttons inline horizontally
* Adequate spacing between multiple buttons (min 16px gap)
* Hover states enabled

### Content Guidelines

#### Character Limits

* **Minimum** : 2 characters
* **Recommended** : 2-15 characters
* **Maximum** : 30 characters (after which consider redesign)

#### Microcopy Examples

**Do** :

* ✓ Save Changes
* ✓ Create Account
* ✓ Get Started
* ✓ Submit Order
* ✓ Download Report

**Don't** :

* ✗ OK
* ✗ Submit
* ✗ Click Here
* ✗ Click Here to Continue to the Next Step

**Tone** : Action-oriented, clear, specific

#### Text Guidelines

* Use sentence case (not UPPERCASE or Title Case)
* Lead with strong verb
* Be specific about the action
* Keep it short and scannable
* Avoid generic words like "OK" or "Submit"

### Accessibility Requirements

#### WCAG Level: AA

#### Semantic HTML

html

```html
<button type="button" class="button-primary">
  Save Changes
</button>
```

**Requirements** :

* Use`<button>` element (NOT`<div>` or`<a>`)
* Include`type` attribute: "button", "submit", or "reset"
* Do not use`<a>` tag unless navigating to URL

#### ARIA Attributes

**Standard Use** (text button):

html

```html
<button type="button" class="button-primary">
  Save Changes
</button>
```

No ARIA needed if visible text is sufficient.

**Icon Only Button** (requires aria-label):

html

```html
<button 
  type="button" 
  class="button-primary button-primary--icon-only"
  aria-label="Add item"
>
  <svg aria-hidden="true">...</svg>
</button>
```

**Loading State** :

html

```html
<button 
  type="button" 
  class="button-primary"
  aria-busy="true"
  disabled
>
  <span aria-live="polite" aria-atomic="true">Loading...</span>
</button>
```

**Disabled State** :

html

```html
<button 
  type="button" 
  class="button-primary"
  disabled
  aria-disabled="true"
>
  Save Changes
</button>
```

#### Keyboard Support

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Key</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Action</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Tab</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Move focus to button</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Shift + Tab</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Move focus to previous element</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Enter</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Activate button</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Space</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Activate button</td></tr></tbody></table></pre>

**Focus Management** :

* Focus indicator MUST be visible (no`outline: none` without alternative)
* Focus order must be logical (follows visual order)
* Focus must not be trapped

#### Screen Reader Experience

**Default State** :

```
"Save Changes, button"
```

**Disabled State** :

```
"Save Changes, button, dimmed"
or
"Save Changes, button, unavailable"
```

**Loading State** :

```
"Save Changes, button, busy"
[After state change]
"Loading..."
```

**After Success** :

```
"Changes saved successfully"
(Announced via aria-live region, not the button itself)
```

#### Color & Contrast

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Element</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Background</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Foreground</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Ratio</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Pass</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Text (default)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem] inline-flex items-center h-5"><span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#0066CC</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem] inline-flex items-center h-5"><span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#FFFFFF</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">7.2:1</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">✓ AAA</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Text (hover)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem] inline-flex items-center h-5"><span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#0052A3</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem] inline-flex items-center h-5"><span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#FFFFFF</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">8.4:1</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">✓ AAA</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Text (disabled)</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem] inline-flex items-center h-5"><span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#E0E0E0</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem] inline-flex items-center h-5"><span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#9E9E9E</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">2.1:1</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">✓ (not required for disabled)</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Focus ring</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem] inline-flex items-center h-5"><span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#FFFFFF</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]"><code class="bg-text-200/5 border border-0.5 border-border-300 text-danger-000 whitespace-pre-wrap rounded-[0.4rem] px-1 py-px text-[0.9rem] inline-flex items-center h-5"><span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#4C9AFF</code></td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">4.8:1</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">✓ AA</td></tr></tbody></table></pre>

**Contrast Requirements Met** :

* Normal text: 4.5:1 minimum (WCAG AA) ✓
* UI component: 3:1 minimum (WCAG AA) ✓
* Focus indicator: 3:1 minimum (WCAG AA) ✓

**Non-Color Indicators** :

* Disabled state: Uses grayscale colors AND disabled cursor AND cannot receive focus
* Loading state: Shows spinner animation in addition to any color changes
* Focus state: Uses outline in addition to any color changes

#### Touch Target Size

**Mobile** :

* Minimum: 44×44px (WCAG 2.5.5, Level AAA)
* Actual: 44px height, full width on mobile ✓

**Spacing** :

* Minimum gap between buttons: 8px
* Recommended gap: 16px

#### Motion & Animation

**Standard Animation** :

css

```css
.button-primary {
  transition: 
    background-color 150ms ease-out,
    box-shadow 150ms ease-out,
    transform 150ms ease-out;
}
```

**Reduced Motion Alternative** :

css

```css
@media (prefers-reduced-motion: reduce) {
  .button-primary {
    transition: none;
  }
  
  .button-primary:hover {
    transform: none; /* Remove lift effect */
  }
}
```

**Requirement** : All decorative animations removed, state changes remain instant.

### Code Implementation

#### HTML Structure

**Standard Button** :

html

```html
<button type="button" class="button-primary">
  Save Changes
</button>
```

**With Icon** :

html

```html
<button type="button" class="button-primary">
  <svg class="button__icon" width="20" height="20" aria-hidden="true" focusable="false">
    <use href="#icon-save"></use>
  </svg>
  <span class="button__label">Save Changes</span>
</button>
```

**Loading State** :

html

```html
<button type="button" class="button-primary button-primary--loading" disabled aria-busy="true">
  <svg class="button__spinner" width="20" height="20" aria-hidden="true">
    <!-- Spinner SVG -->
  </svg>
  <span class="button__label">Loading...</span>
</button>
```

#### CSS Classes (BEM)

**Base** :

* `.button-primary` - Base button class

**Modifiers** :

* `.button-primary--small` - Small size variant
* `.button-primary--large` - Large size variant
* `.button-primary--loading` - Loading state
* `.button-primary--icon-only` - Icon only variant

**Elements** :

* `.button__icon` - Icon element
* `.button__label` - Text label element
* `.button__spinner` - Loading spinner element

**State Classes** (avoid, use attributes when possible):

* Prefer`:disabled`,`:hover`,`:focus`,`:active` pseudo-classes
* If JS-controlled states needed:`.is-loading`,`.is-disabled`

#### CSS Implementation

css

```css
.button-primary {
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
  height: 44px;
  padding: 0 20px;
  
  /* Typography */
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  text-align: center;
  
  /* Visual */
  background-color: var(--color-primary-brand-default);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-default);
  box-shadow: none;
  
  /* Interaction */
  cursor: pointer;
  user-select: none;
  
  /* Animation */
  transition: 
    background-color 150ms ease-out,
    box-shadow 150ms ease-out,
    transform 150ms ease-out;
}

.button-primary:hover {
  background-color: var(--color-primary-brand-hover);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.button-primary:active {
  background-color: var(--color-primary-brand-active);
  box-shadow: var(--shadow-sm);
  transform: translateY(0);
}

.button-primary:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.button-primary:disabled {
  background-color: var(--color-neutral-300);
  color: var(--color-neutral-500);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Size variants */
.button-primary--small {
  height: 32px;
  padding: 0 12px;
  font-size: var(--font-size-sm);
}

.button-primary--large {
  height: 56px;
  padding: 0 28px;
  font-size: var(--font-size-lg);
}

/* Icon only */
.button-primary--icon-only {
  width: 44px;
  min-width: unset;
  padding: 0;
}

/* Loading state */
.button-primary--loading {
  cursor: wait;
  pointer-events: none;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .button-primary {
    transition: none;
  }
  
  .button-primary:hover {
    transform: none;
  }
}

/* Responsive */
@media (max-width: 767px) {
  .button-primary {
    width: 100%;
  }
}
```

#### JavaScript Behavior

**Prevent Double-Submission** :

javascript

```javascript
const button = document.querySelector('.button-primary');

button.addEventListener('click', async (e) => {
  // Prevent double-click
  if (button.hasAttribute('disabled')) return;
  
  // Enter loading state
  button.setAttribute('disabled', '');
  button.setAttribute('aria-busy', 'true');
  button.classList.add('button-primary--loading');
  
  try {
    // Perform async operation
    await submitForm();
  
    // Success state (optional, for 2 seconds)
    button.textContent = 'Saved!';
    setTimeout(() => {
      button.textContent = 'Save Changes';
      button.removeAttribute('disabled');
      button.removeAttribute('aria-busy');
      button.classList.remove('button-primary--loading');
    }, 2000);
  
  } catch (error) {
    // Error state - return to default, show error message
    button.removeAttribute('disabled');
    button.removeAttribute('aria-busy');
    button.classList.remove('button-primary--loading');
  
    // Display error (implementation depends on your error UI)
    showError(error.message);
  }
});
```

### Dependencies

**Required Components** :

* None (atomic component)

**Optional Enhancements** :

* Icon component (for buttons with icons)
* Spinner component (for loading state)
* Tooltip component (for additional context)

**Required Design Tokens** :

* Colors:`--color-primary-brand-*`,`--color-white`,`--color-neutral-*`,`--color-focus`
* Typography:`--font-family-primary`,`--font-size-*`,`--font-weight-*`,`--line-height-normal`
* Spacing:`--space-*`
* Border:`--radius-default`
* Shadow:`--shadow-sm`,`--shadow-md`
* Animation:`--duration-fast`,`--ease-out`

### Design Files & Assets

**Adobe Illustrator File** :

* File:`button-primary-v1.ai`
* Location:`/design-system/components/buttons/`
* Artboards: All states (default, hover, active, focus, disabled, loading)

**Exported Assets** :

* [ ]`button-primary-states@2x.png` (all states for documentation)
* [ ] No icon exports needed (icons are separate components)

**Version History** :

* v1.0 (2024-10-15): Initial design - Jane Smith

---

### Implementation Notes

**Performance** :

* Keep button animations GPU-accelerated (use`transform` and`opacity`)
* Loading spinner should be lightweight SVG
* Avoid heavy box-shadows on buttons that appear frequently

**Browser Support** :

* Target: Last 2 versions of major browsers
* Fallback for no`:focus-visible` support: use`:focus`
* Test on mobile devices for touch interactions

**Common Pitfalls** :

* Don't use`<a>` tags for buttons (not semantically correct)
* Don't forget`type="button"` attribute
* Don't remove focus outline without providing alternative
* Don't make disabled buttons "invisible" (reduce contrast but keep visible)
* Don't allow double-submission without loading state

---

## Common Pitfalls & Solutions

Learn from common mistakes in design-to-dev handoff:

### Pitfall 1: Missing State Documentation

**Problem** : Designer only provides default state, no hover, focus, disabled, or error states.

**Impact** :

* Developer guesses at hover colors
* Accessibility violations (no focus state)
* Inconsistent disabled states across components

**Solution** :

* Document ALL states for EVERY interactive component
* Minimum states: default, hover, focus, active, disabled
* Include loading and error states where applicable
* Show states in design file as separate artboards

**Checklist** :

* [ ] Default
* [ ] Hover
* [ ] Active/Pressed
* [ ] Focus
* [ ] Disabled
* [ ] Loading (if applicable)
* [ ] Error (if applicable)
* [ ] Success (if applicable)

---

### Pitfall 2: Ambiguous Measurements

**Problem** : Design shows visual spacing but doesn't specify exact pixel values.

**Impact** :

* Developer eyeballs measurements
* Inconsistent spacing across components
* Doesn't match design

**Solution** :

* Label EVERY measurement in design files
* Use design tokens (not arbitrary values)
* Provide spacing specifications in a table format
* Include padding, margin, gap, and width/height

**Good Example** :

```
Button Spacing:
- Height: 44px
- Padding left: 20px
- Padding right: 20px
- Icon gap: 8px
- Min width: 120px
```

**Bad Example** :
"Make the button comfortable to click"

---

### Pitfall 3: Inconsistent Naming

**Problem** : Design calls it "Primary Button", developer names it ".btn-main", documentation calls it "Call to Action Button".

**Impact** :

* Confusion across team
* Hard to find components
* Inconsistent codebase

**Solution** :

* Agree on naming convention before design starts
* Use the SAME names in design files, code, and documentation
* Document naming conventions
* Use a naming dictionary/glossary

**Naming Dictionary Example** :

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Component</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Design Name</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">CSS Class</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">JS Reference</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Figma/AI File Name</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Primary Button</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Primary Button</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">.button-primary</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">button-primary</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">button-primary-v1.ai</td></tr><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Text Input</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Text Input</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">.input-text</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">input-text</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">input-text-v1.ai</td></tr></tbody></table></pre>

---

### Pitfall 4: Missing Responsive Specifications

**Problem** : Only desktop design provided, no mobile or tablet specifications.

**Impact** :

* Developer makes assumptions about mobile layout
* Poor mobile experience
* Back-and-forth revisions

**Solution** :

* Design for mobile, tablet, AND desktop
* Show how components stack, resize, or hide on smaller screens
* Specify breakpoint behavior explicitly
* Show touch-specific considerations

**Required Breakpoints** :

* Mobile: 375px
* Tablet: 768px
* Desktop: 1024px+

---

### Pitfall 5: No Accessibility Specifications

**Problem** : No mention of keyboard navigation, screen readers, or ARIA attributes.

**Impact** :

* Accessibility violations
* Legal liability
* Poor user experience for disabled users
* Failed audits

**Solution** :

* Include accessibility requirements for EVERY component
* Specify semantic HTML element
* Document keyboard interactions
* Specify ARIA attributes when needed
* Verify color contrast ratios
* Consider screen reader announcements

**Accessibility Checklist for Every Component** :

* [ ] Semantic HTML specified
* [ ] Keyboard navigation documented
* [ ] Focus state designed
* [ ] ARIA attributes listed
* [ ] Color contrast verified (4.5:1 minimum)
* [ ] Screen reader experience documented
* [ ] Touch target size meets 44×44px minimum

---

### Pitfall 6: Color Values Without Tokens

**Problem** : Designer specifies "`<span class="inline-block w-3 h-3 border-[0.5px] border-border-200 rounded flex-shrink-0 shadow-sm mr-1 align-middle"></span>#0066CC`" but doesn't reference design token.

**Impact** :

* Developer doesn't know if this is a token or one-off value
* Hard to maintain when brand colors change
* Inconsistent color usage

**Solution** :

* ALWAYS reference design tokens, not raw hex values
* Format:`--color-primary-brand-default (#0066CC)`
* Document token system before designing components
* Use tokens in design files (name layers with token names)

**Good Example** :

```
Background color: --color-primary-brand-default (#0066CC)
Hover background: --color-primary-brand-hover (#0052A3)
```

**Bad Example** :

```
Background color: #0066CC
Hover background: A slightly darker blue
```

---

### Pitfall 7: Missing Animation Specifications

**Problem** : Design shows animated prototype, but no timing, easing, or property specifications.

**Impact** :

* Developer guesses animation speed
* Animations feel inconsistent
* Motion sickness for some users (too fast/bouncy)

**Solution** :

* Specify duration in milliseconds (use tokens)
* Specify easing function (use tokens)
* List which properties animate
* Provide CSS example
* Include reduced-motion alternative

**Animation Specification Template** :

```
Animation: Button Hover
Duration: 150ms
Easing: ease-out
Properties: background-color, box-shadow, transform
Reduced Motion: Set transition-duration to 0ms
```

---

### Pitfall 8: Assets Not Optimized

**Problem** : Designer exports huge PNG files or bloated SVGs.

**Impact** :

* Slow page load times
* Poor performance
* Large repository size
* Wasted bandwidth

**Solution** :

* Optimize all assets before exporting
* SVG: Use SVGO or similar optimizer
* PNG: Use ImageOptim or TinyPNG
* JPG: 80-90% quality, progressive format
* Target sizes: Icons < 10KB, Images < 200KB

**Optimization Tools** :

* SVGO (command line or online)
* ImageOptim (Mac)
* TinyPNG (online)
* Squoosh (online)

---

### Pitfall 9: Unclear Content Guidelines

**Problem** : No guidance on text length, character limits, or overflow behavior.

**Impact** :

* Text breaks layout with long content
* Truncation inconsistent
* Multilingual support issues

**Solution** :

* Specify minimum and maximum character counts
* Show how text truncates (ellipsis, wrap, clip)
* Provide microcopy examples
* Test with longest expected content
* Consider multilingual text expansion (German, Spanish often 30% longer)

**Content Specification Example** :

```
Button Text:
- Min characters: 2
- Max characters: 30
- Recommended: 5-15 characters
- Overflow: Do not truncate
- Examples: "Save Changes", "Create Account", "Download Report"
```

---

### Pitfall 10: No Edge Case Examples

**Problem** : Only happy path shown, no error states, empty states, or loading states.

**Impact** :

* Developer doesn't know how to handle errors
* Inconsistent error displays
* Poor user experience

**Solution** :

* Design and document edge cases:
  * Empty states (no data)
  * Loading states (fetching data)
  * Error states (failed to load)
  * Success states (action completed)
  * Maximum content (very long text)
  * Minimum content (short text)

**Edge Cases to Consider** :

* Empty state
* Loading state
* Error state
* Success state
* Very long content
* Very short content
* Missing images
* Disabled state
* No permissions state

---

### Pitfall 11: Forgetting About Adobe-Specific Workflow

**Problem** : Design handoff assumes Figma inspect tools that don't exist in Adobe Creative Suite.

**Impact** :

* Developers can't easily inspect designs
* Back-and-forth for measurements
* Slower development process

**Solution** :

* Create detailed specification sheets (annotated screenshots)
* Export mockups with measurements labeled
* Provide a redline document showing all dimensions
* Share source files with organized layers
* Use plugins like Zeplin or Avocode for Adobe workflow

**Adobe-Specific Handoff Checklist** :

* [ ] All measurements labeled in design file
* [ ] Specification sheet exported as PDF or annotated PNG
* [ ] All layers named clearly
* [ ] Assets exported from design file
* [ ] Source files (.ai, .psd) shared with developers
* [ ] Color values documented separately (not relying on inspect)

---

## Next Steps

### For Designers

1. **Review this guide** thoroughly before starting new component designs
2. **Bookmark** this document for quick reference
3. **Use the checklists** before handoff meetings
4. **Communicate** with developers early and often
5. **Iterate** based on developer feedback
6. **Update** documentation when designs change

### For Developers

1. **Reference** this guide during implementation
2. **Ask questions** early if specifications are unclear
3. **Provide feedback** to designers on what's helpful vs. what's missing
4. **Review** designs before starting development
5. **Share** implementation challenges and constraints with designers

### For Teams

1. **Adopt** this guide as your standard process
2. **Customize** templates to fit your specific needs
3. **Iterate** on the process based on what works
4. **Train** new team members using this guide
5. **Maintain** a living document that evolves with your system

---

## Additional Resources

### Design System References

* Material Design:[https://material.io/design](https://material.io/design)
* Apple Human Interface Guidelines:[https://developer.apple.com/design/](https://developer.apple.com/design/)
* IBM Carbon Design System:[https://carbondesignsystem.com/](https://carbondesignsystem.com/)
* Atlassian Design System:[https://atlassian.design/](https://atlassian.design/)

### Accessibility Resources

* WCAG 2.1 Guidelines:[https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)
* WebAIM Contrast Checker:[https://webaim.org/resources/contrastchecker/](https://webaim.org/resources/contrastchecker/)
* A11y Project Checklist:[https://www.a11yproject.com/checklist/](https://www.a11yproject.com/checklist/)

### Tools

* SVGO:[https://github.com/svg/svgo](https://github.com/svg/svgo)
* ImageOptim:[https://imageoptim.com/](https://imageoptim.com/)
* TinyPNG:[https://tinypng.com/](https://tinypng.com/)
* Can I Use (Browser Support):[https://caniuse.com/](https://caniuse.com/)

### Further Reading

* "Design Systems" by Alla Kholmatova
* "Atomic Design" by Brad Frost
* "Inclusive Components" by Heydon Pickering
* "Refactoring UI" by Adam Wathan & Steve Schoger

---

## Document Version History

<pre class="font-ui border-border-100/50 overflow-x-scroll w-full rounded border-[0.5px] shadow-[0_2px_12px_hsl(var(--always-black)/5%)]"><table class="bg-bg-100 min-w-full border-separate border-spacing-0 text-sm leading-[1.88888] whitespace-normal"><thead class="border-b-border-100/50 border-b-[0.5px] text-left"><tr class="[tbody>&]:odd:bg-bg-500/10"><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Version</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Date</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Author</th><th class="text-text-000 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] px-2 [&:not(:first-child)]:border-l-[0.5px]">Changes</th></tr></thead><tbody><tr class="[tbody>&]:odd:bg-bg-500/10"><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">1.0</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">2024-10-15</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">[Your Name]</td><td class="border-t-border-100/50 [&:not(:first-child)]:-x-[hsla(var(--border-100) / 0.5)] border-t-[0.5px] px-2 [&:not(:first-child)]:border-l-[0.5px]">Initial document creation</td></tr></tbody></table></pre>

---

## Feedback & Questions

This is a living document. If you have questions, suggestions, or find areas that need clarification:

**Contact** : [[your-email@company.com](mailto:your-email@company.com)]

**Slack** : #design-system

**Documentation Repository** : [link to repo]

Your feedback helps improve this guide for everyone!

---

**End of Design-to-Dev Handoff Guide**
