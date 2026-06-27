import { DATE_UNIT_SETTERS } from 'src/constants/basic';
import type { DateArgs, TimeUnit, UnitWithValue } from 'src/types/date-time';
import { _dateArgsToDate, _throwInvalidDate } from 'src/utils/helpers';
import { normalizeNumber } from 'toolbox-x';
import { isNumber, isObjectWithKeys } from 'toolbox-x/guards';
import type { Maybe, Numeric } from 'toolbox-x/types';

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
