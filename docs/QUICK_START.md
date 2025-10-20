# Quick Start Guide - Web Components

Get up and running with Legacy Concierge Web Components in 5 minutes.

## 🚀 Immediate Next Steps

### 1. Test the Example Page

```bash
# Start local server (from project root)
npm run dev

# Open in browser
http://localhost:8000/components/EXAMPLE.html
```

You should see a fully functional page with:

- Navigation component
- Card grids
- Service cards
- Testimonial cards
- Bento grid layout

### 2. Test the Video Homepage

```bash
http://localhost:8000/layouts/homepage-video.html
```

**Note:** You'll need to add a video file at `/assets/videos/hero-nursing-care.mp4` or it will show a fallback.

### 3. Convert an Existing Page

Let's convert the homepage as an example:

**Step 1:** Backup current homepage

```bash
cp index.html index.html.backup
```

**Step 2:** Update index.html header

**Remove** the entire `<header>` section (lines ~32-98)

**Replace with:**

```html
<lc-header></lc-header>
```

**Step 3:** Update card section

**Find** the info cards section (~line 116)

**Replace:**

```html
<section id="info-cards" class="container fade-in">
    <div class="card">...</div>
    <div class="card">...</div>
    <div class="card">...</div>
    <div class="card">...</div>
</section>
```

**With:**

```html
<section id="info-cards" class="container">
    <lc-card-grid columns="4" gap="2rem">
        <lc-card variant="info" animated>
            <h4 slot="title" data-i18n="infoCards[0].title"></h4>
            <p data-i18n="infoCards[0].text"></p>
        </lc-card>

        <lc-card variant="info" animated>
            <h4 slot="title" data-i18n="infoCards[1].title"></h4>
            <p data-i18n="infoCards[1].text"></p>
        </lc-card>

        <lc-card variant="info" animated>
            <h4 slot="title" data-i18n="infoCards[2].title"></h4>
            <p data-i18n="infoCards[2].text"></p>
        </lc-card>

        <lc-card variant="info" animated>
            <h4 slot="title" data-i18n="infoCards[3].title"></h4>
            <p data-i18n="infoCards[3].text"></p>
        </lc-card>
    </lc-card-grid>
</section>
```

**Step 4:** Update footer

**Remove** footer section

**Replace with:**

```html
<lc-footer></lc-footer>
```

**Step 5:** Add component loading

**In `<head>`, before closing tag, add:**

```html
<script type="module">
    import { initializeComponents } from '/script/core/component-loader.js';

    document.addEventListener('DOMContentLoaded', async () => {
        await initializeComponents(['navigation', 'cards']);
    });
</script>
```

**Step 6:** Load component scripts

**Before closing `</body>`, add:**

```html
<script type="module" src="/components/scripts/lc-header.js"></script>
<script type="module" src="/components/scripts/lc-footer.js"></script>
<script type="module" src="/components/scripts/lc-card.js"></script>
```

**Step 7:** Test!

```bash
# Refresh browser
http://localhost:8000/
```

Your homepage now uses components! The header, footer, and cards are all reusable.

## 🎯 What You've Accomplished

- ✅ Reduced homepage from ~250 lines to ~150 lines
- ✅ Header is now reusable across all pages
- ✅ Footer is centralized
- ✅ Cards use consistent markup
- ✅ One update to header template = all pages update

## 📝 Create a New Page

Let's create a simple "About" page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - Legacy Concierge</title>

    <link rel="stylesheet" href="/style/style.css">

    <script type="module">
        import { initializeComponents } from '/script/core/component-loader.js';
        document.addEventListener('DOMContentLoaded', async () => {
            await initializeComponents(['navigation']);
        });
    </script>

    <script src="/script/theme.js"></script>
    <script src="/script/i18n.js"></script>
</head>

<body itemscope itemtype="http://schema.org/AboutPage">

    <a href="#main" class="skip-link" data-i18n="accessibility.skipToMain"></a>

    <!-- One-line header -->
    <lc-header solid></lc-header>

    <main role="main" id="main">
        <section class="container">
            <h1>About Legacy Concierge</h1>
            <p>We provide compassionate, expert nursing care...</p>
        </section>
    </main>

    <!-- One-line footer -->
    <lc-footer></lc-footer>

    <script type="module" src="/components/scripts/lc-header.js"></script>
    <script type="module" src="/components/scripts/lc-footer.js"></script>

</body>
</html>
```

Save as `pages/about/index-new.html` and test!

## 🧪 Quick Tests

### Test 1: Component Loading

Open browser console and type:

```javascript
ComponentLoader.loadTemplate('navigation').then(() => {
    console.log('Navigation template loaded!');
});
```

You should see: `✓ Template loaded: navigation`

### Test 2: Create Card Dynamically

```javascript
const card = document.createElement('lc-card');
card.setAttribute('variant', 'info');
card.setAttribute('animated', '');
card.innerHTML = `
    <h4 slot="title">Dynamic Card</h4>
    <p>This card was created with JavaScript!</p>
`;
document.body.appendChild(card);
```

### Test 3: Helper Functions

```javascript
// Test sanitization
LCHelpers.sanitizeHTML('<script>alert("XSS")</script>Hello');
// Should output: "&lt;script&gt;alert("XSS")&lt;/script&gt;Hello"

// Test date formatting
LCHelpers.formatDate(new Date());
// Should output: "October 19, 2025" (or current date)

// Test theme detection
LCHelpers.getCurrentTheme();
// Should output: "light" or "dark"
```

## 🔧 Troubleshooting

### Components Not Showing

**Problem:** Page is blank or components missing

**Solution:**

1. Check browser console for errors
2. Ensure server is running (`npm run dev`)
3. Verify you're accessing via `http://localhost:8000` not `file://`
4. Check template files exist in `/components/templates/`

### Scripts Not Loading

**Problem:** `Failed to load module`

**Solution:**

1. Ensure scripts use `type="module"`
2. Verify file paths are correct (relative to server root)
3. Check for typos in file names

### Translations Not Working

**Problem:** `data-i18n` attributes not translating

**Solution:**

1. Load components first, then apply translations:

    ```javascript
    await initializeComponents(['navigation']);
    // Then i18n loads via existing script
    ```

2. Or manually apply:

    ```javascript
    await initializeComponents(['navigation']);
    if (window.applyTranslations) {
        await window.applyTranslations();
    }
    ```

### Styles Not Applied

**Problem:** Components look unstyled

**Solution:**

1. Ensure `/style/style.css` is loaded
2. Components use Light DOM, so check global CSS
3. Verify class names match between templates and CSS

## 📚 Next Steps

1. **Read** `components/README.md` - Full component documentation
2. **Review** `WEB_COMPONENTS_SUMMARY.md` - Complete overview
3. **Explore** `components/EXAMPLE.html` - See all components in action
4. **Try** `layouts/homepage-video.html` - Full layout example
5. **Start** converting existing pages one by one

## 💡 Pro Tips

1. **Copy Examples**: Start with `EXAMPLE.html` as a template
2. **Test Incrementally**: Convert one section at a time
3. **Use DevTools**: Inspect elements to see component structure
4. **Check Console**: Component loader logs helpful messages
5. **Keep Backups**: Copy files before major changes

## 🎓 Learn More

### Component Documentation

- `components/README.md` - Comprehensive guide
- Each template file has inline comments
- Each script file has JSDoc comments

### MDN Resources

- [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
- [HTML Templates](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
- [ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

## 🚀 You're Ready

You now have:

- ✅ Working component system
- ✅ Reusable header & footer
- ✅ Flexible card components
- ✅ Grid layouts (responsive & masonry)
- ✅ Complete documentation
- ✅ Working examples
- ✅ Core utilities

Start converting pages and enjoy the benefits of reusable components!

---

**Need Help?**

- Check `components/README.md` for detailed docs
- Review example files for working code
- Open browser console to see component loader logs
