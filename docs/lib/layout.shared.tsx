import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { SiNpm } from 'react-icons/si';
import { GithubStars } from '@/components/github-stars';
import { appLogo, appName, gitConfig } from '@/lib/shared';

export function baseOptions(): BaseLayoutProps {
	const repoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

	return {
		nav: {
			enabled: true,
			transparentMode: 'always',

			title: (
				<div className="flex items-center gap-2">
					<Image
						className="w-9 aspect-5/4"
						src={appLogo}
						alt={appName}
						quality={100}
						width={96}
						height={96}
					/>

					<span className="font-bold text-xl">{appName}</span>
				</div>
			),
		},
		links: [
			{
				text: 'Documentation',
				url: '/docs',
				active: 'nested-url',
			},
			{
				type: 'icon',
				text: 'NPM',
				icon: <SiNpm />,
				url: 'https://www.npmjs.com/package/chronos-date',
			},
			{
				type: 'icon',
				text: 'Stars',
				icon: <GithubStars />,
				url: repoUrl,
			},
		],
		// githubUrl: repoUrl,
		themeSwitch: {
			mode: 'light-dark-system',
			defaultValue: 'dark',
		},
	};
}
