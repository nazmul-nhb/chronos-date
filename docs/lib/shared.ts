export const appName = 'Chronos';
export const appLogo = '/chronos.png';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const ogImageSize = {
	width: 1200,
	height: 630,
};

export const gitConfig = {
	user: 'nazmul-nhb',
	repo: 'chronos-date',
	branch: 'main',
};

export const titleDescription = {
	title: {
		absolute: `${appName} - Elegant Date-Time Library`,
		default: `${appName} Documentation`,
		template: `%s » ${appName} Documentation`,
	},
	description: `${appName} - A lightweight, immutable, and plugin-based date-time manipulation library for JavaScript and TypeScript.`,
} as const;
