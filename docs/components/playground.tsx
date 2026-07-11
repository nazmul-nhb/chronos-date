'use client';

import Editor, { type OnMount, useMonaco } from '@monaco-editor/react';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { CheckIcon, CopyIcon, PlayIcon, RefreshCcwIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { transform } from 'sucrase';
import { isArray, isObject } from 'toolbox-x/guards';
import { Copy } from '@/components/copy';
import { ChronosDate, type ChronosModule, MODULES } from '@/lib/.generated-modules';
import generatedTypes from '@/lib/.generated-types.json';

interface PlaygroundProps {
	code: string;
}

export function Playground({ code: initialCode }: PlaygroundProps) {
	const monaco = useMonaco();
	const [code, setCode] = useState(initialCode);
	const [outputs, setOutputs] = useState<unknown[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [editorHeight, setEditorHeight] = useState(256);

	const editorRef = useRef<Parameters<OnMount>[0]>(null);

	// Each playground instance needs a unique Monaco model path.
	// Without this, multiple playgrounds on the same page share a single
	// model and all display the first block's content.
	const id = useId();

	const modelPath = `file:///playground-${id}.ts`;

	const updateEditorHeight = () => {
		const editor = editorRef.current;

		if (!editor) return;

		const contentHeight = editor.getContentHeight();

		setEditorHeight(Math.min(320, contentHeight));

		editor.layout();
	};

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

		const customConsole = {
			log: (...args: unknown[]) => {
				setOutputs((prev) => [...prev, ...args]);
			},
			error: (...args: unknown[]) => {
				setOutputs((prev) => [...prev, ...args]);
			},
			warn: (...args: unknown[]) => {
				setOutputs((prev) => [...prev, ...args]);
			},
			info: (...args: unknown[]) => {
				setOutputs((prev) => [...prev, ...args]);
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
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		}
	};

	return (
		<div className="my-6 rounded-xl overflow-visible border border-fd-border bg-[#1e1e2e] shadow-sm flex flex-col">
			<div className="flex items-center justify-between px-4 py-2 border-b border-fd-border/50 bg-[#1e1e2e]">
				<div className="flex gap-1.5 items-center">
					<div className="size-3 rounded-full bg-red-500/80" />
					<div className="size-3 rounded-full bg-yellow-500/80" />
					<div className="size-3 rounded-full bg-green-500/80" />
					<span className="text-xs text-fd-muted-foreground ml-3 font-mono">
						playground.ts
					</span>
				</div>
				<div className="flex gap-1">
					<button
						type="button"
						onClick={() => setCode(initialCode)}
						className="p-1.5 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent rounded-md transition-colors"
						title="Reset Code"
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
						className="flex items-center gap-1.5 px-2 py-1 dark:bg-fd-primary/10 bg-fd-background/75 text-fd-foreground hover:bg-fd-background/50 rounded-md transition-colors text-xs font-medium"
					>
						<PlayIcon className="size-3.5 fill-current" />
						Run
					</button>
				</div>
			</div>

			<div
				className="relative overflow-visible max-h-80"
				style={{ height: `${editorHeight}px` }}
			>
				<Editor
					height={`${editorHeight}px`}
					defaultLanguage="typescript"
					path={modelPath}
					loading={
						<div className="size-full flex flex-col gap-2.5 p-4 bg-[#1e1e2e]">
							<div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
							<div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
							<div className="h-4 w-2/5 bg-white/5 rounded animate-pulse" />
							<div className="h-4 w-4/5 bg-white/5 rounded animate-pulse" />
							<div className="h-4 w-1/3 bg-white/5 rounded animate-pulse" />
						</div>
					}
					theme="vs-dark"
					value={code}
					onChange={(val) => setCode(val || '')}
					onMount={(editor) => {
						editorRef.current = editor;

						updateEditorHeight();

						editor.onDidContentSizeChange(() => {
							updateEditorHeight();
						});
					}}
					options={{
						automaticLayout: true,
						minimap: { enabled: false },
						fontSize: 13.5,
						wordWrap: 'on',
						wordWrapColumn: 96,
						fontFamily: 'var(--font-mono)',
						lineHeight: 1.6,
						padding: { top: 16, bottom: 16 },
						scrollBeyondLastLine: false,
						overviewRulerLanes: 0,
						renderLineHighlight: 'none',
						scrollbar: {
							verticalScrollbarSize: 6,
							horizontalScrollbarSize: 6,
						},
						// allowOverflow: false,
						// hideCursorInOverviewRuler: true,
						// fixedOverflowWidgets: true,
						// overflowWidgetsDomNode: document.body,
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
								<DynamicCodeBlock
									key={i}
									wrapInSuspense
									options={{
										themes: {
											light: 'horizon-bright',
											dark: 'dracula',
										},
										structure: 'classic',
										mergeWhitespaces: 'never',
									}}
									lang={isObject(output) || isArray(output) ? 'json' : 'text'}
									code={
										isObject(output) || isArray(output)
											? JSON.stringify(output, null, 2)
											: String(output)
									}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
