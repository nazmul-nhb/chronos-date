// @ts-check

import { defineScriptConfig } from 'nhb-scripts';

export default defineScriptConfig({
	commit: {
		runFormatter: false,
		emojiBeforePrefix: true,
		commitTypes: {
			custom: [
				{ emoji: '🚀', type: 'init' },
				{ emoji: '💩', type: 'dump' },
				{ emoji: '🧠', type: 'ideas' },
				{ emoji: '📝', type: 'draft' },
				{ emoji: '🔣', type: 'types' },
				{ emoji: '🔡', type: 'tsdoc' },
			],
		},
	},
	module: {
		force: false,
		defaultTemplate: 'chronos-plugin',
		templates: {
			'chronos-plugin': {
				createFolder: false,
				destination: 'src/plugins',
				files: generatePlugin,
			},
		},
	},
	count: {
		defaultPath: 'node_modules/nhb-toolbox/dist/esm',
		excludePaths: ['node_modules', 'dist', '.VSCodeCounter'],
	},
});

/**
 *  @import { FileGenerator } from 'nhb-scripts';
 */

/** @type { FileGenerator } */
function generatePlugin(pluginName) {
	return [
		{
			name: `${pluginName}Plugin.ts`,
			content: `import type { ChronosPlugin } from '../types';

declare module 'chronos-date' {
    interface Chronos {

        ${pluginName}(): void;
    }
}

/** * Plugin to inject \`${pluginName}\` method */
export const ${pluginName}Plugin: ChronosPlugin = ($Chronos) => {
    $Chronos.prototype.${pluginName} = function () {
        // Logic
    };
};`,
		},
	];
}
