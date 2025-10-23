# Contributing Guide

Thanks for your interest in contributing to Legacy Concierge! We welcome contributions that improve accessibility, performance, internationalization, and overall quality.

Please read this document before opening an issue or pull request.

## Development Setup

This is a static site—no build step is required.

```bash
# Start a local server (choose one)
python3 -m http.server 8000
# or
npx http-server -p 8000
```

Open <http://localhost:8000>.

## Code Style & Tools

- We use [Biome](https://biomejs.dev) for formatting and linting
- 2-space indentation, ~80 character line width (see `configs/biome.json`)
- Prefer semantic HTML, ARIA where appropriate, and WCAG 2.2 AA compliance

Common commands:

```bash
npx @biomejs/biome format --write .
npx @biomejs/biome lint .
npx @biomejs/biome check .
```

## Branching & Commits

- Branch naming: `feat/…`, `fix/…`, `docs/…`, `chore/…`
- Use clear, descriptive commit messages (Conventional Commits are encouraged)

## Pull Requests

Before submitting a PR:

- Ensure all user-facing text is translatable (i18n keys and translations)
- Verify accessibility (keyboard navigation, focus order, ARIA, color contrast)
- Run Biome checks locally and fix issues
- Update documentation (README/docs) for new or changed behavior
- Include screenshots/video for visual changes when possible

See the [Pull Request Template](./PULL_REQUEST_TEMPLATE.md) for the checklist.

## Issue Reports

- Use the appropriate issue template (Bug, Feature, Documentation)
- Provide steps to reproduce, expected/actual behavior, and environment details

## License

By contributing, you agree that your contributions will be licensed under the
[ISC License](../LICENSE).

## Code of Conduct

Please follow our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.
