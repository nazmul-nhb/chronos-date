import type { HTMLAttributes, ReactNode } from 'react';
import type { getMDXComponents } from '@/components/mdx';

/** A generic type that represents either a value of type T or undefined. */
export type Maybe<T> = T | undefined;

/** Extra attributes that Shiki/Fumadocs attach to `<pre>` and `<code>` elements. */
export interface ShikiProps {
	runnable?: boolean;
	'data-runnable'?: string;
	'data-pg'?: string;
	meta?: string;
}

/** Props for the `<pre>` element including Shiki extras. */
export type PreProps = HTMLAttributes<HTMLPreElement> & ShikiProps;

/** Props that the inner `<code>` child element may carry. */
export type CodeChildProps = ShikiProps & { children?: ReactNode; className?: string };

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
