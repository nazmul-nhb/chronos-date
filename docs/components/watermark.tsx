import type * as CSS from 'csstype';
import { Fragment } from 'react/jsx-runtime';
import type { Maybe } from 'toolbox-x/types';
import { cn } from '@/lib/cn';

type WatermarkProps = {
	// opacity?: Enumerate<101>;
	logo: Maybe<string>;
	cardShadow?: boolean;
	grayScale?: boolean;
	children: React.ReactNode;
	bgSize?: CSS.Properties['backgroundSize'];
	bgPosition?: CSS.Properties['backgroundPosition'];
};

export function WatermarkContent({
	logo,
	// opacity = 25,
	cardShadow = true,
	grayScale = false,
	children,
	bgPosition = 'center',
	bgSize = 'contain',
}: WatermarkProps) {
	return (
		<Fragment>
			{logo && (
				<div
					aria-hidden="true"
					className={cn(
						`pointer-events-none absolute inset-x-0 top-2 bottom-2 right-2`,
						`opacity-10 dark:opacity-5`,
						grayScale && 'grayscale'
					)}
					style={{
						backgroundImage: `url(${logo})`,
						backgroundSize: bgSize,
						backgroundPosition: bgPosition,
						// backgroundOrigin: 'content-box',
						backgroundRepeat: 'no-repeat',
						backgroundAttachment: 'local',
					}}
				/>
			)}
			<div
				className={cn(
					'absolute inset-0 from-transparent',
					cardShadow ? 'bg-linear-to-l from-50% to-card/20 dark:to-card/30' : ''
				)}
			/>
			<div className="relative z-10">{children}</div>
		</Fragment>
	);
}
