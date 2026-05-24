import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { transformerTwoslash } from 'fumadocs-twoslash';

/**
 * Shiki transformer: detects `pg` keyword in code fence meta string
 * and sets `data-pg="true"` on the `<pre>` element so the MDX `pre`
 * override can render the Playground component instead.
 *
 * Usage in MDX:
 *   ```ts pg
 *   import { Chronos } from 'chronos-date';
 *   console.log(new Chronos().format());
 *   ```
 */
function transformerPlayground() {
	return {
		name: 'playground-meta',
		// biome-ignore lint/suspicious/noExplicitAny: Shiki transformer hook types aren't directly available
		pre(this: any, node: any) {
			const meta: string = this.options.meta?.__raw ?? '';
			if (/\bpg\b/.test(meta)) {
				node.properties['data-pg'] = 'true';
			}
		},
	};
}

// You can customize Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
	dir: 'content/docs',
	docs: {
		schema: pageSchema,
		postprocess: {
			includeProcessedMarkdown: true,
		},
	},
	meta: {
		schema: metaSchema,
	},
});

export default defineConfig({
	mdxOptions: {
		rehypeCodeOptions: {
			themes: {
				light: 'horizon-bright',
				dark: 'dracula',
			},
			transformers: [
				...(rehypeCodeDefaultOptions.transformers ?? []),
				transformerTwoslash(),
				transformerPlayground(),
			],
		},
	},
});
