import { DAYS, INTERNALS, MS_PER_DAY } from 'src/constants/basic';
import type {
	ChronosPlugin,
	DateRangeResult,
	DatesInRangeOptions,
	RangedChronosFormat,
	RangeWithDates,
	RelativeDateRange,
} from 'src/types';
import { toPascalCase } from 'toolbox-x/change-case';
import { isNumber, isPascalCase, isValidArray } from 'toolbox-x/guards';

declare module 'chronos-date' {
	interface Chronos {
		/**
		 * @instance Returns an array of ISO date-time strings within a specific date range.
		 *
		 * - If the input is a fixed range (`from` and `to`), it includes all dates between them.
		 * - If the input is a relative range (`span` and `unit`), it starts from current date and goes forward.
		 * - If `skipDays` are provided, matching weekdays are excluded from the result.
		 *
		 * @param options - Configuration for the date range. Accepts a fixed ({@link RangeWithDates}) format.
		 * @returns Array of ISO date-time strings in either local or UTC format or `Chronos` instances when format is `'chronos'`,
		 * 			excluding any skipped weekdays if specified.
		 *
		 * - Please refer to {@link https://chronos-date.vercel.app/docs/plugins/date-range-plugin#getdatesinrange docs} for details.
		 *
		 * @remarks
		 * - When using `Chronos` instances for `from` and/or `to`, ensure both are created in the **same time zone** to avoid mismatched boundaries.
		 * - Mixing zones may shift the interpreted start or end by several hours, which can cause the range to include or exclude incorrect weekdays.
		 *
		 * @example
		 * // Using a fixed date range:
		 * new Chronos().getDatesInRange({ from: '2025-01-01', to: '2025-01-03' });
		 * // → ['2025-01-01T00:00:00+06:00', '2025-01-02T00:00:00+06:00', '2025-01-03T00:00:00+06:00']
		 *
		 * @example
		 * // Using a relative date range with skipDays:
		 * new Chronos().getDatesInRange({ span: 7, unit: 'day', skipDays: ['Saturday', 'Sunday'] });
		 * // → Array of 7 dates excluding weekends
		 *
		 * @example
		 * // UTC format:
		 * new Chronos().getDatesInRange({ span: 2, unit: 'day', format: 'utc' });
		 * // → ['2025-06-16T00:00:00.000Z', '2025-06-17T00:00:00.000Z']
		 */
		getDatesInRange<F extends RangedChronosFormat = 'local'>(
			options?: RangeWithDates<F>
		): DateRangeResult<F>;

		/**
		 * @instance Returns an array of ISO date-time strings within a specific date range.
		 *
		 * - If the input is a fixed range (`from` and `to`), it includes all dates between them.
		 * - If the input is a relative range (`span` and `unit`), it starts from current date and goes forward.
		 * - If `skipDays` are provided, matching weekdays are excluded from the result.
		 *
		 * @param options - Configuration for the date range. Accepts a relative ({@link RelativeDateRange}) format.
		 * @returns Array of ISO date-time strings in either local or UTC format or `Chronos` instances when format is `'chronos'`,
		 * 			excluding any skipped weekdays if specified.
		 *
		 * - Please refer to {@link https://chronos-date.vercel.app/docs/plugins/date-range-plugin#getdatesinrange docs} for details.
		 *
		 * @example
		 * // Using a relative date range with skipDays:
		 * new Chronos().getDatesInRange({ span: 7, unit: 'day', skipDays: ['Saturday', 'Sunday'] });
		 * // → Array of 7 dates excluding weekends
		 *
		 * @example
		 * // UTC format:
		 * new Chronos().getDatesInRange({ span: 2, unit: 'day', format: 'utc' });
		 * // → ['2025-06-16T00:00:00.000Z', '2025-06-17T00:00:00.000Z']
		 *
		 * @example
		 * // Using a fixed date range:
		 * new Chronos().getDatesInRange({ from: '2025-01-01', to: '2025-01-03' });
		 * // → ['2025-01-01T00:00:00+06:00', '2025-01-02T00:00:00+06:00', '2025-01-03T00:00:00+06:00']
		 */
		getDatesInRange<F extends RangedChronosFormat = 'local'>(
			options?: RelativeDateRange<F>
		): DateRangeResult<F>;
	}
}

/** * Plugin to inject `getDatesInRange` related method */
export const dateRangePlugin: ChronosPlugin = ($Chronos) => {
	const { internalDate: $Date, cast, withOrigin, offset } = $Chronos[INTERNALS];

	$Chronos.prototype.getDatesInRange = function <F extends RangedChronosFormat = 'local'>(
		options: DatesInRangeOptions<F>
	) {
		let startDate = this.clone(),
			endDate = this.addWeeks(4);

		const { format = 'local', onlyDays, skipDays, roundDate = false } = options ?? {};

		if (options) {
			if ('from' in options || 'to' in options) {
				if (options?.from) startDate = cast(options.from);
				if (options?.to) endDate = cast(options.to);
			} else if ('span' in options || 'unit' in options) {
				const { span = 4, unit = 'week' } = options;
				endDate = startDate.add(span, unit);
			}
		}

		if (roundDate) {
			startDate = startDate.startOf('day');
			endDate = endDate.startOf('day');
		}

		const skippedDays = isValidArray(onlyDays)
			? onlyDays
			: isValidArray(skipDays)
				? skipDays
				: [];

		const skipSet = new Set<number>(
			skippedDays.map((day) =>
				isNumber(day) ? day : DAYS.indexOf(isPascalCase(day) ? day : toPascalCase(day))
			)
		);

		const dates: unknown[] = [];

		const startTime = $Date(startDate).getTime();
		const endTime = $Date(endDate).getTime();
		const step = (startTime <= endTime ? 1 : -1) * MS_PER_DAY;
		const totalDays = Math.floor(Math.abs(endTime - startTime) / MS_PER_DAY);

		for (let i = 0; i <= totalDays; i++) {
			const ts = startTime + i * step;
			const wDay = new Date(ts).getDay(); // temporary, just for weekday

			const include = isValidArray(onlyDays) ? skipSet.has(wDay) : !skipSet.has(wDay);

			if (include) {
				const chr = withOrigin(
					new $Chronos(ts),
					'clone',
					offset(this),
					startDate.timeZoneName,
					startDate.timeZoneId,
					startDate.$tzTracker
				);

				const $format = format.toLowerCase<RangedChronosFormat>();

				if ($format === 'chronos') {
					dates.push(chr);
				} else {
					dates.push($format === 'utc' ? chr.toISOString() : chr.toLocalISOString());
				}
			}
		}

		return dates as DateRangeResult<F>;
	};
};
