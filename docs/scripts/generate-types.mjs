import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '../../');
const distDir = path.join(pkgRoot, 'dist');

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
	if (!fs.existsSync(distDir)) {
		console.warn('Warning: dist/ does not exist! Please build chronos-date first!');
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
	const indexContent = fs.readFileSync(indexSrc, 'utf-8');

	types.push({
		content: indexContent
			// Rewrite .cjs/.mjs extensions to .d.ts (same as above)
			.replace(/from\s+"(\.\.?\/[^"]+)\.(c|m)js"/g, 'from "$1.d.ts"')
			// Rewrite relative imports like `"./foo"` → `"./dist/foo"`
			// so that when this file lives at the package root it can still find the chunk files in dist/.
			.replace(/from\s+"(\.\/)([^"]+)"/g, 'from "./dist/$2"'),
		filePath: `file:///node_modules/chronos-date/index.d.ts`,
	});

	// ── Sub-path `declare module` blocks ─────────────────────────────────────
	// Auto-generated from package.json#exports so new plugins/sub-modules
	// are picked up automatically without manual updates.
	//
	// These work fine because the sub-module dist files have self-contained
	// value declarations rather than relay re-exports, so `export *` carries
	// both types and values correctly.
	const PKG = 'chronos-date';
	const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'package.json'), 'utf-8'));

	const declareBlocks = [];

	for (const [subpath, conditions] of Object.entries(pkgJson.exports ?? {})) {
		// Skip main entry (handled above) and package.json self-reference
		if (subpath === '.' || subpath === './package.json') continue;

		// Derive the dist module name from the "import" or "require" condition.
		// e.g. "./dist/plugins/banglaPlugin.mjs" → "plugins/banglaPlugin"
		const runtimeFile = conditions?.import ?? conditions?.require ?? '';
		const distRelative = runtimeFile
			.replace(/^\.\/(dist\/)?/, '') // strip ./dist/ or ./
			.replace(/\.(m|c)?js$/, ''); // strip extension

		if (!distRelative) continue;

		const subpathName = subpath.replace(/^\.\//, ''); // e.g. "plugins/banglaPlugin"

		declareBlocks.push(
			`declare module '${PKG}/${subpathName}' {\n\texport * from '${PKG}/dist/${distRelative}';\n}`
		);
	}

	types.push({
		content: declareBlocks.join('\n'),
		filePath: `file:///node_modules/${PKG}/sub-paths.d.ts`,
	});

	// ── Auto-generate Playground module map ──────────────────────────────────
	// Generates lib/generated-modules.ts so Playground.tsx doesn't need
	// manual import updates when sub-paths change.
	generateModuleMap(pkgJson);

	fs.writeFileSync(path.resolve('lib/generated-types.json'), JSON.stringify(types, null, 2));
	console.info('Successfully generated Monaco types in lib/generated-types.json');
}

/**
 * Generate lib/generated-modules.ts with auto-discovered imports and MODULES map.
 * Playground.tsx imports from this file instead of maintaining manual import lists.
 */
function generateModuleMap(pkgJson) {
	const PKG = 'chronos-date';

	// Collect all sub-path names (e.g. "constants", "plugins/banglaPlugin")
	const subpaths = [];

	for (const subpath of Object.keys(pkgJson.exports ?? {})) {
		if (subpath === '.' || subpath === './package.json') continue;
		subpaths.push(subpath.replace(/^\.\//, ''));
	}

	// Convert sub-path to a valid JS identifier: "plugins/banglaPlugin" → "PluginsBanglaPlugin"
	const toIdentifier = (s) =>
		s
			.split('/')
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join('');

	const importLines = [
		`// ! Auto-generated by scripts/generate-types.mjs — DO NOT EDIT`,
		`// ? Derived from package.json exports. Regenerate with: node scripts/generate-types.mjs`,
		``,
		`import * as ChronosDate from '${PKG}';`,
	];

	for (const sp of subpaths) {
		importLines.push(`import * as ${toIdentifier(sp)} from '${PKG}/${sp}';`);
	}

	const moduleEntries = [`\t'${PKG}': ChronosDate,`];

	for (const sp of subpaths) {
		moduleEntries.push(`\t'${PKG}/${sp}': ${toIdentifier(sp)},`);
	}

	const output = [
		...importLines,
		``,
		`type ChronosModule = '${PKG}' | \`${PKG}/\${string}\`;`,
		``,
		`export const MODULES: Record<ChronosModule, unknown> = {`,
		...moduleEntries,
		`};`,
		``,
		`export { ChronosDate, type ChronosModule };`,
		``,
	].join('\n');

	fs.writeFileSync(path.resolve('lib/generated-modules.ts'), output);
	console.info('Successfully generated Playground module map in lib/generated-modules.ts');
}

generateTypes();
