import { getGithubLastEdit } from 'fumadocs-core/content/github';
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
	MarkdownCopyButton,
	ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { formatDate, getTimeZoneDetails } from 'nhb-toolbox';
import { getMDXComponents } from '@/components/mdx';
import { gitConfig } from '@/lib/shared';
import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	const MDX = page.data.body;
	const markdownUrl = getPageMarkdownUrl(page).url;

	const lastModified = await getGithubLastEdit({
		owner: gitConfig.user,
		repo: gitConfig.repo,
		path: `docs/content/docs/${page.path}`,
		token: `Bearer ${process.env.GIT_TOKEN}`,
	});

	return (
		<DocsPage
			toc={page.data.toc}
			full={page.data.full}
			tableOfContent={{ style: 'clerk' }}
			tableOfContentPopover={{ style: 'clerk' }}
		>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription className="mb-0">{page.data.description}</DocsDescription>
			<div className="flex flex-row gap-2 items-center border-b pb-6">
				<MarkdownCopyButton markdownUrl={markdownUrl} />
				<ViewOptionsPopover
					markdownUrl={markdownUrl}
					githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/docs/content/docs/${page.path}`}
				/>
			</div>
			<DocsBody>
				<MDX
					components={getMDXComponents({
						// this allows you to link to other pages with relative file paths
						a: createRelativeLink(source, page),
					})}
				/>
			</DocsBody>
			{lastModified && (
				<p className="text-sm text-fd-muted-foreground text-right">
					{`Last updated: ${formatDate({
						date: lastModified,
						format: 'dd, mmm DD, YYYY hh:mm:ssa',
					})} (${getTimeZoneDetails().tzNameLong})`}
				</p>
			)}
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(
	props: PageProps<'/docs/[[...slug]]'>
): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);
	if (!page) notFound();

	return {
		title: page.data.title,
		description: page.data.description,
		openGraph: {
			images: getPageImage(page).url,
		},
	};
}
