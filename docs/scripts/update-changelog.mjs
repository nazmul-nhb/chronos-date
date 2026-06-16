#!/usr/bin/env node

// @ts-check

import { Stylog } from 'toolbox-x/stylog';

/**
 * @fileoverview Syncs release sections from root CHANGELOG.md
 * into docs/content/docs/changelog.mdx with the MDX frontmatter preserved.
 *
 * Runs before the docs build (Vercel) to keep the changelog page up-to-date.
 *
 * Usage: node docs/scripts/update-changelog.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(DOCS_ROOT, '..');

const CHANGELOG_PATH = resolve(REPO_ROOT, 'CHANGELOG.md');
const MDX_PATH = resolve(DOCS_ROOT, 'content/docs/changelog.mdx');

const FRONTMATTER = `---
title: Changelog
description: All notable changes to the chronos-date package.
icon: Logs
---

All notable changes to **chronos-date** will be documented here.

> Auto-generated from git history using [changelog-maker](https://github.com/nodejs/changelog-maker).`;

// ─── Main ─────────────────────────────────────────────────────────────────────

const changelog = readFileSync(CHANGELOG_PATH, 'utf-8');

// Extract everything from the first ## heading onward (skip the markdown title + description)
const firstHeading = changelog.indexOf('\n## ');

if (firstHeading === -1) {
	console.error(Stylog.error.toANSI(`✗ No release sections found in CHANGELOG.md`));
	process.exit(1);
}

const releaseSections = changelog.slice(firstHeading + 1); // +1 to skip the leading \n

const mdx = `${FRONTMATTER}\n\n${releaseSections}`;

writeFileSync(MDX_PATH, mdx, 'utf-8');

console.info(Stylog.cyan.toANSI(`✓ Successfully updated changelog.mdx from CHANGELOG.md`));
