import { type FileObject, printErrors, scanURLs, validateFiles } from 'next-validate-link';

import { source } from '../lib/source';

/**
 * Extract headings from TOC.
 */
function getHeadings(page: (typeof source)['$inferPage']): string[] {
	return (page.data.toc || []).map((item) => item.url.slice(1));
}

/**
 * Collect all MDX files.
 */
async function getFiles(): Promise<FileObject[]> {
	return Promise.all(
		source.getPages().map(async (page) => ({
			path: page.absolutePath as string,
			content: await page.data.getText('raw'),
			url: page.url,
			data: page.data,
		}))
	);
}

/**
 * Validate links.
 */
async function main(): Promise<void> {
	const scanned = await scanURLs({
		preset: 'next',

		populate: {
			'docs/[[...slug]]': source.getPages().map((page) => ({
				value: {
					slug: page.slugs,
				},

				hashes: getHeadings(page),
			})),
		},
	});

	const result = await validateFiles(await getFiles(), {
		scanned,

		checkRelativePaths: 'as-url',

		markdown: {
			components: {
				Card: {
					attributes: ['href'],
				},
			},
		},
	});

	printErrors(result, true);
}

void main();
