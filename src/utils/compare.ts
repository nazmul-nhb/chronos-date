import type { DateArgs, DateTimeCompareFn } from 'src/types/date-time';
import { _dateArgsToDate, _throwInvalidDate } from 'src/utils/helpers';
import type { Maybe } from 'toolbox-x/types';

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

export function isToday(date: Maybe<DateArgs>): boolean {
	const $date = _dateArgsToDate(date);

	_throwInvalidDate($date);

	return getRelativeDay(new Date(), $date) === 0;
}

export function isTomorrow(date: Maybe<DateArgs>): boolean {
	const $date = _dateArgsToDate(date);

	_throwInvalidDate($date);

	return getRelativeDay(new Date(), $date) === 1;
}

export function isYesterday(date: Maybe<DateArgs>): boolean {
	const $date = _dateArgsToDate(date);

	_throwInvalidDate($date);

	return getRelativeDay(new Date(), $date) === -1;
}
