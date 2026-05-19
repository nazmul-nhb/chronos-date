import pkg from 'chronos-date/package.json';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import type { Route } from 'next';
import Link from 'next/link';
import type { SpecialCharacter } from 'nhb-toolbox/string/types';
import type { Key, ReactNode } from 'react';

export default function HomePage() {
	return (
		<main className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
			<div className="max-w-3xl space-y-8">
				<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
					<span className="relative flex size-2">
						<span className="animate-ping absolute inline-flex size-full rounded-full bg-amber-400 opacity-75" />
						<span className="relative inline-flex rounded-full size-2 bg-amber-500" />
					</span>
					Latest: v{pkg.version}
				</div>

				<h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
					<span className="bg-linear-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
						Chronos
					</span>
				</h1>

				<p className="text-xl text-fd-muted-foreground max-w-2xl mx-auto leading-relaxed">
					A flexible, plugin-driven date-time library for any JavaScript and
					TypeScript environment. Lightweight, immutable, and fully tree-shakable.
				</p>

				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<Link
						href={'/docs' as Route}
						className="inline-flex items-center px-6 py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 hover:scale-105"
					>
						Get Started →
					</Link>
					{/* <Link
						href="https://www.npmjs.com/package/chronos-date"
						className="inline-flex items-center px-6 py-3 rounded-xl border border-fd-border text-fd-foreground font-semibold hover:bg-fd-accent transition-colors"
						target="_blank"
						rel="noopener noreferrer"
					>
						Find in NPM <ExternalLink />
					</Link> */}
					<DynamicCodeBlock
						options={{
							themes: {
								light: 'dracula-soft',
								dark: 'dracula',
							},
						}}
						lang="shell"
						code="npm install chronos-date"
					/>
				</div>

				<div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
					{features.map((feature) => (
						<FeatureCard {...feature} />
					))}
				</div>
			</div>
		</main>
	);
}

type FeatureProps = {
	icon: SpecialCharacter;
	title: ReactNode;
	description: ReactNode;
};

function FeatureCard({ icon, title, description }: FeatureProps) {
	return (
		<div className="p-4 rounded-xl border border-fd-border bg-fd-card">
			<div className="text-amber-500 font-bold text-lg mb-1">{icon}</div>
			<h3 className="font-semibold text-fd-foreground mb-1">{title}</h3>
			<p className="text-sm text-fd-muted-foreground">{description}</p>
		</div>
	);
}

const features: Array<{ key: Key } & FeatureProps> = [
	{
		key: 1,
		icon: '⚡',
		title: 'Lightweight',
		description: 'Tree-shakable with zero runtime dependencies. Only ship what you use.',
	},
	{
		key: 2,
		icon: '🔌',
		title: 'Plugin System',
		description: 'Extend with timezone, zodiac, seasons, business days, and more.',
	},
	{
		key: 3,
		icon: '🛡️',
		title: 'Type-Safe',
		description: 'Full TypeScript support with precise types and rich IntelliSense.',
	},
];
