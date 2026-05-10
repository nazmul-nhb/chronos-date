import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: [
		'src/index.ts',
		'src/utils.ts',
		'src/guards.ts',
		'src/types.ts',
		'src/constants.ts',
		'src/plugins/*.ts',
	],
	globalName: 'Chronos',
	format: ['esm', 'cjs'],
	dts: true,
	minify: true,
	exports: true,
	unbundle: false,
	treeshake: true,
	deps: {
		onlyBundle: ['nhb-toolbox'],
	},
});
