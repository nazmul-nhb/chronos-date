// @ts-check

import { defineScriptConfig } from 'nhb-scripts';
import { convertStringCase, toCamelCase } from 'toolbox-x/change-case';
import { isCamelCase } from 'toolbox-x/guards';

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
			docs: {
				createFolder: false,
				destination: 'docs/content/docs',
				files: generateDocs,
			},
		},
	},
	count: {
		defaultPath: 'src/index.ts',
		excludePaths: ['node_modules', 'dist', '.VSCodeCounter', 'docs'],
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
			content: `import type { ChronosPlugin } from 'src/types';

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

/** @type { FileGenerator } */
function generateDocs(docTitle) {
	/** @type { string } */
	const camelTitle = isCamelCase(docTitle) ? docTitle : toCamelCase(docTitle);

	return [
		{
			name: `${convertStringCase(camelTitle, 'kebab-case')}.mdx`,
			content: `---
title: ${camelTitle}
description: ${camelTitle} Description.
---

## \`${camelTitle}()\`
`,
		},
	];
}
