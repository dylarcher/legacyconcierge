# Accessibility Documentation

## Overview
Legacy Concierge is built to meet **WCAG 2.2 Level AAA** accessibility standards, ensuring our healthcare services are accessible to all users, including those with disabilities.

## Table of Contents
1. [Accessibility Features](#accessibility-features)
2. [Screen Reader Support](#screen-reader-support)
3. [Keyboard Navigation](#keyboard-navigation)
4. [Focus Management](#focus-management)
5. [Motion Preferences](#motion-preferences)
6. [High Contrast Support](#high-contrast-support)
7. [Form Accessibility](#form-accessibility)
8. [Color Contrast](#color-contrast)
9. [Text Spacing](#text-spacing)
10. [Testing Accessibility](#testing-accessibility)
11. [Developer Guidelines](#developer-guidelines)

---

## Accessibility Features

### Comprehensive WCAG 2.2 AAA Compliance

#### Perceivable
- ✅ **Text Alternatives**: All images have descriptive alt text
- ✅ **Captions**: Videos include captions and transcripts
- ✅ **Adaptable**: Content works in different presentations
- ✅ **Distinguishable**: 7:1 color contrast ratio (AAA standard)
- ✅ **Reflow**: Content adapts to 400% zoom without horizontal scrolling

#### Operable
- ✅ **Keyboard Accessible**: All functionality available via keyboard
- ✅ **Enough Time**: No time limits on reading content
- ✅ **No Seizures**: No flashing content that could trigger seizures
- ✅ **Navigable**: Multiple ways to find content, skip links
- ✅ **Input Modalities**: Touch targets at least 44x44 CSS pixels

#### Understandable
- ✅ **Readable**: Plain language, reading level appropriate
- ✅ **Predictable**: Consistent navigation and functionality
- ✅ **Input Assistance**: Error identification and suggestions

#### Robust
- ✅ **Compatible**: Valid HTML5, ARIA attributes where needed
- ✅ **Future-proof**: Works with current and future assistive technologies

---

## Screen Reader Support

### Screen Reader Announcements

The `AccessibilityManager` provides a centralized way to announce dynamic content changes to screen readers:

```javascript
// Polite announcement (won't interrupt)
window.announce('Page content has been updated');

// Assertive announcement (interrupts current announcement)
window.announce('Error: Please correct the form', 'assertive');
```

### Usage Examples

#### Dynamic Content Loading
```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    updateContent(data);
    window.announce('New content has been loaded');
  });
```

#### Form Validation
```javascript
form.addEventListener('submit', (e) => {
  if (!isValid()) {
    e.preventDefault();
    window.announce('There are 3 errors in the form. Please review and correct them.', 'assertive');
  }
});
```

#### Search Results
```javascript
function displaySearchResults(results) {
  renderResults(results);
  window.announce(`Found ${results.length} results for your search`);
}
```

### Screen Reader Only Content

Use the `.sr-only` class for content that should only be available to screen readers:

```html
<button aria-label="Close dialog">
  <span class="sr-only">Close</span>
  <svg aria-hidden="true"><!-- X icon --></svg>
</button>
```

---

## Keyboard Navigation

### Global Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search field |
| `h` | Skip to header |
| `m` | Skip to main content |
| `f` | Skip to footer |
| `Esc` | Close overlays (modals, dropdowns) |
| `Tab` | Move to next focusable element |
| `Shift+Tab` | Move to previous focusable element |
| `Enter` or `Space` | Activate buttons and links |
| `Arrow Keys` | Navigate within components (tabs, sliders) |

### Component-Specific Shortcuts

#### Modal Dialogs
- `Tab` / `Shift+Tab`: Navigate between elements within modal
- `Esc`: Close modal and return focus to trigger element

#### Tabs
- `Arrow Left` / `Arrow Right`: Move between tabs
- `Home`: Jump to first tab
- `End`: Jump to last tab
- `Tab`: Move focus into tab panel

#### Accordion
- `Arrow Up` / `Arrow Down`: Move between accordion headers
- `Enter` or `Space`: Expand/collapse accordion panel
- `Home`: Jump to first accordion item
- `End`: Jump to last accordion item

#### Dropdown
- `Arrow Down`: Open dropdown and focus first item
- `Arrow Up` / `Arrow Down`: Navigate dropdown items
- `Enter`: Select item and close dropdown
- `Esc`: Close dropdown without selecting

### Implementing Keyboard Support

```javascript
// Example: Custom component with keyboard support
class MyComponent extends HTMLElement {
  connectedCallback() {
    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '0');

    this.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleActivation();
      }
    });
  }
}
```

---

## Focus Management

### Focus Indicators

All interactive elements have visible focus indicators that meet AAA standards:
- **3px** solid outline
- **2px** offset from element
- **Additional shadow** for increased visibility
- **High contrast** against all backgrounds

### Focus Trap (for Modals)

When a modal opens, focus is trapped within the modal:

```javascript
// Automatically handled by AccessibilityManager
document.dispatchEvent(new CustomEvent('modal:open', {
  detail: { element: modalElement }
}));

// Focus returns to trigger when modal closes
document.dispatchEvent(new CustomEvent('modal:close'));
```

### Manual Focus Management

```javascript
// Focus first element in container
window.accessibilityManager.focusFirstElement(container);

// Get all focusable elements
const focusable = window.accessibilityManager.getFocusableElements(container);
```

### Skip Links

Skip links allow keyboard users to bypass repetitive content:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>

<main id="main-content" tabindex="-1">
  <!-- Main content -->
</main>
```

---

## Motion Preferences

### Respecting User Preferences

The system automatically detects and respects the `prefers-reduced-motion` preference:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### JavaScript Detection

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  // Safe to animate
  element.classList.add('animated');
}
```

### Opt-In Animations

Always make animations opt-in rather than opt-out:

```javascript
// Good: Animation only if user hasn't requested reduced motion
if (!document.documentElement.hasAttribute('data-motion', 'reduced')) {
  element.animate([...keyframes], options);
}

// Bad: Animation always runs
element.animate([...keyframes], options);
```

---

## High Contrast Support

### Automatic Detection

The system detects and adapts to high contrast mode:

```css
@media (prefers-contrast: high) {
  :root {
    --border-width: 2px;
    --outline-width: 3px;
  }

  button, input {
    border-width: 2px;
  }
}
```

### Best Practices

1. **Use Borders**: Rely on borders rather than box-shadows
2. **Increase Thickness**: Make borders and outlines thicker
3. **Remove Subtlety**: Avoid subtle backgrounds or gradients
4. **High Contrast**: Ensure all elements are distinguishable

---

## Form Accessibility

### Error Handling

Forms include comprehensive error handling:

```html
<div class="form-field" id="email-field">
  <label for="email">
    Email Address <span class="required">*</span>
  </label>
  <input
    type="email"
    id="email"
    name="email"
    required
    aria-required="true"
    aria-describedby="email-error"
    aria-invalid="false"
  >
  <span id="email-error" class="form-error-message" role="alert">
    <!-- Error message appears here -->
  </span>
</div>
```

### Error Summary

When validation fails, an error summary appears at the top of the form:

```html
<div class="form-error-summary" role="alert" aria-atomic="true">
  <h2>Please correct the following errors:</h2>
  <ul>
    <li><a href="#email">Email: Please enter a valid email address</a></li>
    <li><a href="#phone">Phone: Please enter a 10-digit phone number</a></li>
  </ul>
</div>
```

### Progressive Validation

Forms validate progressively as users complete fields:

```javascript
// Automatic validation through AccessibilityManager
// Announces errors and success to screen readers
input.addEventListener('invalid', () => {
  window.announce(input.validationMessage, 'assertive');
});

input.addEventListener('change', () => {
  if (input.validity.valid) {
    window.announce(`${label} is now valid`);
  }
});
```

### Required Fields

Required fields are clearly marked:

```html
<label for="name">
  Full Name <span class="required">*</span>
</label>
<input id="name" required aria-required="true">
```

---

## Color Contrast

### AAA Standards (7:1 Minimum)

All text meets WCAG 2.2 Level AAA color contrast requirements:

| Element Type | Contrast Ratio | Example |
|--------------|----------------|---------|
| Body text | 7:1 or greater | `#1f2937` on `#ffffff` |
| Large text (18pt+) | 4.5:1 or greater | `#4b5563` on `#ffffff` |
| UI components | 3:1 or greater | `#2563eb` on `#ffffff` |
| Focus indicators | 3:1 or greater | `#2563eb` outline |

### Testing Contrast

Use browser DevTools or online tools:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools (Inspect → Accessibility pane)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

### Color-Blind Safe Palette

Our color palette is safe for all types of color blindness:
- ✅ Deuteranopia (red-green)
- ✅ Protanopia (red-green)
- ✅ Tritanopia (blue-yellow)
- ✅ Achromatopsia (total)

**Never rely on color alone** to convey information. Always include text labels, icons, or patterns.

---

## Text Spacing

### User Customization Support

Content adapts when users override text spacing (WCAG 2.2 SC 1.4.12):

```css
[data-user-spacing="true"] {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}

[data-user-spacing="true"] p {
  margin-bottom: 2em !important;
}
```

### Best Practices

1. **Relative Units**: Use `em` or `rem` instead of `px`
2. **Flexible Containers**: Use `min-width` instead of fixed `width`
3. **Overflow Handling**: Set `overflow-wrap: break-word`
4. **Line Height**: Minimum 1.5× font size
5. **Paragraph Spacing**: Minimum 2× font size

---

## Testing Accessibility

### Automated Testing

#### Browser Extensions
- **axe DevTools** (Chrome/Firefox)
- **WAVE** (Chrome/Firefox)
- **Lighthouse** (Chrome DevTools)

#### Command Line
```bash
# Install Pa11y
npm install -g pa11y

# Run accessibility audit
pa11y http://localhost:3000

# Generate report
pa11y-ci
```

### Manual Testing

#### Keyboard Testing
1. Disconnect mouse
2. Navigate site using only keyboard
3. Verify all functionality is accessible
4. Check focus indicators are visible
5. Test skip links work correctly

#### Screen Reader Testing

**macOS** (VoiceOver)
```
Cmd + F5: Toggle VoiceOver
Ctrl + Option + Arrow Keys: Navigate
Ctrl + Option + Space: Activate
```

**Windows** (NVDA - Free)
```
Ctrl + Alt + N: Start NVDA
Arrow Keys: Navigate
Enter: Activate
```

**Windows** (JAWS - Paid)
```
Insert + F1: JAWS Help
Arrow Keys: Navigate
Enter: Activate
```

#### Zoom Testing
1. Zoom to 200%: Verify layout doesn't break
2. Zoom to 400%: Verify content is readable
3. Check horizontal scrolling is not required

#### Color Contrast Testing
1. Use DevTools color picker
2. Check contrast ratios
3. Test with grayscale filter
4. Test with color-blind simulators

### Testing Checklist

#### Perceivable
- [ ] All images have alt text
- [ ] Videos have captions
- [ ] Color contrast meets 7:1 (AAA)
- [ ] Content works at 400% zoom
- [ ] Text resizes without breaking layout

#### Operable
- [ ] All functionality keyboard accessible
- [ ] Focus indicators visible
- [ ] No keyboard traps
- [ ] Skip links work
- [ ] Touch targets at least 44x44px

#### Understandable
- [ ] Error messages are clear
- [ ] Navigation is consistent
- [ ] Labels and instructions provided
- [ ] Language is declared
- [ ] No unexpected context changes

#### Robust
- [ ] Valid HTML5
- [ ] ARIA used correctly
- [ ] Works with screen readers
- [ ] No console errors
- [ ] Progressive enhancement works

---

## Developer Guidelines

### HTML Guidelines

#### Use Semantic HTML
```html
<!-- Good -->
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Heading</h1>
    <p>Content</p>
  </article>
</main>
<footer>
  <!-- Footer content -->
</footer>

<!-- Bad -->
<div class="header">
  <div class="nav">
    <div class="link-container">
      <div class="link">Home</div>
    </div>
  </div>
</div>
```

#### Heading Hierarchy
```html
<!-- Good: Logical hierarchy -->
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Section</h2>

<!-- Bad: Skipping levels -->
<h1>Page Title</h1>
  <h3>Section</h3>
  <h5>Subsection</h5>
```

#### Form Labels
```html
<!-- Good: Explicit label -->
<label for="email">Email</label>
<input type="email" id="email" name="email">

<!-- Bad: No label -->
<input type="email" placeholder="Email">
```

### ARIA Guidelines

#### Use ARIA Sparingly
```html
<!-- Good: Native HTML is accessible -->
<button>Click Me</button>

<!-- Bad: Unnecessary ARIA -->
<div role="button" tabindex="0" aria-pressed="false">Click Me</div>
```

#### Required ARIA Patterns
```html
<!-- Modal Dialog -->
<div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
  <h2 id="dialog-title">Dialog Title</h2>
</div>

<!-- Alert -->
<div role="alert">Important message</div>

<!-- Live Region -->
<div aria-live="polite" aria-atomic="true">
  <!-- Dynamic content -->
</div>
```

### JavaScript Guidelines

#### Keyboard Support
```javascript
element.addEventListener('click', handleClick);
element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
});
```

#### Focus Management
```javascript
// Announce changes
window.announce('Content updated');

// Manage focus for dynamic content
const newElement = document.createElement('div');
document.body.appendChild(newElement);
newElement.focus();

// Return focus after operation
const previousFocus = document.activeElement;
// ... do something ...
previousFocus.focus();
```

#### Respect User Preferences
```javascript
// Motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Contrast
const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

// Color Scheme
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

### CSS Guidelines

#### Focus Styles
```css
/* Always provide visible focus */
:focus {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}

/* Never remove focus without replacement */
:focus {
  outline: none; /* BAD */
}
```

#### Touch Targets
```css
/* Minimum 44x44 CSS pixels */
button {
  min-width: 44px;
  min-height: 44px;
  padding: 0.75rem 1rem;
}
```

#### Responsive Units
```css
/* Good: Relative units */
.text {
  font-size: 1rem;
  line-height: 1.5;
  margin: 1em 0;
}

/* Bad: Fixed units */
.text {
  font-size: 16px;
  line-height: 24px;
  margin: 16px 0;
}
```

---

## Resources

### WCAG 2.2 Documentation
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [How to Meet WCAG (Quick Reference)](https://www.w3.org/WAI/WCAG22/quickref/)

### ARIA Resources
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [ARIA Roles](https://www.w3.org/TR/wai-aria-1.2/#role_definitions)
- [ARIA States and Properties](https://www.w3.org/TR/wai-aria-1.2/#state_prop_def)

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Pa11y](https://pa11y.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Screen Readers
- [NVDA (Free)](https://www.nvaccess.org/)
- [JAWS (Paid)](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (Built-in macOS/iOS)](https://www.apple.com/accessibility/voiceover/)

---

## Support

For accessibility questions or to report accessibility issues:

**Email**: accessibility@legacyconcierge.com
**Phone**: +1 (305) 555-0100

We are committed to maintaining the highest standards of accessibility and welcome feedback on how we can improve.
