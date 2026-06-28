import { DATE_UNIT_SETTERS, DAYS, MS_PER_DAY } from 'src/constants/basic';
import type {
	DateArgs,
	RelativeRangeForDate,
	SpanRangeForDate,
	TimeUnit,
	UnitWithValue,
} from 'src/types/date-time';
import { _dateArgsToDate, _throwInvalidDate } from 'src/utils/helpers';
import { normalizeNumber } from 'toolbox-x';
import { toPascalCase } from 'toolbox-x/change-case';
import { isNumber, isObjectWithKeys, isPascalCase, isValidArray } from 'toolbox-x/guards';
import type { Maybe, Numeric } from 'toolbox-x/types';
import type { NumberRange } from 'toolbox-x/types/number';

/**
 * * A function that takes a date and adds units to it.
 *
 * @param date Can be a Date object, timestamp, or date string.
 * @param units Units to add to the date.
 * @returns Valid Date object with the added units.
 *
 * @throws - {@link TypeError} If the provided date is invalid or units/values are invalid.
 *
 * @remarks
 * - This function creates a {@link Date new Date} object and does not modify the original {@link Date} object if provided one.
 * - If `date` is `undefined`, it will use the current date and time.
 *
 * @example
 * ```ts
 * import { addDate } from 'chronos-date/utils';
 *
 * const final = addDate('2026-06-15T01:39:59.288Z', { day: 1, hour: '7' });
 *
 * console.log(final); // new Date('2026-06-16T08:39:59.288Z')
 * ```
 */
export function addDate(date: Maybe<DateArgs>, units: UnitWithValue): Date {
	const expected = _dateArgsToDate(date);

	_throwInvalidDate(expected);

	for (const [unit, value] of Object.entries(units) as [TimeUnit, Numeric][]) {
		const val = normalizeNumber(value);

		if (!isObjectWithKeys(DATE_UNIT_SETTERS, [unit]) || !isNumber(val)) {
			throw new TypeError(`Provided unit or value is invalid!`);
		}

		DATE_UNIT_SETTERS[unit](expected, val);
	}

	return expected;
}

/**
 * * Returns the number of total days in a month.
 * @param date Date to get the number of days in the month. If `undefined`, it will use the current date.
 * @returns The number of days in the month (`28`-`31`).
 */
export function getDaysInMonth(date?: DateArgs): NumberRange<28, 31> {
	const $date = _dateArgsToDate(date);

	_throwInvalidDate($date);

	const year = $date.getFullYear();
	const month = $date.getMonth();

	return new Date(year, month + 1, 0).getDate() as NumberRange<28, 31>;
}

/**
 * @instance Returns an array of {@link Date} objects within a specific date range.
 *
 * - If the input is a fixed range (`from` and `to`), it includes all dates between them.
 * - If the input is a relative range (`span` and `unit`), it starts from current date and goes forward.
 * - If `skipDays` are provided, matching weekdays are excluded from the result.
 *
 * @param options - Configuration for the date range. Accepts a fixed ({@link SpanRangeForDate}) format.
 * @returns Array of {@link Date} objects, excluding any skipped weekdays if specified.
 */
export function getDatesInRange(options?: SpanRangeForDate): Date[];

/**
 * @instance Returns an array of {@link Date} objects within a specific date range.
 *
 * - If the input is a fixed range (`from` and `to`), it includes all dates between them.
 * - If the input is a relative range (`span` and `unit`), it starts from current date and goes forward.
 * - If `skipDays` are provided, matching weekdays are excluded from the result.
 *
 * @param options - Configuration for the date range. Accepts a relative ({@link RelativeRangeForDate}) format.
 * @returns Array of {@link Date} objects, excluding any skipped weekdays if specified.
 */
export function getDatesInRange(options?: RelativeRangeForDate): Date[];

export function getDatesInRange(options?: SpanRangeForDate | RelativeRangeForDate) {
	let startDate = new Date(),
		endDate = addDate(startDate, { week: 4 });

	const { onlyDays, skipDays } = options ?? {};

	if (options) {
		if ('from' in options || 'to' in options) {
			if (options?.from) startDate = _dateArgsToDate(options.from);
			if (options?.to) endDate = _dateArgsToDate(options.to);

			_throwInvalidDate(startDate);
			_throwInvalidDate(endDate);
		} else if ('span' in options || 'unit' in options) {
			const { span = 4, unit = 'week' } = options;
			endDate = addDate(startDate, { [unit]: span } as UnitWithValue);
		}
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

	const dates: Date[] = [];

	const startTime = startDate.getTime();
	const endTime = endDate.getTime();
	const step = (startTime <= endTime ? 1 : -1) * MS_PER_DAY;
	const totalDays = Math.floor(Math.abs(endTime - startTime) / MS_PER_DAY);

	for (let i = 0; i <= totalDays; i++) {
		const ts = startTime + i * step;
		const wDay = new Date(ts).getDay(); // temporary, just for weekday

		const include = isValidArray(onlyDays) ? skipSet.has(wDay) : !skipSet.has(wDay);

		if (include) {
			const chr = new Date(ts);

			dates.push(chr);
		}
	}

	return dates;
}
