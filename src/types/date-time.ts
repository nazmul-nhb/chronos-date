import type {
	DAYS,
	LOCALE_CALENDARS,
	LOCALE_NUMBERING_SYSTEMS,
	MONTHS,
	TIME_UNIT_VARIANTS,
} from 'src/constants/basic';
import type {
	TIME_ZONE_IDS,
	TIME_ZONE_LABELS,
	TIME_ZONES,
	TIME_ZONES_NATIVE,
} from 'src/constants/timezone';
import type { ChronosStatics } from 'src/types';
import type { SafeFormat } from 'src/types/format-tokens';
import type { Maybe, Numeric } from 'toolbox-x/types';
import type { Enumerate, LocaleCode, NumberRange } from 'toolbox-x/types/number';
import type { LooseLiteral, RequireAtLeast, Split } from 'toolbox-x/types/utils';

/** - Represents the full name of a weekday, e.g., 'Monday', 'Tuesday' etc. */
export type WeekDay = (typeof DAYS)[number];

/** - Represents the full name of a month, e.g., 'January', 'February' etc. */
export type MonthName = (typeof MONTHS)[number];

/** Mapped type to {@link TIME_UNIT_VARIANTS} */
export type $TimeUnitVarMap = typeof TIME_UNIT_VARIANTS;

/** Key of {@link TIME_UNIT_VARIANTS} */
export type $TimeUnitKey = keyof typeof TIME_UNIT_VARIANTS;

/** Variants of different time units in lowercase */
export type $TimeUnitVar<U extends $TimeUnitKey = $TimeUnitKey> = $TimeUnitVarMap[U][number];

/** Variants of different time units in lowercase, uppercase  and capitalized */
export type $UnitAnyCase = Capitalize<$TimeUnitVar> | Uppercase<$TimeUnitVar> | $TimeUnitVar;

/** Number (time value) with variants of different time units */
export type TimeWithUnit = `${number}${$UnitAnyCase}` | `${number} ${$UnitAnyCase}`;

/** - Minute in numeric string from `00` to `23` */
export type ClockHour = `0${Enumerate<10>}` | `${NumberRange<10, 23>}`;

/** - Minute in numeric string from `00` to `59` */
export type ClockMinute = `0${Enumerate<10>}` | `${NumberRange<10, 59>}`;

/** - Second in numeric string from `00` to `59` */
export type ClockSecond = `0${Enumerate<10>}` | `${NumberRange<10, 59>}`;

/** - Time in "HH:MM" format. */
export type ClockTime = `${ClockHour}:${ClockMinute}`;

/** Normal time in `H:mm` format which does not follow the strict limit up to 23 hours, hour can be any number and minute can be numeric string from `00` to `59` */
export type HourMinutes = `${number}:${ClockMinute}`;

/** Extends {@link Intl.DateTimeFormatOptions} with improved type system. */
export interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
	/** {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones Time zone identifier} to use (excluding `'Factory'`). */
	timeZone?: $TimeZoneIdentifier;
	/** Locale calendar system to use. */
	calendar?: LocaleCalendar;
	/** Locale numbering system to use. */
	numberingSystem?: NumberingSystem;
}

/** Millisecond from `0-999` */
export type Milliseconds = Enumerate<999> | 999;

/** Date of the month as `0` padded numeric string e.g. `01`, `18` */
export type DateString = `0${NumberRange<1, 9>}` | `${NumberRange<10, 31>}`;

/** Month as `0` padded numeric string, e.g. `02`, `01` etc. */
export type MonthString = `0${NumberRange<1, 9>}` | '10' | '11' | '12';

/** Date and month in `MM-DD` format, e.g. `01-12` means 'January 18' */
export type MonthDateString = Exclude<
	`${MonthString}-${DateString}`,
	'02-30' | '02-31' | '04-31' | '06-31' | '09-31' | '11-31'
>;

/** Options for `formatDate` utility */
export interface DateFormatOptions extends FormatOptions {
	/** - Date to format, must be parsable by {@link Date} constructor. Can be string, number or `Date`. Defaults to current time. */
	date?: DateArgs;
	format?: SafeFormat;
}

/** Interface representing a date-like object. */
export interface DateLike {
	toJSON?(): string;
	toISOString?(): string;
	toString?(): string;

	// Moment/Dayjs/Chronos
	format?(): string;

	// Luxon
	toISO?(): string;
	toFormat?(format: string): string;

	// JS-Joda
	plus?(...args: unknown[]): unknown;
	minus?(...args: unknown[]): unknown;
	equals?(...args: unknown[]): boolean;
	getClass?(): unknown;

	// For Temporal or unknown types
	constructor?: {
		name: string;
	};
}

/** Quarters of the year */
export type Quarter = 1 | 2 | 3 | 4;

/** Represents key of `ChronosStatics` (each static method and property) */
export type ChronosStaticKey = keyof ChronosStatics;

/** Key of {@link TIME_ZONE_LABELS} ({@link UTCOffset}) */
export type $TZLabelKey = keyof typeof TIME_ZONE_LABELS;

/** Abbreviated time zone names (from {@link https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations time zone abbreviations on Wikipedia}). */
export type TimeZone = keyof typeof TIME_ZONES;

/** Time zone identifier (from {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones IANA TZ Database on Wikipedia}) excluding `'Factory'`. */
export type $TimeZoneIdentifier = Exclude<keyof typeof TIME_ZONE_IDS, 'Factory'>;

/** Time zone identifier (from {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones IANA TZ Database on Wikipedia}) excluding `'Factory'` & abbreviations present in {@link TimeZone}. */
export type TimeZoneIdentifier = Exclude<$TimeZoneIdentifier, TimeZone>;

/** Time zone identifier, array of timezone identifiers or UTC offset. */
export type TimeZoneId = $TimeZoneIdentifier | $TimeZoneIdentifier[] | UTCOffset;

/** JavaScript native time zone identifier (from {@link Intl.supportedValuesOf} API) */
export type TimeZoneIdNative = keyof typeof TIME_ZONES_NATIVE;

/** JavaScript native time zone name (from {@link Intl.supportedValuesOf} API) */
export type TimeZoneNameNative = (typeof TIME_ZONES_NATIVE)[TimeZoneIdNative]['tzName'];

/** Native time zone name or IANA time zone identifier */
export type $NativeTzNameOrId = TimeZoneNameNative | $TimeZoneIdentifier;

/** Full time zone names from {@link https://en.wikipedia.org/wiki/List_of_time_zone_abbreviations Wikipedia}, {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones IANA TZ Database on Wikipedia} and JavaScript native API ({@link Intl.supportedValuesOf}). */
export type TimeZoneName = NonNullable<
	| (typeof TIME_ZONE_LABELS)[$TZLabelKey]
	| (typeof TIME_ZONES)[TimeZone]['tzName']
	| (typeof TIME_ZONE_IDS)[$TimeZoneIdentifier]['tzName']
	| TimeZoneNameNative
>;

/** Positive UTC hours */
export type PositiveUTCHour = `+0${Enumerate<10>}` | `+${NumberRange<10, 14>}`;

/** Negative UTC hours */
export type NegativeUTCHour = `-0${Enumerate<10>}` | `-${NumberRange<10, 14>}`;

/** UTC Minutes as quarters */
export type UTCMinute = '00' | '15' | '30' | '45';

/** UTC offset in `±HH:mm` format */
export type $UTCOffset = `${PositiveUTCHour | NegativeUTCHour}:${UTCMinute}`;

/** UTC offset in `UTC±HH:mm` format */
export type UTCOffset = `UTC${$UTCOffset}`;

/** GMT offset in `GMT±HH:mm` or simply `GMT` format */
export type $GMTOffset = `GMT${$UTCOffset}` | 'GMT';

export type $ISOTimeString =
	`${number}-${number}-${number}T${number}:${number}:${number}.${number}`;

export type ISODateTimeString<F extends ISODateFormat = 'utc'> = F extends 'utc'
	? `${$ISOTimeString}Z`
	: `${$ISOTimeString}${$UTCOffset}`;

/** Valid argument type accepted by `Date` constructor */
export type DateArgs = string | number | Date;

/** Type for ISO date format options */
export type ISODateFormat = 'local' | 'utc';

/** Options for `getTimestamp` utility */
export interface TimestampOptions<F extends ISODateFormat = 'utc'> {
	/**
	 * Optional date input (string, number, or `Date` object).
	 * Defaults to {@link Date new Date()}.
	 */
	value?: DateArgs;
	/**
	 * Output format for the timestamp.
	 * - `'utc'` (default) → returns ISO string in UTC (`...Z`).
	 * - `'local'` → returns ISO string with current system offset (`...+05:30`).
	 */
	format?: F | ISODateFormat;
}

/** `Chronos` Date Format options */
export interface FormatOptions {
	/**
	 * * The desired format (Default format is `'dd, mmm DD, YYYY HH:mm:ss'` = `'Sun, Apr 06, 2025 16:11:55'`).
	 *
	 *   - To output raw text (i.e., not interpreted as a date token), wrap it in square brackets.
	 *   - For example, `[Today is] ddd` results in `Today is Sunday`, and `YYYY[ year]` results in `2025 year`.
	 *
	 *   - Supported format tokens include: `YYYY`, `YY`, `mmmm`, `mmm`, `MM`, `M`, `DD`, `D`, `dd`, `ddd`, `Do`, `HH`, `H`, `hh`, `h`, `mm`, `m`, `ss`, `s`, `ms`, `mss`, `a`, `A`, and `ZZ`.
	 *   - *Any token not wrapped in brackets will be parsed and replaced with its corresponding date component.*
	 *   - Please refer to {@link https://chronos.nazmul-nhb.dev/docs/chronos/format#format-tokens format tokens} for details.
	 */
	format?: string;
	/** - Whether to use UTC time. Defaults to `false`. */
	useUTC?: boolean;
}

/** - Configuration options for greeting. */
export interface GreetingConfigs {
	/** Time when the morning period ends (HH:MM format). Defaults to `11:59` */
	morningEnds?: ClockTime;
	/** Time when the noon period ends (HH:MM format). Defaults to `12:59` */
	noonEnds?: ClockTime;
	/** Time when the afternoon period ends (HH:MM format). Defaults to `17:59` */
	afternoonEnds?: ClockTime;
	/** Time when the evening period ends (HH:MM format). Defaults to `23:59` */
	eveningEnds?: ClockTime;
	/** Time when the midnight period ends (HH:MM format). Defaults to `02:59` */
	midnightEnds?: ClockTime;
	/** Current time in "HH:MM" format for some weird reason. Defaults to current time `new Date()` */
	currentTime?: ClockTime;
	/** Optional string to append after each message */
	appendToMsg?: string;
	/** Optional string to prepend before each message */
	prependToMsg?: string;
	/** Custom greeting message for the morning period. */
	morningMessage?: string;
	/** Custom greeting message for the noon period. */
	noonMessage?: string;
	/** Custom greeting message for the afternoon period. */
	afternoonMessage?: string;
	/** Custom greeting message for the evening period. */
	eveningMessage?: string;
	/** Custom greeting message for the midnight period. */
	midnightMessage?: string;
	/** Default greeting message if no period matches. */
	defaultMessage?: string;
}

/** Time zone details object */
export interface TimeZoneDetails {
	/** IANA time zone identifier */
	tzIdentifier: $TimeZoneIdentifier;
	/** Long localized form (e.g., `'Pacific Standard Time'`, `'Nordamerikanische Westküsten-Normalzeit'`) */
	tzNameLong: Maybe<LooseLiteral<TimeZoneName>>;
	/** Long generic non-location format (e.g.: `'Pacific Time'`, `'Nordamerikanische Westküstenzeit'`) */
	tzNameLongGeneric: Maybe<LooseLiteral<TimeZoneName>>;
	/** Long localized GMT format, prefixed with `"GMT"` (e.g., `"GMT-08:00"`) */
	tzNameLongOffset: Maybe<LooseLiteral<$GMTOffset>>;
}

/** Name of time unit from `year` to `millisecond` */
export type TimeUnit =
	| 'year'
	| 'month'
	| 'day'
	| 'week'
	| 'hour'
	| 'minute'
	| 'second'
	| 'millisecond';

/** Name of time unit from `year` to `millisecond`, excluding `week` */
export type FromNowUnit = Exclude<TimeUnit, 'week'>;

/** Conditional value for {@link TimeUnit} */
export type TimeUnitValue<Unit extends TimeUnit> = Unit extends 'month'
	? NumberRange<1, 12>
	: Unit extends 'week'
		? NumberRange<1, 53>
		: Unit extends 'day'
			? NumberRange<1, 31>
			: Unit extends 'hour'
				? Enumerate<24>
				: Unit extends 'minute' | 'second'
					? Enumerate<60>
					: Unit extends 'millisecond'
						? Milliseconds
						: number;

/** Unit suffix for {@link Date} getter methods (e.g., `'FullYear'` in `'getFullYear'`, `'Month'` in `'getMonth'` etc.). */
export type $DateUnit =
	| 'FullYear'
	| 'Month'
	| 'Day'
	| 'Date'
	| 'Hours'
	| 'Minutes'
	| 'Seconds'
	| 'Milliseconds';

/** `BCP47` locale string or {@link Intl.Locale} object that contain one or more language or locale tags */
export type $LocalArguments =
	| LooseLiteral<LocaleCode | Split<LocaleCode, '-'>[0]>
	| Intl.Locale;

/** `BCP47` locale string, array of locale strings, {@link Intl.Locale} object, or array of {@link Intl.Locale} objects that contain one or more language or locale tags. */
export type LocalesArguments = $LocalArguments | $LocalArguments[];

/** Locale calendars supported by {@link Intl} API */
export type LocaleCalendar = (typeof LOCALE_CALENDARS)[number];

/** Locale numbering systems supported by {@link Intl} API */
export type NumberingSystem = (typeof LOCALE_NUMBERING_SYSTEMS)[number];

/**
 * * Interface for defining options for relative date formatting.
 *
 * @remarks This interface is an extension of {@link Intl.RelativeTimeFormatOptions} and is used by `formatRelativeDateNative` function to format dates relative to a given date.
 */
export interface RelativeDateFormatOptions extends Intl.RelativeTimeFormatOptions {
	/**
	 * * The date to compare against. Defaults to {@link Date new Date()}. Can be any type of {@link DateArgs}.
	 */
	fromDate?: DateArgs;
	/**
	 * * The locale to use for formatting. Defaults to `'en'`.
	 */
	locale?: LocalesArguments;
}

/** Record of TimeUnits and number values where at least one property is required. */
export type UnitWithValue = RequireAtLeast<{ [U in TimeUnit]?: Numeric }, 1>;
