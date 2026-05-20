# [Chronos Date](https://chronos.nazmul-nhb.dev/)

> A lightweight, immutable, and plugin-based date-time manipulation library for JavaScript and TypeScript.

[![Chronos Date](https://raw.githubusercontent.com/nazmul-nhb/chronos-date/refs/heads/main/chronos.png)](https://chronos.nazmul-nhb.dev/)

<p>
  <!-- Package Info -->
  <a href="https://www.npmjs.com/package/chronos-date" aria-label="NPM Downloads">
    <img src="https://img.shields.io/npm/dm/chronos-date.svg?label=DOWNLOADS&style=flat&color=red&logo=npm" alt="Downloads" />
  </a>
  <a href="https://www.npmjs.com/package/chronos-date" aria-label="Latest Version">
    <img src="https://img.shields.io/npm/v/chronos-date.svg?label=NPM&style=flat&color=teal&logo=npm" alt="Latest Version" />
  </a>
  <a href="https://bundlejs.com/?q=chronos-date" aria-label="Bundle Size">
    <img src="https://img.shields.io/bundlejs/size/chronos-date?label=Bundle%20Size&style=flat&color=blue&logo=npm" alt="Bundle Size" />
  </a>

  <!-- Project Metadata -->
  <a href="https://github.com/nazmul-nhb/chronos-date" aria-label="TypeScript">
    <img src="https://img.shields.io/badge/BUILT%20with-TypeScript-3178C6?style=flat&logo=typescript&logoColor=blue" alt="Built with TypeScript" />
  </a>
  <a href="https://github.com/nazmul-nhb/chronos-date/actions" aria-label="Build Status">
    <img src="https://img.shields.io/github/actions/workflow/status/nazmul-nhb/chronos-date/publish.yml?label=BUILD%20%26%20PUBLISH&style=flat&logo=github" alt="Build Status" />
  </a>
  <a href="https://github.com/nazmul-nhb/chronos-date" aria-label="Project Status">
    <img src="https://img.shields.io/badge/STATUS-maintained-brightgreen?style=flat&logo=git" alt="Maintained" />
  </a>
  <a href="https://github.com/nazmul-nhb/chronos-date/commits/main" aria-label="Last Commit">
    <img src="https://img.shields.io/github/last-commit/nazmul-nhb/chronos-date?style=flat&label=LAST%20COMMIT&logo=git" alt="Last Commit" />
  </a>

  <!-- GitHub Meta -->
  <a href="https://github.com/nazmul-nhb/chronos-date/stargazers" aria-label="GitHub Stars">
    <img src="https://img.shields.io/github/stars/nazmul-nhb/chronos-date?style=flat&label=STARS&logo=github" alt="GitHub stars" />
  </a>
  <a href="https://github.com/nazmul-nhb/chronos-date/issues" aria-label="Open Issues">
    <img src="https://img.shields.io/github/issues/nazmul-nhb/chronos-date?style=flat&label=ISSUES&logo=github" alt="Open Issues" />
  </a>
  <a href="https://github.com/nazmul-nhb/chronos-date/pulls" aria-label="Open Pull Requests">
    <img src="https://img.shields.io/github/issues-pr/nazmul-nhb/chronos-date?style=flat&label=PRs&logo=github" alt="Pull Requests" />
  </a>

  <!-- License Info -->
  <a href="https://www.npmjs.com/package/chronos-date" aria-label="License">
    <img src="https://img.shields.io/npm/l/chronos-date.svg?label=LICENSE&style=flat&color=orange&logo=open-source-initiative" alt="License" />
  </a>
</p>

## Why Chronos?

In ancient Greek mythology, **Chronos** is the primordial embodiment of time — not merely tracking moments, but **defining their very existence**. Like its mythological namesake, the `Chronos` class offers **precise, immutable, and expressive control** over time within your application.

Designed to go beyond the native `Date` object, it empowers you to manipulate, format, compare, and traverse time with **clarity, reliability, and confidence** — all while staying _immutable_ and _framework-agnostic_.

## Key Features

- **Immutability:** Every modification returns a new `Chronos` instance. Your original dates remain intact.
- **Rich API:** From formatting to comparison, calculation, and detailed part extraction.
- **Plugin System:** Extend core capabilities seamlessly using `Chronos.use(plugin)`. Over a dozen official plugins exist for advanced operations like business hours, seasons, zodiacs, relative times, and more.
- **Time Zone Support:** Advanced formatting and tracking of UTC offsets and Native time zone properties.
- **Date Utilities:** Extra utilities, type guards, types and constants for light weight date operations without the need of core class.
- **Comprehensive TypeScript IntelliSense:** Built with first-class TypeScript types and granular tracking for strict date formatting tokens.
- **Cross-environment compatibility:** Works anywhere JS runs (Node.js, Browser, Deno, Bun).

---

## Installation

```sh
npm install chronos-date
# or
yarn add chronos-date
# or
pnpm add chronos-date
```

---

## Quick Start

```ts
import { Chronos, chronos } from 'chronos-date';

// Using the constructor
const now = new Chronos();
console.log(now.format('dd, mmm DD, YYYY')); 

// Using the function wrapper
const tomorrow = chronos().addDays(1);
console.log(tomorrow.formatSafe('YYYY-MM-DD'));

// Calculate differences
const eventDate = new Chronos('2025-12-31');
console.log(now.diff(eventDate, 'day')); // Days until event
```

---

## Modular Imports

You can import specific submodules for better tree-shaking:

```ts
// Guards
import { isValidDateInput } from "chronos-date/guards";

// Utility functions
import { formatDate } from "chronos-date/utils";

// Type definitions
import type { ChronosInput } from "chronos-date/types";

// Constants
import { MONTHS } from "chronos-date/constants";

// Plugins (imported individually)
import { timeZonePlugin } from "chronos-date/plugins/timeZonePlugin";
import { seasonPlugin } from "chronos-date/plugins/seasonPlugin";
```

---

## Documentation

For full documentation, API reference, and interactive playgrounds, visit the [**Documentation Site**](https://chronos.nazmul-nhb.dev/).

---

## 🔗 Related Packages

<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  <a target="_blank" href="https://www.npmjs.com/package/nhb-toolbox">
    <img src="https://img.shields.io/badge/NHB_Toolbox-nhb--toolbox-steelblue" alt="nhb-toolbox" />
  </a>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  <a target="_blank" href="https://www.npmjs.com/package/bn-calendar">
    <img src="https://img.shields.io/badge/Bangla_Calendar-bn--calendar-red" alt="bn-calendar" />
  </a>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  <a target="_blank" href="https://www.npmjs.com/package/nhb-hooks">
    <img src="https://img.shields.io/badge/React_Hooks-nhb--hooks-blue" alt="nhb-hooks" />
  </a>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  <a target="_blank" href="https://www.npmjs.com/package/locality-idb">
    <img src="https://img.shields.io/badge/IndexedDB_ORM-locality--idb-darkviolet" alt="locality-idb" />
  </a>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  <a target="_blank" href="https://www.npmjs.com/package/nhb-scripts">
    <img src="https://img.shields.io/badge/Development_Scripts-nhb--scripts-red" alt="nhb-scripts" />
  </a>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  <a target="_blank" href="https://www.npmjs.com/package/nhb-express">
    <img src="https://img.shields.io/badge/Express_Server_Scaffolder-nhb--express-orange" alt="nhb-express" />
  </a>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
  <a target="_blank" href="https://www.npmjs.com/package/nhb-anagram-generator">
    <img src="https://img.shields.io/badge/Anagram_Generator-nhb--anagram--generator-teal" alt="nhb-anagram-generator" />
  </a>
</div>

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).
