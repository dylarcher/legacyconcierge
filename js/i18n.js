async function fetchTranslations(lang, page) {
    try {
        // Determine the base path for locale files based on directory depth
        const pathname = window.location.pathname;
        // Remove trailing slashes and split by /
        const pathParts = pathname.replace(/\/$/, '').split('/').filter(p => p);

        // Remove 'index.html' if present to get the actual directory depth
        let cleanParts = pathParts.filter(part => part !== 'index.html');

        // Calculate depth based on directory structure
        // Root: [] → 0, pages/about: ['pages', 'about'] → 2, pages/treatments/views/post-op: ['pages', 'treatments', 'views', 'post-op'] → 4
        let depth = cleanParts.length;

        // Build the correct relative path to _locale based on depth
        let localeBasePath;
        if (depth === 0) {
            localeBasePath = '_locale';
        } else {
            // Go up 'depth' directories, then into _locale
            localeBasePath = '../'.repeat(depth) + '_locale';
        }

        console.log('i18n: pathname:', pathname, '| depth:', depth, '| localeBasePath:', localeBasePath);

        const commonPromise = fetch(`${localeBasePath}/${lang}/common.json`)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to load common.json: ${res.status}`);
                return res.json();
            })
            .catch(err => {
                console.warn('Failed to load common.json:', err);
                return {};
            });

        // Determine which JSON file to load based on the page
        let pageFile;

        if (page.includes('/')) {
            // It's a full path (detail page)
            const pathParts = page.split('/');
            const fileName = pathParts[pathParts.length - 1];

            // Check if it's a treatment or expertise detail page
            if (pathParts.includes('treatments') && pathParts.includes('views')) {
                pageFile = 'treatments-detail';
            } else if (pathParts.includes('expertise') && pathParts.includes('views')) {
                pageFile = 'expertise-detail';
            } else {
                pageFile = fileName;
            }
        } else {
            // Simple page name - map 'index' to 'home', everything else stays as-is
            pageFile = page === 'index' ? 'home' : page;
        }

        console.log('i18n: loading page file:', pageFile);

        const pagePromise = fetch(`${localeBasePath}/${lang}/${pageFile}.json`)
            .then(res => {
                if (!res.ok) throw new Error(`Failed to load ${pageFile}.json: ${res.status}`);
                return res.json();
            })
            .catch(err => {
                console.warn(`Failed to load ${pageFile}.json:`, err);
                return {};
            });
        const [common, pageContent] = await Promise.all([commonPromise, pagePromise]);

        return { ...common, ...pageContent };
    } catch (error) {
        console.error('Error fetching translation files:', error);
        return {};
    }
}

function getNestedTranslation(obj, key) {
    return key.split('.').reduce((acc, part) => {
        if (!acc) return acc;

        // Handle array bracket notation: columns[0]
        const arrayMatch = part.match(/^(.+?)\[(\d+)\]$/);
        if (arrayMatch) {
            const [, prop, index] = arrayMatch;
            return acc[prop] && acc[prop][parseInt(index)];
        }

        return acc[part];
    }, obj);
}

function updateMetaTags(translations, pageKey) {
    if (!translations[pageKey]) return;
    
    const pageData = translations[pageKey];
    
    // Update title
    if (pageData.title) {
        document.title = `${pageData.title} - Legacy Concierge`;
    }
    
    // Update meta description
    if (pageData.subtitle) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', pageData.subtitle);
        }
    }
    
    // Update Open Graph tags
    if (pageData.title) {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', `${pageData.title} - Legacy Concierge`);
        }
        
        const twitterTitle = document.querySelector('meta[property="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.setAttribute('content', `${pageData.title} - Legacy Concierge`);
        }
    }
    
    if (pageData.subtitle) {
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
            ogDesc.setAttribute('content', pageData.subtitle);
        }
        
        const twitterDesc = document.querySelector('meta[property="twitter:description"]');
        if (twitterDesc) {
            twitterDesc.setAttribute('content', pageData.subtitle);
        }
    }
}

async function applyTranslations() {
    const lang = document.documentElement.lang || 'en';
    const path = window.location.pathname;
    const pathParts = path.replace(/\/$/, '').split('/').filter(p => p);

    // Determine the page identifier for fetching translations
    let page;

    // If it's the root index.html or just /
    if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === 'index.html')) {
        page = 'index';
    }
    // If it's a detail page in treatments or expertise
    else if (path.includes('/treatments/views/') || path.includes('/expertise/views/')) {
        page = path; // Pass full path for detail pages
    }
    // For other pages, use the directory name (e.g., /pages/about/ → 'about')
    else {
        // Get the last meaningful directory name (not 'index.html')
        const lastPart = pathParts[pathParts.length - 1];
        page = lastPart === 'index.html' ? pathParts[pathParts.length - 2] : lastPart.replace('.html', '');
    }

    console.log('applyTranslations: path:', path, '| page:', page);

    const translations = await fetchTranslations(lang, page);
    
    // Update meta tags for detail pages
    if (path.includes('/treatments/') && translations[fileName]) {
        updateMetaTags(translations, fileName);
    } else if (path.includes('/expertise/') && translations[fileName]) {
        updateMetaTags(translations, fileName);
    }

    // Apply translations to elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations, key);
        if (translation) {
            if (Array.isArray(translation)) {
                // Handle arrays (like features lists)
                if (element.tagName === 'UL') {
                    element.innerHTML = translation.map(item => `<li>${item}</li>`).join('');
                } else {
                    element.innerHTML = translation.join('<br>');
                }
            } else {
                // Use textContent for links to preserve accessibility, innerHTML for formatted text
                if (element.tagName === 'A' && !translation.includes('<')) {
                    element.textContent = translation;
                } else {
                    element.innerHTML = translation;
                }
            }
        }
    });

    // Handle special attributes (aria-label, title, alt, etc.)
    document.querySelectorAll('[data-i18n-attr]').forEach(element => {
        const attrData = element.getAttribute('data-i18n-attr');
        const [attr, key] = attrData.split(':');
        const translation = getNestedTranslation(translations, key);
        if (translation) {
            element.setAttribute(attr, translation);
        }
    });
}

// Language switcher functionality
function switchLanguage(lang) {
    document.documentElement.lang = lang;
    
    // Store language preference
    localStorage.setItem('preferred-language', lang);
    
    // Reload translations
    applyTranslations();
}

// Initialize language from localStorage or browser preference
function initializeLanguage() {
    const savedLang = localStorage.getItem('preferred-language');
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'es'];
    
    let lang = 'en'; // default
    if (savedLang && supportedLangs.includes(savedLang)) {
        lang = savedLang;
    } else if (supportedLangs.includes(browserLang)) {
        lang = browserLang;
    }
    
    document.documentElement.lang = lang;
}

document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    applyTranslations();

    // Language toggle functionality
    const languageToggle = document.querySelector('.language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', () => {
            const currentLang = document.documentElement.lang;
            const newLang = currentLang === 'en' ? 'es' : 'en';
            switchLanguage(newLang);
        });
    }
});
