import * as Twoslash from 'fumadocs-twoslash/ui';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Copy } from './Copy';
import { Playground } from './Playground';

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		...Twoslash,
		...TabsComponents,
		Playground,
		Copy,
		// biome-ignore lint/suspicious/noExplicitAny: need any here
		pre: (props: any) => {
			let isRunnable =
				props.runnable ||
				props.className?.includes('runnable') ||
				props['data-runnable'];

			let rawCode = '';
			const child = props.children;
			if (child?.props) {
				if (!isRunnable) {
					isRunnable =
						child.props.runnable ||
						child.props.className?.includes('runnable') ||
						child.props['data-runnable'] ||
						child.props.meta?.includes('runnable');
				}

				// Extract text from potentially complex React elements (spans for syntax highlighting)
				// biome-ignore lint/suspicious/noExplicitAny: need any here
				const extractText = (node: any): string => {
					if (typeof node === 'string' || typeof node === 'number')
						return String(node);
					if (Array.isArray(node)) return node.map(extractText).join('');
					if (node?.props?.children) return extractText(node.props.children);
					return '';
				};
				rawCode = extractText(child.props.children);
			} else if (typeof child === 'string') {
				rawCode = child;
			}

			if (isRunnable && rawCode) {
				return <Playground code={rawCode.trim()} />;
			}

			return <defaultMdxComponents.pre {...props} />;
		},
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
