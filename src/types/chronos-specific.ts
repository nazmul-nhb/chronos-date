import type { Chronos } from 'src/core/Chronos';
import type {
	$TimeZoneIdentifier,
	ISODateFormat,
	ISODateTimeString,
	Milliseconds,
	TimeZone,
	TimeZoneId,
	TimeZoneIdentifier,
	TimeZoneName,
	UTCOffset,
} from 'src/types/date-time';
import type { Enumerate, NumberRange } from 'toolbox-x/types/number';
import type { LooseLiteral } from 'toolbox-x/types/utils';

/**
 * * Timezone identifier type for `Chronos`
 *
 *  - {@link $TimeZoneIdentifier} — e.g., `"Asia/Dhaka"`.
 *  - {@link TimeZone} — e.g., `[ 'Asia/Calcutta', 'Asia/Colombo' ]`, used when multiple timezones share the same UTC offset such as `"UTC+05:30"`.
 *  - {@link UTCOffset} — e.g., `"UTC+06:45"` or `"UTC+02:15"`, returned when no named timezone corresponds to a given offset.
 *  - `'System'` — The current system timezone.
 */
export type ChronosTimeZone = TimeZoneIdentifier | TimeZone | UTCOffset | 'System';

/**
 * * Options for `Chronos` _static_ method `with()`
 *
 * @remarks Should provide at least one property, otherwise use the current date and time.
 */
export type ChronosWithOptions = Partial<{
	/** The full year (e.g., 2025). Years 0–99 are interpreted as 1900–1999. */
	year: number;
	/** Month number from 1 (January) to 12 (December). */
	month: NumberRange<1, 12>;
	/** Day of the month, from 1 to 31. */
	date: NumberRange<1, 31>;
	/** Hour of the day, from 0 (midnight) to 23 (11 PM). */
	hour: Enumerate<24>;
	/** Minutes of the hour, from 0 to 59. */
	minute: Enumerate<60>;
	/** Seconds of the minute, from 0 to 59. */
	second: Enumerate<60>;
	/** Milliseconds of the second, from 0 to 999. */
	millisecond: Milliseconds;
}>;

/** Interface for accessing internal private properties in extended `Chronos` class */
export interface ChronosInternals {
	/**
	 * * Access to `#withOrigin` private method.
	 * * Creates a new `Chronos` instance with `origin` and other properties.
	 *
	 * @param instance The `Chronos` instance to which attach the `origin` and other properties.
	 * @param origin Origin of the instance, the method name from where it was created.
	 * @param offset Optional UTC offset in `UTC±HH:mm` format.
	 * @param tzName Optional time zone name to set.
	 * @param tzId Optional time zone identifier(s) to set.
	 * @param tzTracker Optional tracker to identify the instance created by {@link https://chronos.nazmul-nhb.dev/docs/plugins/timezone-plugin#timezone timeZone} method.
	 * @returns The `Chronos` instance with the specified origin and other properties.
	 */
	withOrigin<Tz extends ChronosTimeZone>(
		instance: Chronos,
		method: PluginMethods,
		offset?: UTCOffset,
		tzName?: LooseLiteral<TimeZoneName>,
		tzId?: TimeZoneId,
		tzTracker?: $TimeZoneIdentifier | TimeZone | UTCOffset
	): Chronos<Tz>;

	/**
	 * * Access to `#toNewDate` private method
	 * * Creates a new `Date` object from a `Chronos` input
	 * @param instance - `Chronos` instance to operate on
	 * @param value - Input value to convert (optional, uses current date if omitted)
	 * @returns A new JavaScript `Date` object
	 */
	toNewDate(instance: Chronos, value?: ChronosInput): Date;

	/**
	 * * Gets the internal `#date`, a readonly private property (core `Date` object)
	 * @param instance - `Chronos` instance to access
	 * @returns The core internal `Date` object
	 */
	internalDate(instance: Chronos): Date;

	/**
	 * * Gets current UTC Offset internally stored as `#offset` private property
	 * @param instance - `Chronos` instance to access
	 * @returns The stored formatted UTC offset
	 */
	offset(instance: Chronos): UTCOffset;

	/** * Ensures the input is a `Chronos` instance, creating one if necessary. */
	cast<Tz extends ChronosTimeZone>(date: ChronosInput): Chronos<Tz>;
}

/** @internal Helper type to assign instance origin when creating new `Chronos` instance. */
export type WithoutOrigin = Omit<Chronos, '#ORIGIN' | 'origin'>;

/** Alias for `typeof Chronos` */
export type $Chronos = typeof Chronos;

/** * Instance methods that return `Chronos` instance */
export type $InstanceMethods = {
	[Method in keyof WithoutOrigin]: Chronos extends {
		[Instance in Method]: (...args: any[]) => Chronos;
	}
		? Method
		: never;
}[keyof WithoutOrigin];

/** * Static methods that return `Chronos` instance */
export type $StaticMethods = {
	[Method in keyof $Chronos]: $Chronos extends {
		[Instance in Method]: (...args: any[]) => Chronos;
	}
		? Method
		: never;
}[keyof $Chronos];

/** * Plugin methods that return `Chronos` instance */
export type $PluginMethods =
	| 'round'
	| `timeZone`
	| 'nextWorkday'
	| 'nextWeekend'
	| 'previousWorkday'
	| 'previousWeekend';

/** * Plugin methods that return `Chronos` instance + any custom name */
export type PluginMethods = LooseLiteral<$PluginMethods>;

/** Both instance and static methods (including built-in plugin methods) in `Chronos` class that return `Chronos` instance. */
export type ChronosMethods = $InstanceMethods | $StaticMethods | $PluginMethods;

/**
 * * Accepted Input type for `Chronos`
 *
 * **Note**: *If a date is provided **without a time component**, the instance will default to `00:00:00.000` UTC
 * and convert it to the **equivalent local time** using the current environment's UTC offset.*
 */
export type ChronosInput = number | string | Date | Chronos;

/** Properties required to reconstruct a `Chronos` instance. */
export interface ChronosProperties {
	/** The method or plugin name from which the instance was created. */
	origin: LooseLiteral<ChronosMethods>;
	/** The native date value, either as a `Date` object or a date string. */
	native: Date | string;
	/** The UTC offset in `UTC±HH:mm` format. */
	utcOffset: UTCOffset;
	/** The full time zone name (e.g., `"Pacific Standard Time"`). */
	timeZoneName: LooseLiteral<TimeZoneName>;
	/** The time zone identifier(s) associated with the instance (e.g., `"Asia/Dhaka"`). */
	timeZoneId: TimeZoneId;
	/** Optional tracker to identify the instance created by `timeZone` method. */
	$tzTracker?: $TimeZoneIdentifier | TimeZone | UTCOffset;
}

/** Iterable `Chronos` object properties */
export interface ChronosObject {
	/** Full year (e.g., 2025). */
	year: number;
	/** Month index starting from 0 (January = 0). */
	month: Enumerate<12>;
	/** ISO month number starting from 1 (January = 1). */
	isoMonth: NumberRange<1, 12>;
	/** Day of the month (1–31). */
	date: NumberRange<1, 31>;
	/** Day of the week index (0–6, Sunday = 0). */
	weekDay: Enumerate<7>;
	/** ISO day of the week number (1–7, Monday = 1). */
	isoWeekDay: NumberRange<1, 7>;
	/** Hour of the day (0–23). */
	hour: Enumerate<24>;
	/** Minute of the hour (0–59). */
	minute: Enumerate<60>;
	/** Second of the minute (0–59). */
	second: Enumerate<60>;
	/** Milliseconds within the second. */
	millisecond: Milliseconds;
	/** Timestamp in milliseconds since the Unix epoch. */
	timestamp: number;
	/** Unix timestamp in seconds since the epoch. */
	unix: number;
}

/** Formats for range getter methods, includes: `'local'`, `'utc'`, and `'chronos'` */
export type RangedChronosFormat = ISODateFormat | 'chronos';

/** Common options for formatting and rounding dates */
export interface $CommonRangeOptions<F extends RangedChronosFormat = 'local'> {
	/**
	 * - Output format: return ISO strings in `'local'` or `'utc'` format or as `Chronos` instance.
	 * - Defaults to `'local'`.
	 */
	format?: F | ISODateFormat | 'chronos';

	/** - Whether to round the dates in the range to the start of the day. Default is `false`. */
	roundDate?: boolean;
}

/** - Options to define a **fixed date range** using explicit `from` and `to` dates. */
export interface DateRangeOptions<F extends RangedChronosFormat = 'local'>
	extends $CommonRangeOptions<F> {
	/** - Start date of the range (inclusive). Defaults to **now** if not provided. */
	from?: ChronosInput;

	/** - End date of the range (inclusive). Defaults to **4 weeks from now** if not provided. */
	to?: ChronosInput;
}

/** - Options to define a **relative date range** starting from the current date. */
export interface RelativeRangeOptions<F extends RangedChronosFormat = 'local'>
	extends $CommonRangeOptions<F> {
	/**
	 * The number of time units to move **forward from `now`**.
	 *
	 * - Determines the size of the range.
	 * - `now` → `start`, and `start + span` → `end`.
	 * - Both `start` and `end` are included in the result.
	 * - Controlled by the {@link unit} option.
	 * - Defaults to `4`.
	 */
	span?: number;

	/**
	 * The time unit used to advance the range.
	 *
	 * - Works together with {@link span} to calculate the final date range.
	 * - For example: `span: 2, unit: 'week'` → 2-week range.
	 * - Defaults to `'week'`.
	 */
	unit?: 'year' | 'month' | 'week' | 'day';
}

/** Unified type that supports either a fixed or relative date range configuration. */
export type WeekdayOptions<F extends RangedChronosFormat = 'local'> =
	| RelativeRangeOptions<F>
	| DateRangeOptions<F>;

/** The result type of `getDatesInRange` and `getDatesForDay` */
export type DateRangeResult<F extends RangedChronosFormat = 'local'> = F extends ISODateFormat
	? ISODateTimeString<F>[]
	: Chronos<ChronosTimeZone>[];
