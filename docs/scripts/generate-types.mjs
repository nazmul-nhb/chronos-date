// @ts-check

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Stylog } from 'toolbox-x/stylog';

/**
 * @import { PackageJson } from 'type-fest';
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '../../');
const distDir = path.join(pkgRoot, 'dist');

const LIB_DIR = path.resolve(pkgRoot, 'docs/lib');
const CACHE_FILE = path.join(LIB_DIR, '.gen-cache.json');

/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */

/**
 * Fast hash for change detection
 * @param {string} input
 * @returns {string}
 */
function hash(input) {
	return crypto.createHash('sha1').update(input).digest('hex');
}

/**
 * Load cache file
 * @returns {Record<string, string>}
 */
function loadCache() {
	if (!fs.existsSync(CACHE_FILE)) return {};
	return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
}

/**
 * Save cache file
 * @param {Record<string, string>} cache
 */
function saveCache(cache) {
	fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
	fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * Ensure directory exists
 * @param {string} dir
 */
function ensureDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
}

/**
 * Get all .d.ts and .d.cts files recursively
 * @param {string} dir
 * @param {string[]} files
 * @returns {string[]}
 */
function getFiles(dir, files = []) {
	const fileList = fs.readdirSync(dir);

	for (const file of fileList) {
		const name = path.join(dir, file);

		if (fs.statSync(name).isDirectory()) {
			getFiles(name, files);
		} else if (name.endsWith('.d.ts') || name.endsWith('.d.cts')) {
			files.push(name);
		}
	}

	return files;
}

/* -------------------------------------------------------------------------- */
/*                              Main Generator                                */
/* -------------------------------------------------------------------------- */

function generateTypes() {
	if (!fs.existsSync(distDir)) {
		console.warn(
			Stylog.ansi16('red').toANSI(
				`Warning: ${Stylog.bold.toANSI('dist/')}${Stylog.ansi16('red').toANSI(' does not exist')}. Please build "chronos-date" first!`
			)
		);
		return;
	}

	ensureDir(LIB_DIR);

	const cache = loadCache();
	/** @type {Record<string, string>} */
	const newCache = {};
	let hasChanges = false;

	const files = getFiles(distDir);

	const types = [];

	for (const file of files) {
		const content = fs.readFileSync(file, 'utf-8');
		const fileHash = hash(content);

		newCache[file] = fileHash;

		if (cache[file] !== fileHash) {
			hasChanges = true;
		}

		let relativePath = path.relative(distDir, file);
		relativePath = relativePath.replace(/\.d\.[mc]ts$/, '.d.ts');

		const transformed = content.replace(
			/from\s+"(\.\.?\/[^"]+)\.(c|m)js"/g,
			'from "$1.d.ts"'
		);

		types.push({
			content: transformed,
			filePath: `file:///node_modules/chronos-date/dist/${relativePath.replace(/\\/g, '/')}`,
		});
	}

	/* ---------------------------- index.d.cts file --------------------------- */

	const indexSrc = path.join(distDir, 'index.d.cts');
	const indexContentRaw = fs.readFileSync(indexSrc, 'utf-8');

	const indexHash = hash(indexContentRaw);

	newCache[indexSrc] = indexHash;

	if (cache[indexSrc] !== indexHash) {
		hasChanges = true;
	}

	types.push({
		content: indexContentRaw
			.replace(/from\s+"(\.\.?\/[^"]+)\.(c|m)js"/g, 'from "$1.d.ts"')
			.replace(/from\s+"(\.\/)([^"]+)"/g, 'from "./dist/$2"'),
		filePath: `file:///node_modules/chronos-date/index.d.ts`,
	});

	/* --------------------------- sub-path exports ---------------------------- */

	const PKG = 'chronos-date';
	/** @type {Record<string, any>} */
	const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgRoot, 'package.json'), 'utf-8'));

	/** @type {string[]} */
	const declareBlocks = [];

	for (const [subpath, conditions] of Object.entries(pkgJson.exports ?? {})) {
		if (subpath === '.' || subpath === './package.json') continue;

		const runtimeFile = conditions?.import ?? conditions?.require ?? '';

		const distRelative = normalizeDistPath(runtimeFile).replace(/\.(m|c)?js$/, '');

		if (!distRelative) continue;

		const subpathName = subpath.replace(/^\.\//, '');

		declareBlocks.push(
			`declare module '${PKG}/${subpathName}' {\n\texport * from '${PKG}/dist/${distRelative}';\n}`
		);
	}

	types.push({
		content: declareBlocks.join('\n'),
		filePath: `file:///node_modules/${PKG}/sub-paths.d.ts`,
	});

	/* ---------------------------- skip if unchanged -------------------------- */

	if (!hasChanges && isValidCache(cache)) {
		console.info(
			Stylog.ansi16('cyan').toANSI('✓ No changes detected - Skipped type generation!')
		);
		return;
	}

	/* ------------------------------- write output ---------------------------- */

	const resolvedPath = path.resolve(LIB_DIR, '.generated-types.json');

	fs.writeFileSync(resolvedPath, JSON.stringify(types, null, 2));

	saveCache(newCache);

	console.info(
		Stylog.ansi16('green').toANSI(
			`✓ Successfully generated Monaco types in ${Stylog.bold.toANSI(resolvedPath)}`
		)
	);

	/* --------------------------- module map stage ---------------------------- */

	generateModuleMap(pkgJson);
}

/* -------------------------------------------------------------------------- */
/*                         Playground Module Map                              */
/* -------------------------------------------------------------------------- */

/**
 * @param {PackageJson} pkgJson
 */
function generateModuleMap(pkgJson) {
	const PKG = 'chronos-date';

	const subpaths = [];

	for (const subpath of Object.keys(pkgJson.exports ?? {})) {
		if (subpath === '.' || subpath === './package.json') continue;
		subpaths.push(subpath.replace(/^\./, ''));
	}

	/** @param {string} s */
	const toIdentifier = (s) =>
		s
			.split('/')
			.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
			.join('');

	const importLines = [
		`// ! Auto-generated by scripts/generate-types.mjs — DO NOT EDIT`,
		`// ? Derived from package.json exports. Regenerate with: node scripts/generate-types.mjs`,
		``,
		`import * as ChronosDate from '${PKG}';`,
	];

	const moduleEntries = [`\t'${PKG}': ChronosDate,`];

	for (const sp of subpaths) {
		const cleanedSP = normalizeSubpath(sp);
		importLines.push(`import * as ${toIdentifier(cleanedSP)} from '${PKG}/${cleanedSP}';`);
		moduleEntries.push(`\t'${PKG}/${cleanedSP}': ${toIdentifier(cleanedSP)},`);
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
	].join('\n');

	ensureDir(LIB_DIR);

	const resolvedPath = path.resolve(LIB_DIR, '.generated-modules.ts');

	fs.writeFileSync(resolvedPath, output);

	console.info(
		Stylog.ansi16('green').toANSI(
			`✓ Successfully generated Playground module map in ${Stylog.bold.toANSI(resolvedPath)}`
		)
	);
}

function outputsExist() {
	return (
		fs.existsSync(path.join(LIB_DIR, '.generated-types.json')) &&
		fs.existsSync(path.join(LIB_DIR, '.generated-modules.ts'))
	);
}

/**
 *
 * @param {Record<string, string>} cache
 * @returns {boolean}
 */
function isValidCache(cache) {
	return outputsExist() && Object.keys(cache).length > 0;
}

/**
 * Normalize a runtime export path into a clean module path.
 * @param {string} runtimeFile
 * @returns {string}
 */
function normalizeDistPath(runtimeFile) {
	return runtimeFile
		.replace(/^\.\/?/, '') // remove leading ./
		.replace(/^dist\//, '') // remove dist/
		.replace(/\/+/g, '/'); // collapse multiple slashes
}

/**
 * Normalize export subpath into consistent format: /constants
 * @param {string} subpath
 * @returns {string}
 */
function normalizeSubpath(subpath) {
	return subpath
		.replace(/^\.\//, '') // remove ./
		.replace(/^\/+/, '') // remove leading slashes
		.replace(/\/+/g, '/'); // collapse duplicates
}

/* -------------------------------------------------------------------------- */

generateTypes();
