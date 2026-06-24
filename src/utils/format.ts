import { RELATIVE_TIME_DIVISIONS } from 'src/constants/basic';
import type {
	$DateUnit,
	DateArgs,
	DateFormatOptions,
	RelativeDateFormatOptions,
	SafeFormat,
	TimeOnlyFormat,
} from 'src/types';
import { _dateArgsToDate, _formatDate, _normalizeOffset } from 'src/utils/helpers';
import { formatUTCOffset } from 'src/utils/misc';
import type { Maybe } from 'toolbox-x/types';

/**
 * * Formats a date into a specified string format.
 *
 * @param options Options to control date and time formatting.
 *
 * @remarks
 * - If no date is provided, the current date and time will be used.
 * - If the provided date is invalid, the function will return `'Invalid Date!'`.
 * - The default format is `'dd, mmm DD, YYYY HH:mm:ss'` (e.g., `'Sun, Apr 06, 2025 16:11:55'`).
 * - By default, local time is used; set `useUTC` to `true` to format in UTC.
 * - The format string supports various tokens for date and time components, as well as literal text enclosed in square brackets.
 * - See {@link https://chronos.nazmul-nhb.dev/docs/chronos/format#format-tokens format tokens} for details on supported tokens.
 * - For more complex date/time manipulations, consider using the {@link https://chronos.nazmul-nhb.dev/docs/chronos Chronos} class.
 *
 * @returns Date/time string in specified format.
 */
export function formatDate(options?: DateFormatOptions): string {
	const {
		date = new Date(),
		format = 'dd, mmm DD, YYYY HH:mm:ss',
		useUTC = false,
	} = options ?? {};

	const $date = _dateArgsToDate(date);

	if (Number.isNaN($date.getTime())) {
		return 'Invalid Date!';
	}

	/** Get unit value for {@link $date} for specific unit in local or UTC time */
	const _getUnitValue = (suffix: $DateUnit): number => {
		return useUTC ? $date[`getUTC${suffix}`]() : $date[`get${suffix}`]();
	};

	const y = _getUnitValue('FullYear'),
		mo = _getUnitValue('Month'),
		d = _getUnitValue('Day'),
		dt = _getUnitValue('Date'),
		h = _getUnitValue('Hours'),
		m = _getUnitValue('Minutes'),
		s = _getUnitValue('Seconds'),
		ms = _getUnitValue('Milliseconds');

	const offset = useUTC ? 'Z' : formatUTCOffset(-$date.getTimezoneOffset()).slice(3);

	return _formatDate(format, y, mo, d, dt, h, m, s, ms, offset);
}

/**
 * * Formats a time-only string into a formatted time string.
 *
 * @param time - Time string to be formatted. Supported formats include:
 * - `HH:mm` → e.g., `'14:50'`
 * - `HH:mm:ss` → e.g., `'14:50:00'`
 * - `HH:mm:ss.mss` → e.g., `'14:50:00.800'`
 * - `HH:mm+TimeZoneOffset(HH)` → e.g., `'14:50+06'`
 * - `HH:mm+TimeZoneOffset(HH:mm)` → e.g., `'14:50+06:00'`
 * - `HH:mm:ss+TimeZoneOffset(HH)` → e.g., `'14:50:00+06'`
 * - `HH:mm:ss+TimeZoneOffset(HH:mm)` → e.g., `'14:50:00+05:30'`
 * - `HH:mm:ss.mss+TimeZoneOffset(HH)` → e.g., `'14:50:00.800+06'`
 * - `HH:mm:ss.mss+TimeZoneOffset(HH:mm)` → e.g., `'14:50:00.800+06:30'`
 *
 * - *Input will default to today's date and assume local timezone if no offset is provided.*
 *
 * @param format - Format tokens accepted by {@link formatDate} method ({@link TimeOnlyFormat}) for time part only.
 *                 Default: `hh:mm:ss a` → 02:33:36 pm.
 * @returns Formatted time string in local (System) time.
 */
export function formatTimePart(time: string, format?: TimeOnlyFormat): string {
	const timeWithDate = `${formatDate({ format: 'YYYY-MM-DD' })}T${_normalizeOffset(time)}`;

	return formatDate({ date: timeWithDate, format: format || 'hh:mm:ss a' });
}

/**
 * * Formats a date as a relative time string (e.g., "5m ago", "2h from now").
 *
 * @param date - The date to format, which can be a `Date` object, a date string, or a timestamp number.
 * @param format - Optional format string for dates older than 7 days. Defaults to `'mmm D, yyyy hh:mm a'`.
 * @returns A relative time string if the date is within the last 7 days, otherwise a formatted date string.
 *
 * @remarks
 * - If date is provided but `undefined`, current date and time will be used.
 * - If the provided date is invalid, the function will return `'Invalid Date!'`.
 * - For dates within the last 7 days, the output will be in the format of "Xm ago" or "Xh from now".
 * - For dates older than 7 days, the output will be formatted using the provided `format` string or the default format if none is provided.
 *
 * @example
 * formatDateRelative(Date.now() - 5 * 60000); // "5m ago"
 * formatDateRelative(Date.now() + 2 * 3600000); // "2h from now"
 * formatDateRelative(Date.now() - 10 * 86400000); // "Apr 6, 2026 04:11 PM" (formatted date string)
 */
export function formatDateRelative(date: Maybe<DateArgs>, format?: SafeFormat): string {
	const $date = _dateArgsToDate(date);

	if (Number.isNaN($date.getTime())) {
		return 'Invalid Date!';
	}

	const now = Date.now();
	const then = $date.getTime();

	const diff = Math.abs(now - then);

	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);

	const suffix = then < now ? 'ago' : 'from now';

	if (minutes < 1) return 'Just now';
	if (minutes < 60) return `${minutes}m ${suffix}`;
	if (hours < 24) return `${hours}h ${suffix}`;
	if (days < 7) return `${days}d ${suffix}`;

	return formatDate({ date, format: format || 'mmm D, yyyy hh:mm a' });
}

/**
 * * Formats a date as a relative time string using {@link Intl.RelativeTimeFormat} native method.
 *
 * @param toDate - The date to format, which can be a `Date` object, a date string, or a timestamp number.
 * @param options - Optional configuration for relative date formatting.
 * @returns A relative time string.
 *
 * @remarks
 * - If `toDate` is provided but `undefined`, current date and time will be used.
 * - If `fromDate` is provided but `undefined`, current date and time will be used.
 * - If any of the provided date value (`toDate` or `fromDate`) is invalid, the function will return `'Invalid Date!'`.
 *
 * @example
 * formatRelativeDateNative(Date.now() - 5 * 60000); // "5m ago"
 * formatRelativeDateNative(Date.now() + 2 * 3600000); // "in 2 hours"
 */
export function formatRelativeDateNative(
	toDate: DateArgs,
	options?: RelativeDateFormatOptions
): string {
	const {
		fromDate = new Date(),
		locale = 'en',
		localeMatcher,
		numeric = 'always',
		style,
	} = options ?? {};

	const to = _dateArgsToDate(toDate).getTime();
	const from = _dateArgsToDate(fromDate).getTime();

	if (Number.isNaN(to) || Number.isNaN(from)) {
		return 'Invalid Date!';
	}

	let duration = (to - from) / 1000;

	const RELATIVE_DATE_FORMATTER = new Intl.RelativeTimeFormat(locale, {
		localeMatcher,
		numeric,
		style,
	});

	let formatted = 'Just now';

	for (const division of RELATIVE_TIME_DIVISIONS) {
		if (Math.abs(duration) < division.amount) {
			formatted = RELATIVE_DATE_FORMATTER.format(Math.round(duration), division.name);
			break;
		}
		duration /= division.amount;
	}

	return formatted;
}
