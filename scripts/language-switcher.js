/**
 * Language Switcher Component for Legacy Concierge
 * Provides UI for switching between supported languages
 */

class LanguageSwitcher {
  constructor(container) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.supportedLanguages = [
      { code: "en", name: "English", flag: "🇺🇸" },
      { code: "es", name: "Español", flag: "🇪🇸" },
    ];
    this.currentLanguage = document.documentElement.lang || "en";
    this.init();
  }

  init() {
    if (!this.container) {
      console.error("Language switcher container not found");
      return;
    }
    this.render();
    this.bindEvents();
  }

  render() {
    const dropdown = document.createElement("div");
    dropdown.className = "language-switcher";
    dropdown.innerHTML = `
            <div class="language-current" role="button" tabindex="0" aria-label="Language selector">
                <span class="flag">${this.getCurrentLanguage().flag}</span>
                <span class="name">${this.getCurrentLanguage().name}</span>
                <span class="arrow">▼</span>
            </div>
            <ul class="language-options" role="menu">
                ${this.supportedLanguages
                  .map(
                    (lang) => `
                    <li role="menuitem" 
                        data-lang="${lang.code}" 
                        class="${lang.code === this.currentLanguage ? "active" : ""}"
                        tabindex="0">
                        <span class="flag">${lang.flag}</span>
                        <span class="name">${lang.name}</span>
                    </li>
                `,
                  )
                  .join("")}
            </ul>
        `;

    this.container.appendChild(dropdown);
    this.addStyles();
  }

  addStyles() {
    if (document.getElementById("language-switcher-styles")) return;

    const styles = document.createElement("style");
    styles.id = "language-switcher-styles";
    styles.textContent = `
            .language-switcher {
                position: relative;
                display: inline-block;
                font-family: inherit;
            }

            .language-current {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                cursor: pointer;
                color: white;
                font-size: 0.9rem;
                transition: all 0.3s ease;
            }

            .language-current:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .language-current .arrow {
                transition: transform 0.3s ease;
                font-size: 0.8rem;
            }

            .language-switcher.open .arrow {
                transform: rotate(180deg);
            }

            .language-options {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                list-style: none;
                margin: 0;
                padding: 0;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
            }

            .language-switcher.open .language-options {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .language-options li {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                cursor: pointer;
                color: #333;
                transition: background-color 0.2s ease;
            }

            .language-options li:hover {
                background-color: #f5f5f5;
            }

            .language-options li.active {
                background-color: #e3f2fd;
                color: #1976d2;
            }

            .language-options li:first-child {
                border-radius: 4px 4px 0 0;
            }

            .language-options li:last-child {
                border-radius: 0 0 4px 4px;
            }

            .flag {
                font-size: 1.2em;
            }

            @media (max-width: 768px) {
                .language-current .name {
                    display: none;
                }
                
                .language-current {
                    padding: 0.5rem;
                }
            }
        `;

    document.head.appendChild(styles);
  }

  bindEvents() {
    const current = this.container.querySelector(".language-current");
    const options = this.container.querySelector(".language-options");
    const switcher = this.container.querySelector(".language-switcher");

    // Toggle dropdown
    current.addEventListener("click", () => {
      switcher?.classList.toggle("open");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!switcher.contains(e.target)) {
        switcher?.classList.remove("open");
      }
    });

    // Handle language selection
    options.addEventListener("click", (e) => {
      const li = e.target.closest("li[data-lang]");
      if (li) {
        const newLang = li.dataset.lang;
        this.switchLanguage(newLang);
        switcher?.classList.remove("open");
      }
    });

    // Keyboard navigation
    current.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        switcher?.classList.toggle("open");
      }
    });

    options.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const li = e.target.closest("li[data-lang]");
        if (li) {
          e.preventDefault();
          const newLang = li.dataset.lang;
          this.switchLanguage(newLang);
          switcher?.classList.remove("open");
        }
      }
    });
  }

  getCurrentLanguage() {
    return (
      this.supportedLanguages.find(
        (lang) => lang.code === this.currentLanguage,
      ) || this.supportedLanguages[0]
    );
  }

  switchLanguage(langCode) {
    if (langCode === this.currentLanguage) return;

    this.currentLanguage = langCode;
    document.documentElement.lang = langCode;

    // Store language preference
    try {
      localStorage.setItem("preferred-language", langCode);
    } catch (e) {
      console.warn("Could not save language preference:", e);
    }

    // Update current language display
    const current = this.container.querySelector(".language-current");
    const newLang = this.getCurrentLanguage();
    current.querySelector(".flag").textContent = newLang.flag;
    current.querySelector(".name").textContent = newLang.name;

    // Update active state
    for (const li of this.container.querySelectorAll(".language-options li")) {
      li?.classList.toggle("active", li.dataset.lang === langCode);
    }

    // Trigger translation reload if i18n system is available
    if (window.applyTranslations) {
      window.applyTranslations();
    }

    // Fire custom event for other components to listen to
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: langCode },
      }),
    );
  }
}

// Auto-initialize if container exists
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".language-switcher-container");
  if (container) {
    new LanguageSwitcher(container);
  }
});

// Export for manual initialization
window.LanguageSwitcher = LanguageSwitcher;
