import * as Twoslash from 'fumadocs-twoslash/ui';
import * as TabsComponents from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { isNumber, isString, isValidArray } from 'nhb-toolbox';
import type { Maybe } from 'nhb-toolbox/types';
import type { ReactElement, ReactNode } from 'react';
import { Copy } from '@/components/Copy';
import { Playground } from '@/components/Playground';
import type { CodeChildProps, PreProps } from '@/types/index';

function isNodeCodeChild(node: unknown): node is ReactElement<CodeChildProps> {
	return typeof node === 'object' && node !== null && 'props' in node;
}

/** Recursively extracts raw text from a React node tree (Shiki spans → plain string). */
function extractText(node: ReactNode): string {
	if (isString(node) || isNumber(node)) return String(node);
	if (isValidArray<ReactNode>(node)) return node.map(extractText).join('');
	if (isNodeCodeChild(node)) return extractText(node.props.children);

	return '';
}

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		...Twoslash,
		...TabsComponents,
		Playground,
		Copy,
		pre: (props: PreProps) => {
			const child = props.children;

			// Check for playground trigger: `runnable`, `pg`, or `data-pg` in meta/props/className
			const hasTrigger = (src: Maybe<CodeChildProps>) =>
				src?.runnable ||
				src?.className?.includes('runnable') ||
				src?.['data-runnable'] ||
				src?.['data-pg'] ||
				src?.meta?.includes('runnable') ||
				src?.meta?.includes('pg');

			const childProps: Maybe<CodeChildProps> = isNodeCodeChild(child)
				? child.props
				: undefined;

			const isRunnable = hasTrigger(props) || hasTrigger(childProps);

			let rawCode = '';
			if (childProps) {
				rawCode = extractText(childProps.children);
			} else if (isString(child)) {
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
