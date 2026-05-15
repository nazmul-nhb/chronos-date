'use client';

import { useTheme } from 'fumadocs-ui/provider/base';
import { useCopyText } from 'nhb-hooks';
import type { ReactNode } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { Toaster, toast } from 'react-hot-toast';

interface Props {
	/** * Content to display as trigger for copying. */
	label?: ReactNode;
	/** * The string content to be copied. */
	text: string;
	/** * Content to display in place of original content after successful copy. */
	afterCopy?: ReactNode;
	/** * Text content to display for the toast message. */
	message?: string;
}

export function Copy({ text, label, afterCopy = '✅', message = 'Token Copied!' }: Props) {
	const { resolvedTheme } = useTheme();

	const { copiedText, copyToClipboard } = useCopyText({
		onSuccess: (msg) => toast.success(msg),
		resetTimeOut: 1500,
	});

	return (
		<Fragment>
			<button
				type="button"
				onClick={() => copyToClipboard(text, message)}
				className="bg-transparent border-none font-mono p-1.5 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent rounded-md transition-colors"
				title="Copy"
			>
				{copiedText ? afterCopy : label || text}
			</button>
			<Toaster
				toastOptions={{
					...(resolvedTheme === 'dark' && {
						success: { style: { color: 'white', background: 'black' } },
					}),
					...(resolvedTheme === 'dark' && {
						iconTheme: { primary: 'teal', secondary: 'dark' },
					}),
				}}
				position="top-center"
			/>
		</Fragment>
	);
}
