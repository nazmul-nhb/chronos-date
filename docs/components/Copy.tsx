'use client';

import { useTheme } from 'fumadocs-ui/provider/base';
import { useCopyText } from 'nhb-hooks';
import { Fragment } from 'react/jsx-runtime';
import { Toaster, toast } from 'react-hot-toast';

interface Props {
	/** * The string content to be copied. */
	text: string;
	/** * Text content to display in place of original content after successful copy. */
	afterCopy?: string;
	/** * Text content to display for the toast message. */
	message?: string;
}

export function Copy({ text, afterCopy = '✅', message = 'Token Copied!' }: Props) {
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
				style={{
					background: 'none',
					border: 'none',
					color: resolvedTheme === 'dark' ? '#7cc2ff' : '#228be6',
					cursor: 'pointer',
					padding: 0,
					fontFamily: 'monospace',
				}}
			>
				{copiedText ? afterCopy : text}
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
