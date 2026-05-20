import GithubSlugger from 'github-slugger';
import { type FileObject, printErrors, scanURLs, validateFiles } from 'next-validate-link';
import { source } from '@/lib/source';

/**
 * Checks all links in the documentation.
 */
async function checkLinks() {
	const scanned = await scanURLs({
		preset: 'next',
		populate: {
			'docs/[[...slug]]': await Promise.all(
				source.getPages().map(async (page) => {
					const raw = await page.data.getText('raw');

					return {
						value: {
							slug: page.slugs,
						},
						hashes: extractHashes(raw),
					};
				})
			),
		},
	});

	const errors = await validateFiles(await getFiles(), {
		scanned,
		markdown: {
			components: {
				Card: { attributes: ['href'] },
			},
		},
		checkRelativePaths: 'as-url',
	});

	printErrors(errors, false);
}

/**
 * Gets all files in the documentation.
 */
function getFiles() {
	const promises = source.getPages().map(
		async (page): Promise<FileObject> => ({
			path: page.absolutePath as string,
			content: await page.data.getText('raw'),
			url: page.url,
			data: page.data,
		})
	);

	return Promise.all(promises);
}

/**
 * Extract heading ids from raw MDX content.
 */
function extractHashes(content: string): string[] {
	const hashes = new Set<string>();
	const slugger = new GithubSlugger();
	const headingRegex = /^(#{1,6})\s+(.+)$/gm;

	for (const match of content.matchAll(headingRegex)) {
		const raw = match[2].replace(/\{#.*?\}/g, '').trim();

		const slug = slugger.slug(raw);

		if (slug) {
			hashes.add(slug);
		}
	}

	const explicitIdRegex = /\{#(.*?)\}/g;

	for (const match of content.matchAll(explicitIdRegex)) {
		if (match[1]) {
			hashes.add(match[1].trim());
		}
	}

	return [...hashes];
}

void checkLinks();
