/**
 * Tabs Component
 * Tabbed interface with keyboard navigation
 * @element lc-tabs
 * @attr {string} orientation - Tab orientation (horizontal|vertical) default: horizontal
 * @attr {string} active - ID of active tab
 * @attr {string} variant - Tab variant (line|enclosed|pills) default: line
 * @fires lc-tab-change - Emitted when active tab changes
 * @example
 * <lc-tabs active="tab1">
 *   <div slot="tabs">
 *     <button data-tab="tab1">Tab 1</button>
 *     <button data-tab="tab2">Tab 2</button>
 *     <button data-tab="tab3">Tab 3</button>
 *   </div>
 *
 *   <div data-panel="tab1">Content for tab 1</div>
 *   <div data-panel="tab2">Content for tab 2</div>
 *   <div data-panel="tab3">Content for tab 3</div>
 * </lc-tabs>
 */

import Component from '../base/Component.js';

class LCTabs extends Component {
  static get observedAttributes() {
    return ['orientation', 'active', 'variant'];
  }

  constructor() {
    super();
    this.useShadowDOM = false;
    this.tabsId = `lc-tabs-${Math.random().toString(36).substring(2, 11)}`;
    this.tabs = [];
    this.panels = [];
  }

  async render() {
    const orientation = this.getAttr('orientation', 'horizontal');
    const active = this.getAttr('active');
    const variant = this.getAttr('variant', 'line');

    // Extract tabs and panels from children
    const tabsSlot = this.querySelector('[slot="tabs"]');
    const tabButtons = tabsSlot ? Array.from(tabsSlot.children) : [];
    const panelElements = Array.from(this.children).filter(el =>
      el.hasAttribute('data-panel') && !el.hasAttribute('slot')
    );

    // Build classes
    const wrapperClasses = [
      'lc-tabs',
      `lc-tabs--${orientation}`,
      `lc-tabs--${variant}`
    ];

    // Build HTML
    let html = `
      <div
        class="lc-tabs__list"
        role="tablist"
        aria-orientation="${orientation}"
      >
    `;

    // Build tab buttons
    tabButtons.forEach((button, index) => {
      const tabId = button.dataset.tab || `tab-${index}`;
      const isActive = active ? tabId === active : index === 0;
      const label = button.textContent || button.getAttribute('aria-label') || `Tab ${index + 1}`;

      html += `
        <button
          type="button"
          role="tab"
          id="${this.tabsId}-tab-${tabId}"
          class="lc-tabs__tab ${isActive ? 'lc-tabs__tab--active' : ''}"
          aria-selected="${isActive}"
          aria-controls="${this.tabsId}-panel-${tabId}"
          tabindex="${isActive ? '0' : '-1'}"
          data-tab="${tabId}"
        >
          ${this.escapeHtml(label)}
        </button>
      `;
    });

    html += '</div>'; // Close tablist

    // Build tab panels
    html += '<div class="lc-tabs__panels">';

    panelElements.forEach((panel, index) => {
      const panelId = panel.dataset.panel || `tab-${index}`;
      const isActive = active ? panelId === active : index === 0;

      html += `
        <div
          role="tabpanel"
          id="${this.tabsId}-panel-${panelId}"
          class="lc-tabs__panel ${isActive ? 'lc-tabs__panel--active' : ''}"
          aria-labelledby="${this.tabsId}-tab-${panelId}"
          tabindex="0"
          ${!isActive ? 'hidden' : ''}
          data-panel="${panelId}"
        >
          ${panel.innerHTML}
        </div>
      `;
    });

    html += '</div>'; // Close panels

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = wrapperClasses.join(' ');
    wrapper.innerHTML = html;

    // Replace content
    this.innerHTML = '';
    this.appendChild(wrapper);

    // Cache tabs and panels
    this.tabs = this.$$('[role="tab"]');
    this.panels = this.$$('[role="tabpanel"]');

    this.applyStyles();
  }

  setupEventListeners() {
    const tabs = this.$$('[role="tab"]');

    tabs.forEach((tab, index) => {
      // Click
      this.on(tab, 'click', () => {
        const tabId = tab.dataset.tab;
        this.activateTab(tabId);
      });

      // Keyboard navigation
      this.on(tab, 'keydown', (event) => {
        this.handleKeyboard(event, index);
      });
    });
  }

  /**
   * Handle keyboard navigation
   * @param {KeyboardEvent} event
   * @param {number} currentIndex
   */
  handleKeyboard(event, currentIndex) {
    const orientation = this.getAttr('orientation', 'horizontal');
    let targetIndex = currentIndex;

    if (orientation === 'horizontal') {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        targetIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        targetIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
      }
    } else {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        targetIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        targetIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
      }
    }

    if (event.key === 'Home') {
      event.preventDefault();
      targetIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      targetIndex = this.tabs.length - 1;
    }

    // Activate target tab
    if (targetIndex !== currentIndex && this.tabs[targetIndex]) {
      const targetTabId = this.tabs[targetIndex].dataset.tab;
      this.activateTab(targetTabId);
      this.tabs[targetIndex].focus();
    }
  }

  /**
   * Activate a tab
   * @param {string} tabId
   */
  activateTab(tabId) {
    if (!tabId) return;

    // Update attribute
    this.setAttribute('active', tabId);

    // Update tabs
    this.tabs.forEach(tab => {
      const isActive = tab.dataset.tab === tabId;
      tab.classList.toggle('lc-tabs__tab--active', isActive);
      tab.setAttribute('aria-selected', isActive);
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    // Update panels
    this.panels.forEach(panel => {
      const isActive = panel.dataset.panel === tabId;
      panel.classList.toggle('lc-tabs__panel--active', isActive);

      if (isActive) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });

    this.emit('lc-tab-change', {
      tabs: this,
      activeTab: tabId
    });
  }

  /**
   * Get active tab
   * @returns {string}
   */
  getActiveTab() {
    return this.getAttr('active', '');
  }

  /**
   * Set active tab
   * @param {string} tabId
   */
  setActiveTab(tabId) {
    this.activateTab(tabId);
  }

  /**
   * Escape HTML
   * @param {string} str
   * @returns {string}
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  onAttributeChanged(name, oldValue, newValue) {
    if (name === 'active' && this._initialized && oldValue !== newValue) {
      this.activateTab(newValue);
    } else if (this._initialized && name !== 'active') {
      this.rerender();
    }
  }

  applyStyles() {
    if (document.getElementById('lc-tabs-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'lc-tabs-styles';
    style.textContent = `
      .lc-tabs {
        display: block;
      }

      /* Horizontal orientation */
      .lc-tabs--horizontal {
        display: flex;
        flex-direction: column;
      }

      /* Vertical orientation */
      .lc-tabs--vertical {
        display: flex;
        flex-direction: row;
        gap: var(--space-4);
      }

      /* Tab list */
      .lc-tabs__list {
        display: flex;
        gap: var(--space-1);
      }

      .lc-tabs--horizontal .lc-tabs__list {
        flex-direction: row;
        border-bottom: var(--tab-border-width) solid var(--tab-border);
      }

      .lc-tabs--vertical .lc-tabs__list {
        flex-direction: column;
        border-right: var(--tab-border-width) solid var(--tab-border);
        min-width: 200px;
      }

      /* Tab button */
      .lc-tabs__tab {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--tab-padding-y) var(--tab-padding-x);
        font-family: var(--font-family-sans);
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-medium);
        color: var(--tab-text);
        background: transparent;
        border: none;
        cursor: pointer;
        transition: all var(--transition-fast);
        white-space: nowrap;
        min-height: 44px; /* WCAG touch target */
      }

      .lc-tabs__tab:hover {
        color: var(--tab-active-text);
        background: var(--tab-hover-bg);
      }

      .lc-tabs__tab:focus-visible {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: -2px;
        z-index: 1;
      }

      .lc-tabs__tab--active {
        color: var(--tab-active-text);
        font-weight: var(--font-weight-semibold);
      }

      /* Line variant (default) */
      .lc-tabs--line.lc-tabs--horizontal .lc-tabs__tab--active::after {
        content: '';
        position: absolute;
        bottom: calc(var(--tab-border-width) * -1);
        left: 0;
        right: 0;
        height: var(--tab-border-width);
        background: var(--tab-active-border);
      }

      .lc-tabs--line.lc-tabs--vertical .lc-tabs__tab--active::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: calc(var(--tab-border-width) * -1);
        width: var(--tab-border-width);
        background: var(--tab-active-border);
      }

      /* Enclosed variant */
      .lc-tabs--enclosed .lc-tabs__tab {
        border: 1px solid transparent;
        border-radius: var(--radius-base) var(--radius-base) 0 0;
      }

      .lc-tabs--enclosed.lc-tabs--horizontal .lc-tabs__tab--active {
        border-color: var(--tab-border);
        border-bottom-color: var(--bg-surface);
        background: var(--bg-surface);
      }

      .lc-tabs--enclosed.lc-tabs--vertical .lc-tabs__list {
        border-right: none;
      }

      .lc-tabs--enclosed.lc-tabs--vertical .lc-tabs__tab {
        border-radius: var(--radius-base) 0 0 var(--radius-base);
      }

      .lc-tabs--enclosed.lc-tabs--vertical .lc-tabs__tab--active {
        border-color: var(--tab-border);
        border-right-color: var(--bg-surface);
        background: var(--bg-surface);
      }

      /* Pills variant */
      .lc-tabs--pills .lc-tabs__list {
        border: none;
      }

      .lc-tabs--pills .lc-tabs__tab {
        border-radius: var(--radius-full);
      }

      .lc-tabs--pills .lc-tabs__tab--active {
        background: var(--interactive-default);
        color: var(--text-on-primary);
      }

      .lc-tabs--pills .lc-tabs__tab--active:hover {
        background: var(--interactive-hover);
        color: var(--text-on-primary);
      }

      /* Panels */
      .lc-tabs__panels {
        flex: 1;
        min-height: 0;
      }

      .lc-tabs--horizontal .lc-tabs__panels {
        margin-top: var(--space-6);
      }

      .lc-tabs__panel {
        display: none;
      }

      .lc-tabs__panel--active {
        display: block;
      }

      .lc-tabs__panel:focus {
        outline: none;
      }

      /* Mobile responsive */
      @media (max-width: 640px) {
        .lc-tabs--horizontal .lc-tabs__list {
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .lc-tabs--horizontal .lc-tabs__list::-webkit-scrollbar {
          display: none;
        }

        .lc-tabs--vertical {
          flex-direction: column;
        }

        .lc-tabs--vertical .lc-tabs__list {
          flex-direction: row;
          border-right: none;
          border-bottom: var(--tab-border-width) solid var(--tab-border);
          min-width: auto;
        }

        .lc-tabs--vertical .lc-tabs__tab {
          flex: 1;
        }
      }

      /* Reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .lc-tabs__tab {
          transition: none;
        }
      }
    `;

    document.head.appendChild(style);
  }
}

customElements.define('lc-tabs', LCTabs);
export default LCTabs;
