import Link from 'next/link';

export default function HomePage() {
	return (
		<main className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
			<div className="max-w-3xl space-y-8">
				{/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          v1.1.0 — Now with Plugin System
        </div> */}

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
						href="/docs"
						className="inline-flex items-center px-6 py-3 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 hover:scale-105"
					>
						Get Started →
					</Link>
					<Link
						href="https://www.npmjs.com/package/chronos-date"
						className="inline-flex items-center px-6 py-3 rounded-xl border border-fd-border text-fd-foreground font-semibold hover:bg-fd-accent transition-colors"
						target="_blank"
						rel="noopener noreferrer"
					>
						npm install chronos-date
					</Link>
				</div>

				<div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
					<div className="p-4 rounded-xl border border-fd-border bg-fd-card">
						<div className="text-amber-500 font-bold text-lg mb-1">⚡</div>
						<h3 className="font-semibold text-fd-foreground mb-1">Lightweight</h3>
						<p className="text-sm text-fd-muted-foreground">
							Tree-shakable with zero runtime dependencies. Only ship what you
							use.
						</p>
					</div>
					<div className="p-4 rounded-xl border border-fd-border bg-fd-card">
						<div className="text-amber-500 font-bold text-lg mb-1">🔌</div>
						<h3 className="font-semibold text-fd-foreground mb-1">Plugin System</h3>
						<p className="text-sm text-fd-muted-foreground">
							Extend with timezone, zodiac, seasons, business days, and more.
						</p>
					</div>
					<div className="p-4 rounded-xl border border-fd-border bg-fd-card">
						<div className="text-amber-500 font-bold text-lg mb-1">🛡️</div>
						<h3 className="font-semibold text-fd-foreground mb-1">Type-Safe</h3>
						<p className="text-sm text-fd-muted-foreground">
							Full TypeScript support with precise types and rich IntelliSense.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
