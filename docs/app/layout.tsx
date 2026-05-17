import './global.css';

import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { appLogo, appName } from '../lib/shared';

const inter = Inter({
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: {
		absolute: `${appName} - Elegant Date-Time Library`,
		default: `${appName} Documentation`,
		template: `%s » ${appName} Documentation`,
	},
	// metadataBase: new URL(siteConfig.baseUrl),
	// description: siteConfig.description,
	// keywords: [...siteConfig.keywords, ...Object.values(siteConfig.links)],
	// authors: [{ name: siteConfig.name, url: siteConfig.baseUrl }],
	// alternates: { canonical: buildCanonicalUrl('/') },
	icons: {
		icon: appLogo,
		shortcut: appLogo,
	},
	// openGraph: {
	// 	title: {
	// 		absolute: `${siteConfig.name} - Programmer & Full-Stack Web Developer`,
	// 		default: siteConfig.name,
	// 		template: `%s » ${siteConfig.name}`,
	// 	},
	// 	description: siteConfig.description,
	// 	url: buildCanonicalUrl('/'),
	// 	siteName: siteConfig.name,
	// 	type: 'website',
	// },
	// verification: {
	// 	google: ENV.google.gscVerificationId,
	// },
};

export default function Layout({ children }: LayoutProps<'/'>) {
	return (
		<html lang="en" className={inter.className} suppressHydrationWarning>
			<body className="flex flex-col min-h-screen">
				<RootProvider>{children}</RootProvider>
			</body>
		</html>
	);
}
