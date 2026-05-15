import path from 'node:path';
import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	serverExternalPackages: ['typescript', 'twoslash'],
	turbopack: {
		root: path.resolve('./..'),
	},
};

export default withMDX(config);
