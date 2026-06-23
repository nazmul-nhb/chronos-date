import type { Chronos } from 'src/classes/Chronos';
import type { ChronosPlugin } from 'src/types/chronos-plugins';
import type {
	ChronosInput,
	ChronosProperties,
	ChronosTimeZone,
	ChronosWithOptions,
	DateRangeOptions,
	RelativeRangeOptions,
} from 'src/types/chronos-specific';
import type {
	FormatOptions,
	ISODateTimeString,
	Milliseconds,
	WeekDay,
} from 'src/types/date-time';
import type { TimeOnlyFormat } from 'src/types/format-tokens';
import type { Enumerate, NumberRange } from 'toolbox-x/types/number';

/** All the statics methods and constructor signatures in `Chronos` class */
export interface ChronosStatics {
	/**
	 * * Creates a new immutable `Chronos` instance from current date & time (UTC).
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 *
	 * @remarks
	 * - This function serves as a wrapper around the {@link Chronos} class constructor.
	 * - It allows you to create a new `Chronos` instance from `number`, `string`, {@link Date}, {@link Chronos}, or individual date-time components.
	 */
	(): Chronos;

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * @param value - A date value in `number`, it should be a timestamp (milliseconds since the Unix epoch).
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 *
	 * @remarks
	 * - This function serves as a wrapper around the {@link Chronos} class constructor.
	 * - It allows you to create a new `Chronos` instance from `number`, `string`, {@link Date}, {@link Chronos}, or individual date-time components.
	 */
	(value: number): Chronos;

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @param value - A date value in `string`, it should be in a format that can be parsed by the {@link Date} constructor.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 *
	 * @remarks
	 * - This function serves as a wrapper around the {@link Chronos} class constructor.
	 * - It allows you to create a new `Chronos` instance from `number`, `string`, {@link Date}, {@link Chronos}, or individual date-time components.
	 */
	(value: string): Chronos;

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * @param value - A date value as {@link Date} object.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 *
	 * @remarks
	 * - This function serves as a wrapper around the {@link Chronos} class constructor.
	 * - It allows you to create a new `Chronos` instance from `number`, `string`, {@link Date}, {@link Chronos}, or individual date-time components.
	 */
	(value: Date): Chronos;

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * @param value - A date value as `Chronos` object.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 *
	 * @remarks
	 * - This function serves as a wrapper around the {@link Chronos} class constructor.
	 * - It allows you to create a new `Chronos` instance from `number`, `string`, {@link Date}, {@link Chronos}, or individual date-time components.
	 */
	(value: Chronos): Chronos;

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @param year The full year designation is required for cross-century date accuracy. If year is between 0 and 99, year is assumed to be 1900 + year.
	 * @param month The month as a `number` between 1 and 12 (January to December).
	 * @param date The date as a `number` between 1 and 31.
	 * @param hours Must be supplied if minutes is supplied. A `number` from 0 to 23 (midnight to 11pm) that specifies the hour.
	 * @param minutes Must be supplied if seconds is supplied. A `number` from 0 to 59 that specifies the minutes.
	 * @param seconds Must be supplied if milliseconds is supplied. A `number` from 0 to 59 that specifies the seconds.
	 * @param ms A `number` from 0 to 999 that specifies the milliseconds.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 *
	 * @remarks
	 * - This function serves as a wrapper around the {@link Chronos} class constructor.
	 * - It allows you to create a new `Chronos` instance from `number`, `string`, {@link Date}, {@link Chronos}, or individual date-time components.
	 */
	(
		year: number,
		month?: NumberRange<1, 12>,
		date?: NumberRange<1, 31>,
		hours?: Enumerate<24>,
		minutes?: Enumerate<60>,
		seconds?: Enumerate<60>,
		ms?: Milliseconds
	): Chronos;

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @param year The full year designation is required for cross-century date accuracy. If year is between 0 and 99, year is assumed to be 1900 + year.
	 * @param month The month as a `number` between 1 and 12 (January to December).
	 * @param date The date as a `number` between 1 and 31.
	 * @param hours Must be supplied if minutes is supplied. A `number` from 0 to 23 (midnight to 11pm) that specifies the hour.
	 * @param minutes Must be supplied if seconds is supplied. A `number` from 0 to 59 that specifies the minutes.
	 * @param seconds Must be supplied if milliseconds is supplied. A `number` from 0 to 59 that specifies the seconds.
	 * @param ms A `number` from 0 to 999 that specifies the milliseconds.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 *
	 * @remarks
	 * - This function serves as a wrapper around the {@link Chronos} class constructor.
	 * - It allows you to create a new `Chronos` instance from `number`, `string`, {@link Date}, {@link Chronos}, or individual date-time components.
	 */
	(
		year: number,
		month?: number,
		date?: number,
		hours?: number,
		minutes?: number,
		seconds?: number,
		ms?: number
	): Chronos;

	/**
	 * * Creates a new immutable `Chronos` instance.
	 *
	 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC and convert it to the **equivalent local time** using the current environment's UTC offset.*
	 *
	 * @param value - A date value (`number`, `string`, `Date`, or `Chronos` object).
	 * - If a `string` is provided, it should be in a format that can be parsed by the `Date` constructor.
	 * - If a `number` is provided, it should be a timestamp (milliseconds since the Unix epoch).
	 * - If a `Date` object is provided, it will be used as is.
	 * - If a `Chronos` object is provided, it will be used directly.
	 *
	 * @returns Instance of `Chronos` with all methods and properties.
	 *
	 * @remarks
	 * - This function serves as a wrapper around the {@link Chronos} class constructor.
	 * - It allows you to create a new `Chronos` instance from `number`, `string`, {@link Date}, {@link Chronos}, or individual date-time components.
	 */
	(value?: ChronosInput): Chronos;

	/**
	 * * Parses a date string with a given format (limited support only).
	 *
	 * **Supported format tokens**:
	 * - `YYYY`: Full year (e.g., 2023)
	 * - `YY`: Two-digit year (e.g., 23 for 2023, 99 for 1999)
	 * - `MM`: Month (01-12)
	 * - `M`: Month (1-12)
	 * - `DD`: Day of the month (01-31)
	 * - `D`: Day of the month (1-31)
	 * - `HH`: Hour (00-23)
	 * - `H`: Hour (0-23)
	 * - `mm`: Minute (00-59)
	 * - `m`: Minute (0-59)
	 * - `ss`: Second (00-59)
	 * - `s`: Second (0-59)
	 * - `mss`: Millisecond (000-999)
	 * - `ms`: Millisecond (0-999)
	 *
	 * @example
	 * Chronos.parse('23-12-31 15:30:45', 'YY-MM-DD HH:mm:ss');
	 * // returns `Chronos` instance with the parsed date 2023-12-31T15:30:45
	 *
	 * @param dateStr - The date string to be parsed
	 * @param format - The format of the date string. Supported tokens `YYYY`, `YY` `MM`, `M`, `DD`, `D`, `HH`, `H`, `mm`, `m`, `ss`, `s`, `mss`, `ms` are used to specify the structure.
	 * @returns A new `Chronos` instance representing the parsed date.
	 * @throws `Error` If the date string does not match the format.
	 */
	parse(dateStr: string, format: string): Chronos;

	/**
	 * * Creates a new `Chronos` instance with the provided time component(s).
	 *
	 * @param options - One or more time components to override.
	 * @returns A new `Chronos` instance with the provided time components applied.
	 *
	 * @remarks
	 * - Unspecified components are filled with the current time's (`Chronos`) respective values.
	 * - For option `month`, value should be number from `1` (January) to `12` (December).
	 * - If the `date` component is omitted and the current day is the last day of its month,
	 *   the resulting instance will also use the last day of the target month.
	 *   - _This rule does **not** apply if the `date` component is explicitly provided,
	 *     even if that value exceeds the last day of the target month._
	 *
	 * @example
	 * // Override only the year and month
	 * const c = Chronos.with({ year: 2025, month: 12 });
	 */
	with(options: ChronosWithOptions): Chronos;

	/**
	 * * Returns the current date and time in a specified format in local time.
	 * * Default format is dd, `mmm DD, YYYY HH:mm:ss` = `Sun, Apr 06, 2025 16:11:55`
	 * @param options - Configure format string and whether to format using utc offset.
	 * @returns Formatted date string in desired format.
	 */
	today(options?: FormatOptions): string;

	/**
	 * * Returns a new `Chronos` instance representing yesterday's date.
	 *
	 * @returns A `Chronos` instance for the previous calendar day.
	 */
	yesterday(): Chronos;

	/**
	 * * Returns a new `Chronos` instance representing tomorrow's date.
	 *
	 * @returns A `Chronos` instance for the next calendar day.
	 */
	tomorrow(): Chronos;

	/**
	 * * Returns the number of milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC).
	 * @returns The number of milliseconds elapsed since the Unix epoch.
	 * @remarks It internally uses {@link Date.now()}.
	 */
	now(): number;

	/**
	 * * Creates a UTC-based `Chronos` instance.
	 * If no date is provided, it uses the current date and time.
	 *
	 * **This is the base time, meaning conversion in other timezone will consider UTC time as the base time.**
	 *
	 * @param dateLike Optional input date to base the UTC time on.
	 * If omitted, the current system date/time is used.
	 * @returns A new `Chronos` instance representing the UTC equivalent of the input.
	 */
	utc(dateLike?: ChronosInput): Chronos<'UTC'>;

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
	 * @param format - Format tokens accepted by {@link formatSafe()} method ({@link TimeOnlyFormat}) for time part only.
	 *                 Default: `hh:mm:ss a` → 02:33:36 pm.
	 * @returns Formatted time string in local (System) time.
	 */
	formatTimePart(time: string, format?: TimeOnlyFormat): string;

	/**
	 * * Returns ISO date strings for each occurrence of a weekday from today, spanning a relative time range.
	 *
	 * @param day - The weekday to match (e.g., `'Wednesday'`, `'Sunday'`).
	 * @param options - Relative range (e.g., 7 days, 4 weeks) and output format (local with timezone or utc).
	 * @returns Array of ISO date strings in the specified format. Returns empty array if no matches in the time span.
	 *
	 * - Please refer to {@link https://chronos.nazmul-nhb.dev/docs/chronos/static/get-dates-for-day docs} for details.
	 *
	 * @example
	 * Chronos.getDatesForDay('Wednesday', { span: 7, unit: 'day' });
	 * //=> [ '2025-05-28T21:16:06.198+06:00', '2025-06-04T21:16:06.198+06:00' ]
	 *
	 * @example
	 * Chronos.getDatesForDay('Wednesday', {
	 *   span: 7,
	 *   unit: 'day',
	 *   format: 'utc'
	 * });
	 * //=> [ '2025-05-28T15:17:10.812Z', '2025-06-04T15:17:10.812Z' ]
	 */
	getDatesForDay(
		day: WeekDay,
		options?: RelativeRangeOptions
	): ISODateTimeString<'utc' | 'local'>[];

	/**
	 * * Returns ISO date strings for each occurrence of a weekday between two fixed dates.
	 *
	 * @param day - The weekday to match (e.g., `'Monday'`, `'Friday'`).
	 * @param options - Date range (from/to, e.g. `'2025-06-30'`, ` new Date()`, `new Chronos()` etc.) and output format (local with timezone or utc).
	 * @returns Array of ISO date strings in the specified format. Returns empty array if no matches in the range.
	 *
	 * - Please refer to {@link https://chronos.nazmul-nhb.dev/docs/chronos/static/get-dates-for-day docs} for details.
	 *
	 * @remarks
	 * - When using `Chronos` instances for `from` and/or `to`, ensure both are created in the **same time zone** to avoid mismatched boundaries.
	 * - Mixing zones may shift the interpreted start or end by several hours, which can cause the range to include or exclude incorrect weekdays.
	 *
	 * @example
	 * Chronos.getDatesForDay('Monday', {
	 *   from: '2025-05-28',
	 *   to: '2025-06-30',
	 *   format: 'local'
	 * });
	 * //=> [ '2025-01-06T...', '2025-01-13T...', ... ]
	 */
	getDatesForDay(
		day: WeekDay,
		options?: DateRangeOptions
	): ISODateTimeString<'utc' | 'local'>[];

	/**
	 * * Returns the earliest `Chronos` instance based on the underlying universal {@link timestamp}.
	 *
	 * @remarks
	 * - All inputs are normalized to `Chronos` instances before comparison.
	 * - Comparison is always performed using each instance's **UTC timestamp**, ensuring a consistent and timezone-agnostic result.
	 * - When exactly two values are provided, the first value becomes the initial candidate; if the second value represents an earlier moment in time, it replaces the candidate.
	 * - The returned value is **not** one of the input objects. A new immutable `Chronos` instance is always created. Its internal timezone, offset, name, and tracking information are cloned from the winning input instance.
	 *
	 * @param dates A list of Chronos-compatible inputs (`string`, `number`, `Date` or `Chronos`).
	 * @returns A new `Chronos` instance representing the earliest moment.
	 */
	min(dates?: ChronosInput[]): Chronos<ChronosTimeZone>;

	/**
	 * * Returns the latest `Chronos` instance based on the underlying universal {@link timestamp}.
	 *
	 * @remarks
	 * - All inputs are normalized to `Chronos` instances before comparison.
	 * - Comparison is always performed using each instance's **UTC timestamp**, ensuring a consistent and timezone-agnostic result.
	 * - When exactly two values are provided, the first value becomes the initial candidate; if the second value represents a later moment in time, it replaces the candidate.
	 * - The returned value is **not** one of the input objects. A new immutable `Chronos` instance is always created. Its internal timezone, offset, name, and tracking information are cloned from the winning input instance.
	 *
	 * @param dates A list of Chronos-compatible inputs (`string`, `number`, `Date` or `Chronos`).
	 * @returns A new `Chronos` instance representing the latest moment.
	 */
	max(dates?: ChronosInput[]): Chronos<ChronosTimeZone>;

	/**
	 * * Checks if the year in the date string or year (from 0 - 9999) is a leap year.
	 * - A year is a leap year if it is divisible by 4, but not divisible by 100, unless it is also divisible by 400.
	 * - For example, 2000 and 2400 are leap years, but 1900 and 2100 are not.
	 *
	 * @remarks
	 * - This method accepts different types of date inputs and extracts the year to check if it's a leap year.
	 * - If the provided date is a `number`, it will be treated as a year (must be a valid year from 0 to 9999).
	 * - If the year is out of this range (negative or larger than 9999), it will be treated as a Unix timestamp.
	 * - If the provided date is a string or a `Date` object, it will be parsed and the year will be extracted.
	 * - If a `Chronos` instance is passed, the year will be directly accessed from the instance.
	 *
	 * @param date - A `number` (year or Unix timestamp), `string`, `Date`, or `Chronos` instance representing a date.
	 * @returns `true` if the year is a leap year, `false` otherwise.
	 */
	isLeapYear(date: ChronosInput): boolean;

	/**
	 * * Checks if the given value is a valid `Date` object.
	 * - A value is considered valid if it is an instance of the built-in `Date` class.
	 * - This does not check whether the date itself is valid (e.g., `new Date('invalid')`).
	 * @param value - The value to test.
	 * @returns `true` if the value is a valid `Date` object, otherwise `false`.
	 */
	isValidDate(value: unknown): value is Date;

	/**
	 * * Checks if the given value is a valid date string.
	 * - A value is considered a valid date string if it is a string and can be parsed by `Date.parse()`.
	 * - This uses the native JavaScript date parser internally.
	 * @param value - The value to test.
	 * @returns `true` if the value is a valid date string, otherwise `false`.
	 */
	isDateString(value: unknown): value is string;

	/**
	 * * Checks if the given value is an instance of `Chronos`.
	 * - Useful for verifying `Chronos` objects in type guards or validations.
	 * @param value - The value to test.
	 * @returns `true` if the value is an instance of `Chronos`, otherwise `false`.
	 */
	isValidChronos(value: unknown): value is Chronos<ChronosTimeZone>;

	/**
	 * * Checks if the given value has the necessary properties to be reconstructed into a `Chronos` instance.
	 * - Can be used for validating objects that may represent serialized `Chronos` data.
	 * @param value - The value to check.
	 * @returns `true` if the value has the required properties for reconstruction, otherwise `false`.
	 */
	isReconstructable(value: unknown): value is ChronosProperties;

	/**
	 * * Reconstructs a `Chronos` instance from an object containing the necessary properties.
	 * - The input object must have the properties defined in {@link ChronosProperties} interface.
	 * - If the input is not reconstructable, an error is thrown.
	 *
	 * @param value - An object containing the properties required to reconstruct a `Chronos` instance.
	 * @returns A new `Chronos` instance created from the provided properties.
	 * @throws `TypeError` if the input value does not have the necessary properties for reconstruction.
	 */
	reconstruct(value: ChronosProperties): Chronos<ChronosTimeZone>;

	/**
	 * * Injects a plugin into the `Chronos` system.
	 * @param plugin The plugin to inject.
	 *
	 * @remarks
	 * - Using this (`use`) method in `React` projects may trigger *linter error* like `"React Hooks must be called in a React function component or a custom React Hook function."`
	 * 	- To prevent this incorrect *linter error* in `React` projects, prefer using {@link register} method (alias `use` method).
	 *
	 * - **NOTE:** *Once a plugin is injected, all the registered methods for that plugin will be available for the whole project.*
	 * - See {@link https://chronos.nazmul-nhb.dev/docs/plugins#-official-plugins full list of plugins and the methods they register}.
	 */
	use(plugin: ChronosPlugin): void;

	/**
	 * * Registers a plugin into the `Chronos` system.
	 * @param plugin The plugin to register.
	 *
	 * @remarks
	 * - This is just an alias for {@link use} method.
	 * - Using {@link use} method in `React` projects may trigger *linter error* like `"React Hooks must be called in a React function component or a custom React Hook function."`
	 * 	- To prevent this incorrect *linter error* in `React` projects, prefer using this (`register`) method over {@link use} method.
	 *
	 * - **NOTE:** *Once a plugin is injected, all the registered methods for that plugin will be available for the whole project.*
	 * - See {@link https://chronos.nazmul-nhb.dev/docs/plugins#-official-plugins full list of plugins and the methods they register}.
	 */
	register(plugin: ChronosPlugin): void;
}
