import fs from 'node:fs';
import path from 'node:path';

function getFiles(dir, files = []) {
	const fileList = fs.readdirSync(dir);
	for (const file of fileList) {
		const name = `${dir}/${file}`;
		if (fs.statSync(name).isDirectory()) {
			getFiles(name, files);
		} else if (name.endsWith('.d.ts') || name.endsWith('.d.cts')) {
			files.push(name);
		}
	}
	return files;
}

function generateTypes() {
	const distDir = path.resolve('../dist');
	if (!fs.existsSync(distDir)) {
		console.warn('Warning: ../dist does not exist. Please build chronos-date first.');
		return;
	}

	const files = getFiles(distDir);
	const types = files.map((file) => {
		let content = fs.readFileSync(file, 'utf-8');
		let relativePath = path.relative(distDir, file);

		// Normalize .d.mts / .d.cts → .d.ts so Monaco resolves them without extensions
		relativePath = relativePath.replace(/\.d\.[mc]ts$/, '.d.ts');

		// Rewrite sibling chunk imports from .cjs/.mjs → .d.ts so Monaco can follow
		// the import chain (the dist files cross-reference each other via runtime
		// extensions that don't exist in Monaco's virtual filesystem).
		content = content.replace(/from\s+"(\.\.?\/[^"]+)\.(c|m)js"/g, 'from "$1.d.ts"');

		return {
			content,
			filePath: `file:///node_modules/chronos-date/dist/${relativePath.replace(/\\/g, '/')}`,
		};
	});

	// Register the main entry types at file:///node_modules/chronos-date/index.d.ts
	//
	// WHY not `declare module 'chronos-date' { export * from '...' }`:
	//   dist/index.d.ts is a pure re-export relay: it only does
	//   `import { X } from "./chunk.cjs"; export { X }`.
	//   Inside an ambient `declare module` block, TypeScript's `export *` only
	//   carries TYPES through a re-export chain — values (class constructors,
	//   functions) are stripped. That's why Chronos/chronos showed `any`.
	//
	// WHY not a virtual package.json:
	//   `setExtraLibs` only processes .d.ts files; Monaco's TS worker ignores
	//   .json files registered that way, so 'chronos-date' stayed unresolved (2307).
	//
	// THE FIX — direct file at index.d.ts:
	//   With NodeJs module resolution, TypeScript looks for
	//   `node_modules/chronos-date/index.d.ts` when there's no package.json types.
	//   We read dist/index.d.cts, rewrite its relative imports to prepend `./dist/`
	//   so they point to the already-registered chunk files, then register it at the
	//   package root. Monaco follows the import chain naturally and gets the full
	//   `declare class Chronos` definition — both type AND value.
	const indexSrc = path.join(distDir, 'index.d.cts');
	let indexContent = fs.readFileSync(indexSrc, 'utf-8');

	// Rewrite .cjs/.mjs extensions to .d.ts (same as above)
	indexContent = indexContent.replace(/from\s+"(\.\.?\/[^"]+)\.(c|m)js"/g, 'from "$1.d.ts"');

	// Rewrite relative imports like `"./foo"` → `"./dist/foo"` so that when this
	// file lives at the package root it can still find the chunk files in dist/.
	indexContent = indexContent.replace(/from\s+"(\.\/)([^"]+)"/g, 'from "./dist/$2"');

	types.push({
		content: indexContent,
		filePath: `file:///node_modules/chronos-date/index.d.ts`,
	});

	// Sub-path `declare module` blocks — these work fine because the sub-module
	// dist files (constants, utils, guards, etc.) have self-contained value
	// declarations rather than relay re-exports, so `export *` carries both
	// types and values correctly.
	types.push({
		content: `
declare module 'chronos-date/constants' {
	export * from 'chronos-date/dist/constants';
}
declare module 'chronos-date/guards' {
	export * from 'chronos-date/dist/guards';
}
declare module 'chronos-date/types' {
	export * from 'chronos-date/dist/types';
}
declare module 'chronos-date/utils' {
	export * from 'chronos-date/dist/utils';
}
declare module 'chronos-date/plugins/banglaPlugin' {
	export * from 'chronos-date/dist/plugins/banglaPlugin';
}
declare module 'chronos-date/plugins/businessPlugin' {
	export * from 'chronos-date/dist/plugins/businessPlugin';
}
declare module 'chronos-date/plugins/dateRangePlugin' {
	export * from 'chronos-date/dist/plugins/dateRangePlugin';
}
declare module 'chronos-date/plugins/dayPartPlugin' {
	export * from 'chronos-date/dist/plugins/dayPartPlugin';
}
declare module 'chronos-date/plugins/durationPlugin' {
	export * from 'chronos-date/dist/plugins/durationPlugin';
}
declare module 'chronos-date/plugins/fromNowPlugin' {
	export * from 'chronos-date/dist/plugins/fromNowPlugin';
}
declare module 'chronos-date/plugins/greetingPlugin' {
	export * from 'chronos-date/dist/plugins/greetingPlugin';
}
declare module 'chronos-date/plugins/palindromePlugin' {
	export * from 'chronos-date/dist/plugins/palindromePlugin';
}
declare module 'chronos-date/plugins/relativeTimePlugin' {
	export * from 'chronos-date/dist/plugins/relativeTimePlugin';
}
declare module 'chronos-date/plugins/roundPlugin' {
	export * from 'chronos-date/dist/plugins/roundPlugin';
}
declare module 'chronos-date/plugins/seasonPlugin' {
	export * from 'chronos-date/dist/plugins/seasonPlugin';
}
declare module 'chronos-date/plugins/timeZonePlugin' {
	export * from 'chronos-date/dist/plugins/timeZonePlugin';
}
declare module 'chronos-date/plugins/zodiacPlugin' {
	export * from 'chronos-date/dist/plugins/zodiacPlugin';
}
		`,
		filePath: `file:///node_modules/chronos-date/sub-paths.d.ts`,
	});

	fs.writeFileSync(path.resolve('lib/generated-types.json'), JSON.stringify(types, null, 2));
	console.info('Successfully generated Monaco types in lib/generated-types.json');
}

generateTypes();
