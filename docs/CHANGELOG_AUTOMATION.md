# CHANGELOG Automation

This project uses automated changelog generation based on commit history and conventional commits.

## How It Works

### Automatic Generation (PR Workflow)

When you open a pull request, the GitHub Action workflow (`.github/workflows/changelog.yml`) automatically:

1. **Analyzes Commits**: Extracts commits between the base branch and your PR branch
2. **Categorizes Changes**: Groups commits by type (Added, Fixed, Changed, etc.)
3. **Updates CHANGELOG.md**: Generates formatted entries following [Keep a Changelog](https://keepachangelog.com/) format
4. **Commits & Comments**: Pushes the updated CHANGELOG to your PR and adds a comment with a preview

### Manual Generation

You can also generate changelog entries manually:

```bash
# Generate changelog from last tag/main to HEAD
npm run changelog

# Preview changes without modifying CHANGELOG.md
npm run changelog:dry-run

# Generate changelog between specific refs
node scripts/generate-changelog.js --from v1.0.0 --to HEAD
```

## Conventional Commits

For best results, follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```text
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Supported Types

| Type       | Category      | Description                                    |
|------------|---------------|------------------------------------------------|
| `feat`     | Added         | New features                                   |
| `fix`      | Fixed         | Bug fixes                                      |
| `docs`     | Documentation | Documentation changes                          |
| `style`    | Changed       | Code style/formatting (no functional changes)  |
| `refactor` | Changed       | Code refactoring                               |
| `perf`     | Performance   | Performance improvements                       |
| `test`     | Tests         | Test additions or modifications                |
| `build`    | Build         | Build system or dependency changes             |
| `ci`       | CI/CD         | CI/CD configuration changes                    |
| `chore`    | Maintenance   | Maintenance tasks                              |
| `revert`   | Reverted      | Revert previous changes                        |
| `security` | Security      | Security fixes                                 |
| `deps`     | Dependencies  | Dependency updates                             |

### Examples

```bash
# Feature addition
feat(auth): add OAuth2 authentication

# Bug fix with scope
fix(forms): resolve validation error on empty input

# Breaking change
feat(api)!: redesign REST API endpoints

BREAKING CHANGE: API endpoints now use v2 prefix
```

## Breaking Changes

Mark breaking changes using either:

- `!` after the type/scope: `feat!: major API change`
- `BREAKING CHANGE:` in the commit footer

Breaking changes appear in a special section at the top of changelog entries.

## Workflow Configuration

The changelog workflow runs on:

- Pull requests opened against `main` or `develop`
- Subsequent commits pushed to an open PR
- PR synchronization (rebase, force push, etc.)

### Permissions

The workflow requires:

- `contents: write` - To commit CHANGELOG.md updates
- `pull-requests: write` - To comment on PRs

## Troubleshooting

### No changelog entries generated

This can happen if:

- No commits exist between base and head refs
- Commits don't follow conventional commit format
- CHANGELOG.md is already up to date

### Commit format not recognized

Ensure commits follow the pattern: `type(scope): subject`

- Type is required (e.g., `feat`, `fix`)
- Scope is optional (e.g., `(auth)`, `(forms)`)
- Colon `:` is required after type/scope

### Manual fixes

If you need to manually edit the CHANGELOG:

1. Make your changes to `CHANGELOG.md`
2. Commit with: `docs: update CHANGELOG.md [skip ci]`
3. The `[skip ci]` prevents infinite workflow loops

## Integration with Release Process

When creating a new release:

1. The `[Unreleased]` section contains all changes since the last release
2. Create a new version section with the release version and date
3. Move entries from `[Unreleased]` to the new version section
4. Leave `[Unreleased]` empty or with "TBD" placeholder

Example:

```markdown
## [Unreleased]

> _TBD_

## [1.2.0] - 2025-10-28

### Added
- feat: new authentication system
- feat(api): add user profile endpoints

### Fixed
- fix: resolve login redirect issue
```

## Scripts Reference

| Command                 | Description                                   |
|-------------------------|-----------------------------------------------|
| `npm run changelog`     | Generate changelog (updates CHANGELOG.md)     |
| `npm run changelog:dry-run` | Preview changelog without modifications   |

For advanced usage, see `scripts/generate-changelog.js --help`.
