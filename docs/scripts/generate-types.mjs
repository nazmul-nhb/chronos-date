import fs from 'node:fs';
import path from 'node:path';

function getFiles(dir, files = []) {
	const fileList = fs.readdirSync(dir);
	for (const file of fileList) {
		const name = `${dir}/${file}`;
		if (fs.statSync(name).isDirectory()) {
			getFiles(name, files);
		} else if (
			name.endsWith('.d.ts') ||
			name.endsWith('.d.cts') ||
			name.endsWith('.d.mts')
		) {
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
		const content = fs.readFileSync(file, 'utf-8');
		let relativePath = path.relative(distDir, file);

		// Map .d.mts or .d.cts to .d.ts so TypeScript can resolve them without extensions
		relativePath = relativePath.replace(/\.d\.[mc]ts$/, '.d.ts');

		return {
			content,
			filePath: `file:///node_modules/chronos-date/dist/${relativePath.replace(/\\/g, '/')}`,
		};
	});

	// Also add the module declarations so TS knows what 'chronos-date' means
	types.push({
		content: `
declare module 'chronos-date' {
	// export * from 'chronos-date/dist'; // it didn't work: showed this ony refers to types not value
	import { Chronos as ChronosClass, chronos as chronosObj } from 'chronos-date/dist/index';
	export const Chronos: ChronosClass; // these shows any for the instances
	export const chronos: chronosObj; // these shows any for the instances
	// tried typeof ChronosClass and chronosObj, but that didn't work either, shows any for Chronos and chronos
}
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
		filePath: `file:///node_modules/chronos-date/index.d.ts`,
	});

	fs.writeFileSync(path.resolve('lib/generated-types.json'), JSON.stringify(types, null, 2));
	console.info('Successfully generated Monaco types in lib/generated-types.json');
}

generateTypes();
