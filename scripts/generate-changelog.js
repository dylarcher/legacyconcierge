#!/usr/bin/env node

/**
 * CHANGELOG Generator
 * 
 * Automatically generates changelog entries based on commit history.
 * Follows Keep a Changelog format and Conventional Commits specification.
 * 
 * Usage:
 *   node scripts/generate-changelog.js [--from <ref>] [--to <ref>] [--dry-run]
 * 
 * Options:
 *   --from      Starting git reference (default: last tag or main)
 *   --to        Ending git reference (default: HEAD)
 *   --dry-run   Preview changes without modifying CHANGELOG.md
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CHANGELOG_PATH = join(__dirname, '..', 'CHANGELOG.md');
const REPO_URL = 'https://github.com/dylarcher/legacyconcierge';

// Conventional Commit types mapping to changelog categories
const COMMIT_TYPE_MAP = {
	feat: { category: 'Added', emoji: '✨' },
	fix: { category: 'Fixed', emoji: '🐛' },
	docs: { category: 'Documentation', emoji: '📝' },
	style: { category: 'Changed', emoji: '💄' },
	refactor: { category: 'Changed', emoji: '♻️' },
	perf: { category: 'Performance', emoji: '⚡' },
	test: { category: 'Tests', emoji: '✅' },
	build: { category: 'Build', emoji: '📦' },
	ci: { category: 'CI/CD', emoji: '👷' },
	chore: { category: 'Maintenance', emoji: '🔧' },
	revert: { category: 'Reverted', emoji: '⏪' },
	security: { category: 'Security', emoji: '🔒' },
	deps: { category: 'Dependencies', emoji: '⬆️' },
};

/**
 * Parse command line arguments
 */
function parseArgs() {
	const args = process.argv.slice(2);
	const options = {
		from: /** @type {string | null} */ (null),
		to: 'HEAD',
		dryRun: false,
	};

	for (let i = 0; i < args.length; i++) {
		switch (args[i]) {
			case '--from':
				options.from = args[++i];
				break;
			case '--to':
				options.to = args[++i];
				break;
			case '--dry-run':
				options.dryRun = true;
				break;
			case '--help':
			case '-h':
				console.log(`
Usage: node scripts/generate-changelog.js [options]

Options:
  --from <ref>   Starting git reference (default: last tag or main)
  --to <ref>     Ending git reference (default: HEAD)
  --dry-run      Preview changes without modifying CHANGELOG.md
  --help, -h     Show this help message
				`);
				process.exit(0);
		}
	}

	return options;
}

/**
 * Execute git command and return output
 */
function git(command) {
	try {
		return execSync(`git ${command}`, { encoding: 'utf-8' }).trim();
	} catch (error) {
		console.error(`Git command failed: ${command}`);
		throw error;
	}
}

/**
 * Get the latest tag or fallback to main branch
 */
function getStartRef(from) {
	if (from) return from;

	try {
		const latestTag = git('describe --tags --abbrev=0 2>/dev/null || echo ""');
		if (latestTag) return latestTag;
	} catch {
		// No tags found
	}

	// Fallback to main branch
	return 'main';
}

/**
 * Parse conventional commit message
 */
function parseCommit(commitLine) {
	const [hash, ...messageParts] = commitLine.split(' ');
	const message = messageParts.join(' ');

	// Match: type(scope): subject
	const conventionalMatch = message.match(/^(\w+)(?:\(([^)]+)\))?:\s*(.+)$/);

	if (conventionalMatch) {
		const [, type, scope, subject] = conventionalMatch;
		return {
			hash: hash.substring(0, 7),
			type: type.toLowerCase(),
			scope: scope || null,
			subject: subject.trim(),
			breaking: message.includes('BREAKING CHANGE') || message.includes('!:'),
		};
	}

	// Non-conventional commit
	return {
		hash: hash.substring(0, 7),
		type: 'other',
		scope: null,
		subject: message.trim(),
		breaking: false,
	};
}

/**
 * Get commits between two references
 */
function getCommits(from, to) {
	const range = from ? `${from}..${to}` : to;
	const commitLog = git(`log ${range} --pretty=format:"%H %s" --no-merges`);

	if (!commitLog) {
		console.log('No new commits found.');
		return [];
	}

	return commitLog
		.split('\n')
		.filter((line) => line.trim())
		.map(parseCommit);
}

/**
 * Group commits by category
 */
function groupCommits(commits) {
	const groups = {};
	const breaking = [];

	for (const commit of commits) {
		if (commit.breaking) {
			breaking.push(commit);
		}

		const typeInfo = COMMIT_TYPE_MAP[commit.type] || {
			category: 'Other',
			emoji: '📌',
		};
		const category = typeInfo.category;

		if (!groups[category]) {
			groups[category] = [];
		}

		groups[category].push({
			...commit,
			emoji: typeInfo.emoji,
		});
	}

	return { groups, breaking };
}

/**
 * Format a commit entry
 */
function formatCommit(commit) {
	const scope = commit.scope ? `**${commit.scope}**: ` : '';
	const link = `[${commit.hash}](${REPO_URL}/commit/${commit.hash})`;
	return `- ${commit.emoji} ${scope}${commit.subject} (${link})`;
}

/**
 * Generate changelog section
 */
function generateChangelogSection(groups, breaking, version = 'Unreleased') {
	const today = new Date().toISOString().split('T')[0];
	let section = `## [${version}] - ${today}\n\n`;

	// Breaking changes first
	if (breaking.length > 0) {
		section += '### ⚠️ BREAKING CHANGES\n\n';
		section += breaking.map(formatCommit).join('\n');
		section += '\n\n';
	}

	// Categories in order
	const categoryOrder = [
		'Added',
		'Changed',
		'Deprecated',
		'Removed',
		'Fixed',
		'Security',
		'Performance',
		'Dependencies',
		'Documentation',
		'Tests',
		'Build',
		'CI/CD',
		'Maintenance',
		'Reverted',
		'Other',
	];

	for (const category of categoryOrder) {
		if (groups[category] && groups[category].length > 0) {
			section += `### ${category}\n\n`;
			section += groups[category].map(formatCommit).join('\n');
			section += '\n\n';
		}
	}

	return section.trim();
}

/**
 * Read current CHANGELOG.md
 */
function readChangelog() {
	try {
		return readFileSync(CHANGELOG_PATH, 'utf-8');
	} catch (error) {
		console.error('Could not read CHANGELOG.md');
		throw error;
	}
}

/**
 * Update CHANGELOG.md with new section
 */
function updateChangelog(newSection, dryRun = false) {
	const currentChangelog = readChangelog();

	// Find the [Unreleased] section
	const unreleasedMatch = currentChangelog.match(
		/## \[Unreleased\]\s*\n([\s\S]*?)(?=\n## |\n\[Unreleased\]|Z)/,
	);

	let updatedChangelog;

	if (unreleasedMatch) {
		// Replace the Unreleased section
		updatedChangelog = currentChangelog.replace(
			/## \[Unreleased\]\s*\n[\s\S]*?(?=\n## |\n\[Unreleased\]|Z)/,
			`${newSection}\n\n`,
		);
	} else {
		// Insert after the header
		const headerEnd = currentChangelog.indexOf('## [Unreleased]');
		if (headerEnd === -1) {
			console.error(
				'Could not find ## [Unreleased] section in CHANGELOG.md',
			);
			process.exit(1);
		}

		const unreleasedLineEnd = currentChangelog.indexOf('\n', headerEnd);
		updatedChangelog =
			currentChangelog.slice(0, unreleasedLineEnd + 1) +
			'\n' +
			newSection +
			'\n' +
			currentChangelog.slice(unreleasedLineEnd + 1);
	}

	if (dryRun) {
		console.log('\n=== DRY RUN: Preview of changes ===\n');
		console.log(newSection);
		console.log('\n=== End of preview ===\n');
	} else {
		writeFileSync(CHANGELOG_PATH, updatedChangelog);
		console.log('✅ CHANGELOG.md updated successfully!');
	}
}

/**
 * Main execution
 */
function main() {
	console.log('🔍 Generating CHANGELOG...\n');

	const options = parseArgs();
	const startRef = getStartRef(options.from);
	const endRef = options.to;

	console.log(`📍 Analyzing commits from ${startRef} to ${endRef}\n`);

	const commits = getCommits(startRef, endRef);

	if (commits.length === 0) {
		console.log('ℹ️  No commits to process.');
		return;
	}

	console.log(`📝 Found ${commits.length} commit(s)\n`);

	const { groups, breaking } = groupCommits(commits);
	const changelogSection = generateChangelogSection(groups, breaking);

	updateChangelog(changelogSection, options.dryRun);

	if (!options.dryRun) {
		console.log(
			'\n💡 Tip: Review the changes and commit them with your PR.\n',
		);
	}
}

// Run the script
main();
