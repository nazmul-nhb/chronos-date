'use client';

import { useEffect, useState } from 'react';
import type { Maybe } from 'toolbox-x/types';

/**
 * Smoothly animates a number change (count-up / count-down)
 */
export function useCountUp(value: Maybe<number>, duration = 2500): number {
	const [display, setDisplay] = useState(value ?? 0);

	useEffect(() => {
		let start: number | null = null;
		const from = display;
		const diff = (value ?? 0) - from;

		const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

		const step = (timestamp: number) => {
			if (!start) start = timestamp;

			const progress = Math.min((timestamp - start) / duration, 1);
			const eased = easeOutCubic(progress);

			setDisplay(Math.round(from + diff * eased));

			if (progress < 1) requestAnimationFrame(step);
		};

		requestAnimationFrame(step);
	}, [value, display, duration]);

	return display;
}
