'use client';

import Editor, { useMonaco } from '@monaco-editor/react';
import * as ChronosDate from 'chronos-date';
import * as Constants from 'chronos-date/constants';
import * as Guards from 'chronos-date/guards';
import * as BanglaPlugin from 'chronos-date/plugins/banglaPlugin';
import * as BusinessPlugin from 'chronos-date/plugins/businessPlugin';
import * as DateRangePlugin from 'chronos-date/plugins/dateRangePlugin';
import * as DayPartPlugin from 'chronos-date/plugins/dayPartPlugin';
import * as DurationPlugin from 'chronos-date/plugins/durationPlugin';
import * as FromNowPlugin from 'chronos-date/plugins/fromNowPlugin';
import * as GreetingPlugin from 'chronos-date/plugins/greetingPlugin';
import * as PalindromePlugin from 'chronos-date/plugins/palindromePlugin';
import * as RelativeTimePlugin from 'chronos-date/plugins/relativeTimePlugin';
import * as RoundPlugin from 'chronos-date/plugins/roundPlugin';
import * as SeasonPlugin from 'chronos-date/plugins/seasonPlugin';
import * as TimeZonePlugin from 'chronos-date/plugins/timeZonePlugin';
import * as ZodiacPlugin from 'chronos-date/plugins/zodiacPlugin';
import * as Types from 'chronos-date/types';
import * as Utils from 'chronos-date/utils';
import { CheckIcon, CopyIcon, PlayIcon, RefreshCcwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { transform } from 'sucrase';
import { Copy } from '@/components/Copy';
import generatedTypes from '@/lib/generated-types.json';

type ChronosModule = 'chronos-date' | `chronos-date/${string}`;

const MODULES: Record<ChronosModule, unknown> = {
	'chronos-date': ChronosDate,
	'chronos-date/types': Types,
	'chronos-date/utils': Utils,
	'chronos-date/guards': Guards,
	'chronos-date/constants': Constants,
	'chronos-date/plugins/banglaPlugin': BanglaPlugin,
	'chronos-date/plugins/businessPlugin': BusinessPlugin,
	'chronos-date/plugins/dateRangePlugin': DateRangePlugin,
	'chronos-date/plugins/dayPartPlugin': DayPartPlugin,
	'chronos-date/plugins/durationPlugin': DurationPlugin,
	'chronos-date/plugins/fromNowPlugin': FromNowPlugin,
	'chronos-date/plugins/greetingPlugin': GreetingPlugin,
	'chronos-date/plugins/palindromePlugin': PalindromePlugin,
	'chronos-date/plugins/relativeTimePlugin': RelativeTimePlugin,
	'chronos-date/plugins/roundPlugin': RoundPlugin,
	'chronos-date/plugins/seasonPlugin': SeasonPlugin,
	'chronos-date/plugins/timeZonePlugin': TimeZonePlugin,
	'chronos-date/plugins/zodiacPlugin': ZodiacPlugin,
};

interface PlaygroundProps {
	code: string;
}

export function Playground({ code: initialCode }: PlaygroundProps) {
	const [code, setCode] = useState(initialCode);
	const [outputs, setOutputs] = useState<unknown[]>([]);
	const [error, setError] = useState<string | null>(null);
	const monaco = useMonaco();

	// Load chronos-date types into Monaco for IntelliSense
	useEffect(() => {
		if (monaco) {
			// Configure typescript compiler options
			monaco.typescript.typescriptDefaults.setCompilerOptions({
				target: monaco.typescript.ScriptTarget.ESNext,
				allowNonTsExtensions: true,
				moduleResolution: monaco.typescript.ModuleResolutionKind.NodeJs,
				module: monaco.typescript.ModuleKind.CommonJS,
				esModuleInterop: true,
				noEmit: true,
			});

			monaco.typescript.typescriptDefaults.setExtraLibs(generatedTypes);
		}
	}, [monaco]);

	const runCode = () => {
		setError(null);
		setOutputs([]);

		const results: unknown[] = [];
		const customConsole = {
			log: (...args: unknown[]) => {
				results.push(...args);
			},
			error: (...args: unknown[]) => {
				results.push(...args);
			},
			warn: (...args: unknown[]) => {
				results.push(...args);
			},
			info: (...args: unknown[]) => {
				results.push(...args);
			},
		};

		const customRequire = (pkgName: ChronosModule) => {
			if (MODULES[pkgName]) return MODULES[pkgName];
			throw new Error(`Cannot resolve module '${pkgName}'`);
		};

		try {
			// Transpile the TS code to commonjs using sucrase
			const transpiled = transform(code, {
				transforms: ['typescript', 'imports'],
			}).code;

			// Wrap execution in a function
			const executor = new Function(
				'require',
				'console',
				'Chronos',
				'chronos',
				transpiled
			);
			executor(customRequire, customConsole, ChronosDate.Chronos, ChronosDate.chronos);

			setOutputs(results);
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : String(err));
		}
	};

	return (
		<div className="my-6 rounded-xl overflow-hidden border border-fd-border bg-[#1e1e2e] shadow-sm flex flex-col">
			<div className="flex items-center justify-between px-4 py-2 border-b border-fd-border/50 bg-[#1e1e2e]">
				<div className="flex gap-1.5 items-center">
					<div className="size-3 rounded-full bg-red-500/80" />
					<div className="size-3 rounded-full bg-yellow-500/80" />
					<div className="size-3 rounded-full bg-green-500/80" />
					<span className="text-xs text-fd-muted-foreground ml-3 font-mono">
						playground.ts
					</span>
				</div>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => setCode(initialCode)}
						className="p-1.5 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent rounded-md transition-colors"
						title="Reset code"
					>
						<RefreshCcwIcon className="size-3.5" />
					</button>
					<Copy
						label={<CopyIcon className="size-3.5" />}
						text={code}
						afterCopy={<CheckIcon className="size-3.5" />}
						message="Code block copied successfully!"
					/>
					<button
						type="button"
						onClick={runCode}
						className="flex items-center gap-1.5 px-3 py-1 dark:bg-fd-primary/10 bg-fd-background text-fd-foreground hover:bg-fd-muted-foreground rounded-md transition-colors text-xs font-medium"
					>
						<PlayIcon className="size-3.5 fill-current" />
						Run
					</button>
				</div>
			</div>

			<div className="min-h-30 relative">
				<Editor
					height="240px"
					defaultLanguage="typescript"
					theme="vs-dark"
					value={code}
					onChange={(val) => setCode(val || '')}
					options={{
						minimap: { enabled: false },
						fontSize: 14,
						fontFamily: 'var(--font-mono)',
						lineHeight: 1.6,
						padding: { top: 16, bottom: 16 },
						scrollBeyondLastLine: false,
						overviewRulerLanes: 0,
						hideCursorInOverviewRuler: true,
						scrollbar: {
							vertical: 'hidden',
							horizontal: 'hidden',
						},
						renderLineHighlight: 'none',
					}}
				/>
			</div>

			{(outputs.length > 0 || error) && (
				<div className="border-t border-fd-border/50 bg-fd-background/50 p-4 font-mono text-sm">
					{error ? (
						<div className="text-red-400">Error: {error}</div>
					) : (
						<div className="flex flex-col gap-2">
							{outputs.map((output, i) => (
								<div key={i} className="flex gap-3 text-fd-foreground">
									<span className="text-fd-muted-foreground select-none">
										›
									</span>
									<span className="wrap-break-word">
										{typeof output === 'object'
											? JSON.stringify(output, null, 2)
											: String(output)}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
