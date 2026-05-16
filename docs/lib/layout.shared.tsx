import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { appLogo, appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: (
				<div className="flex items-center gap-2">
					<Image src={appLogo} alt={appName} quality={100} width={28} height={28} />

					<span className="font-semibold"> {appName}</span>
				</div>
			),
			transparentMode: 'always',
		},
		links: [
			{
				text: 'Documentation',
				url: '/docs',
				active: 'nested-url',
			},
		],
		themeSwitch: {
			mode: 'light-dark-system',
			defaultValue: 'system',
		},
		githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
	};
}
