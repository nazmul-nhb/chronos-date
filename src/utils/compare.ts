import type { DateArgs, DateTimeCompareFn, TimeUnit } from 'src/types/date-time';
import { _dateArgsToDate, _throwInvalidDate } from 'src/utils/helpers';

/**
 * * Returns the number of full years between 2 inputs.
 * @param date1 First input to compare with. For `undefined` value it uses the current date.
 * @param date2 Second input to compare with. For `undefined` value it uses the current date.
 * @returns The difference in number, negative if `date2` is before `date1`, positive if `date2` is after `date1`.
 */
export const getRelativeYear: DateTimeCompareFn = (date1, date2) => {
	const $date1 = _dateArgsToDate(date1);
	const $date2 = _dateArgsToDate(date2);

	_throwInvalidDate($date1);
	_throwInvalidDate($date2);

	let years = $date2.getFullYear() - $date1.getFullYear();

	const noYearMonthDay =
		$date1.getMonth() < $date2.getMonth() ||
		($date1.getMonth() === $date2.getMonth() && $date1.getDate() < $date2.getDate());

	if (noYearMonthDay) {
		years--;
	}

	return years;
};

/**
 * * Returns the number of full months between 2 inputs.
 * @param date1 First input to compare with. For `undefined` value it uses the current date.
 * @param date2 Second input to compare with. For `undefined` value it uses the current date.
 * @returns The difference in number, negative if `date2` is before `date1`, positive if `date2` is after `date1`.
 */
export const getRelativeMonth: DateTimeCompareFn = (date1, date2) => {
	const $date1 = _dateArgsToDate(date1);
	const $date2 = _dateArgsToDate(date2);

	_throwInvalidDate($date1);
	_throwInvalidDate($date2);

	let months =
		($date2.getFullYear() - $date1.getFullYear()) * 12 +
		($date2.getMonth() - $date1.getMonth());

	const hasNotHadMonthDay = $date2.getDate() < $date1.getDate();

	if (hasNotHadMonthDay) {
		months--;
	}

	return months;
};

/**
 * * Returns the number of full weeks between 2 inputs.
 * @param date1 First input to compare with. For `undefined` value it uses the current date.
 * @param date2 Second input to compare with. For `undefined` value it uses the current date.
 * @returns The difference in number, negative if `date2` is before `date1`, positive if `date2` is after `date1`.
 */
export const getRelativeWeek: DateTimeCompareFn = (date1, date2) => {
	const relativeDays = getRelativeDay(date1, date2);

	return Math.floor(relativeDays / 7);
};

/**
 * * Returns the number of full days between 2 inputs.
 * @param date1 First input to compare with. For `undefined` value it uses the current date.
 * @param date2 Second input to compare with. For `undefined` value it uses the current date.
 * @returns The difference in number, negative if `date2` is before `date1`, positive if `date2` is after `date1`.
 */
export const getRelativeDay: DateTimeCompareFn = (date1, date2) => {
	const $date1 = _dateArgsToDate(date1);
	const $date2 = _dateArgsToDate(date2);

	_throwInvalidDate($date1);
	_throwInvalidDate($date2);

	$date1.setHours(0, 0, 0, 0);
	$date2.setHours(0, 0, 0, 0);

	const diff = $date2.getTime() - $date1.getTime();

	return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/**
 * * Returns the number of full hours between 2 inputs.
 * @param date1 First input to compare with. For `undefined` value it uses the current date.
 * @param date2 Second input to compare with. For `undefined` value it uses the current date.
 * @returns The difference in number, negative if `date2` is before `date1`, positive if `date2` is after `date1`.
 */
export const getRelativeHour: DateTimeCompareFn = (date1, date2) => {
	const $date1 = _dateArgsToDate(date1);
	const $date2 = _dateArgsToDate(date2);

	_throwInvalidDate($date1);
	_throwInvalidDate($date2);

	const diff = $date2.getTime() - $date1.getTime();

	return Math.floor(diff / (1000 * 60 * 60));
};

/**
 * * Returns the number of full minutes between 2 inputs.
 * @param date1 First input to compare with. For `undefined` value it uses the current date.
 * @param date2 Second input to compare with. For `undefined` value it uses the current date.
 * @returns The difference in number, negative if `date2` is before `date1`, positive if `date2` is after `date1`.
 */
export const getRelativeMinute: DateTimeCompareFn = (date1, date2) => {
	const $date1 = _dateArgsToDate(date1);
	const $date2 = _dateArgsToDate(date2);

	_throwInvalidDate($date1);
	_throwInvalidDate($date2);

	const diff = $date2.getTime() - $date1.getTime();

	return Math.floor(diff / (1000 * 60));
};

/**
 * * Returns the number of full seconds between 2 inputs.
 * @param date1 First input to compare with. For `undefined` value it uses the current date.
 * @param date2 Second input to compare with. For `undefined` value it uses the current date.
 * @returns The difference in number, negative if `date2` is before `date1`, positive if `date2` is after `date1`.
 */
export const getRelativeSecond: DateTimeCompareFn = (date1, date2) => {
	const $date1 = _dateArgsToDate(date1);
	const $date2 = _dateArgsToDate(date2);

	_throwInvalidDate($date1);
	_throwInvalidDate($date2);

	const diff = $date2.getTime() - $date1.getTime();

	return Math.floor(diff / 1000);
};

/**
 * * Returns the number of full milliseconds between 2 inputs.
 * @param date1 First input to compare with. For `undefined` value it uses the current date.
 * @param date2 Second input to compare with. For `undefined` value it uses the current date.
 * @returns The difference in number, negative if `date2` is before `date1`, positive if `date2` is after `date1`.
 */
export const getRelativeMilliSecond: DateTimeCompareFn = (date1, date2) => {
	const $date1 = _dateArgsToDate(date1);
	const $date2 = _dateArgsToDate(date2);

	_throwInvalidDate($date1);
	_throwInvalidDate($date2);

	return $date2.getTime() - $date1.getTime();
};

/**
 * * Calculates the difference between two dates in the specified time unit.
 * @param date1 The first date to compare. For `undefined` value it uses the current date.
 * @param date2 The second date to compare. For `undefined` value it uses the current date.
 * @param unit The time unit to use for the comparison. Defaults to `'millisecond'`.
 * @returns The difference between the two dates in the specified time unit.
 *
 * @remarks
 * - It returns negative value if `date1` is after `date2` and positive value if `date1` is before `date2`.
 * - It returns difference in milliseconds for incorrect or `undefined` {@link unit}.
 */
export function getTimeDiff(date1: DateArgs, date2: DateArgs, unit?: TimeUnit): number {
	const $date1 = _dateArgsToDate(date1);
	const $date2 = _dateArgsToDate(date2);

	_throwInvalidDate($date1);
	_throwInvalidDate($date2);

	const msDiff = $date2.getTime() - $date1.getTime();

	switch (unit) {
		case 'second':
			return msDiff / 1e3;
		case 'minute':
			return msDiff / 6e4;
		case 'hour':
			return msDiff / 3.6e6;
		case 'day':
			return msDiff / 8.64e7;
		case 'week':
			return msDiff / 6.048e8;
		case 'month': {
			const year2 = $date2.getFullYear();
			const month2 = $date1.getMonth();

			const yearDiff = year2 - $date1.getFullYear();
			const monthDiff = month2 - $date1.getMonth();

			const totalMonthDiff = yearDiff * 12 + monthDiff;
			const dayDiff = $date2.getDate() - $date1.getDate();

			const daysInMonth = new Date(year2, month2 + 1, 0).getDate();

			return totalMonthDiff + dayDiff / daysInMonth;
		}
		case 'year':
			return getTimeDiff(date1, date2, 'month') / 12;
		default:
			return msDiff;
	}
}
