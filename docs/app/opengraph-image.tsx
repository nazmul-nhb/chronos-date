import { generate as DefaultImage } from 'fumadocs-ui/og';
import { ImageResponse } from 'next/og';
import { appLogo, appName, ogImageSize, titleDescription } from '@/lib/shared';

export const contentType = 'image/png';

export default async function Image() {
	return new ImageResponse(
		<DefaultImage
			title={titleDescription.title.default}
			description={titleDescription.description}
			site={`${appName} Documentation`}
			icon={
				<img
					src={`https://chronos.nazmul-nhb.dev/${appLogo}`}
					alt={appName}
					width={80}
				/>
			}
		/>,
		ogImageSize
	);
}
