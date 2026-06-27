import type { DATE_PARTS, WESTERN_ZODIAC_SIGNS, ZODIAC_PRESETS } from 'src/constants/basic';
import type { SEASON_PRESETS } from 'src/constants/seasons';
import type {
	$Chronos,
	$CommonRangeOptions,
	ChronosInput,
	RangedChronosFormat,
} from 'src/types/chronos-specific';
import type { ClockHour, MonthDateString, WeekDay } from 'src/types/date-time';
import type { Enumerate, NumberRange } from 'toolbox-x/types/number';
import type { RangeTuple } from 'toolbox-x/types/utils';

/** * A plugin that augments the `Chronos` class with methods or properties. */
export type ChronosPlugin = (Chronos: $Chronos) => void;

/** ISO date-based range (format: `MM-DD`) e.g. `01-14` for 'January 14' */
export interface DateBoundary {
	/** Start date in `MM-DD` format, e.g. `01-18` means 'January 18' */
	startDate: MonthDateString;
	/** End date in `MM-DD` format, e.g. `03-17` means 'March 17' */
	endDate: MonthDateString;
}

/** Inclusive month index-based range `0-11` (0 = January) */
export interface MonthBoundary {
	/** Inclusive start month index (0 = January) */
	startMonth: Enumerate<12>;
	/** Inclusive end month index (0 = January) */
	endMonth: Enumerate<12>;
}

/** Season definition for season configuration */
export interface SeasonDefinition {
	/** Name of the season */
	name: string;
	/** Inclusive date/month boundary of the season */
	boundary: MonthBoundary | DateBoundary;
}

/** Name of a predefined season preset */
export type SeasonPreset = keyof typeof SEASON_PRESETS;

/** Options for configuring seasons */
export interface SeasonOptions {
	/** Custom season list to override or define seasons manually */
	seasons?: SeasonDefinition[];
	/** Predefined preset to use for season calculation */
	preset?: SeasonPreset;
}

export interface $BusinessHourBaseOptions {
	/** - Optional starting hour of business time (0–23). Defaults to `9` (9 AM). */
	businessStartHour?: Enumerate<24>;
	/** - Optional ending hour of business time (0–23). Defaults to `17` (5 PM). */
	businessEndHour?: Enumerate<24>;
}

/** Options for configuring business hour with `weekStartsOn` and `weekendLength` */
export interface BusinessOptionsBasic extends $BusinessHourBaseOptions {
	/** - Optional day the week starts on (0–6). Default is `0` (Sunday). */
	weekStartsOn?: Enumerate<7>;
	/** - Optional weekend length (1-4). Default is `2`.*/
	weekendLength?: NumberRange<1, 4>;
}

/** Options for configuring business hour with `weekendDays` tuple */
export interface BusinessOptionsWeekends extends $BusinessHourBaseOptions {
	/** - Tuple of indices (0-6) of weekend days. Can pass only 1-4 elements. Default is `undefined`. */
	weekendDays?: RangeTuple<Enumerate<7>, 1, 4>;
}

/** Options for configuring business hour */
export type $BusinessHourOptions = BusinessOptionsBasic | BusinessOptionsWeekends;

/** Names of standard Zodiac signs */
export type ZodiacSign = (typeof WESTERN_ZODIAC_SIGNS)[number][0];

/** Presets for Zodiac Sign Configuration */
export type ZodiacPreset = keyof typeof ZODIAC_PRESETS;

/** Shape of Zodiac signs array */
export type ZodiacArray<Sign extends string = ZodiacSign> = Array<
	| [Sign, [NumberRange<1, 12>, NumberRange<1, 31>]]
	| Readonly<[Sign, Readonly<[NumberRange<1, 12>, NumberRange<1, 31>]>]>
>;

/** Zodiac metadata options */
export interface ZodiacMetaOptions<Sign extends string = ZodiacSign> {
	/**
	 * Optional Zodiac preset to use. Default is `western`.
	 * - **Note:** `western` and `tropical`, `vedic` and `sidereal` are same.
	 */
	preset?: ZodiacPreset;
	/** Custom Zodiac date ranges, overrides {@link preset presets}. */
	custom?: ZodiacArray<Sign> | Readonly<ZodiacArray<Sign>>;
}

/** Options for configuring Zodiac sign getter */
export interface ZodiacOptions<Sign extends string = ZodiacSign>
	extends ZodiacMetaOptions<Sign> {
	/** - Optional birthdate in `MM-DD` format (`1`-based month). */
	birthDate?: MonthDateString;
}

/** Represents resolved metadata for a zodiac sign */
export interface ZodiacMeta<Sign extends string = ZodiacSign> {
	/**
	 * Index (`0`-based) of the zodiac sign within the resolved and chronologically sorted zodiac list.
	 *
	 * ⚠️ **Notes:**
	 * - The `index` is determined by the Gregorian month–day order of zodiac start dates and may differ between variants (e.g. Western vs Vedic).
	 * - This `index` should not be interpreted as a traditional or mythological zodiac ordering.
	 */
	index: number;
	/** The zodiac sign name. */
	sign: Sign;
	/** Inclusive start date of the zodiac sign in `MM-DD` format. */
	start: MonthDateString;
	/** Inclusive end date of the zodiac sign in `MM-DD` format. */
	end: MonthDateString;
}

/** Definition of day part names. */
export type DayPart = (typeof DATE_PARTS)[number];

/** Object type for extracting day parts. */
export type DayPartConfig = Partial<Record<DayPart, [ClockHour, ClockHour]>>;

/** Academic year, e.g. `2024-2025` */
export type AcademicYear = `${number}-${number}`;

/** Return object type of `duration` method of `Chronos`. */
export interface TimeDuration {
	/** Total number of years. */
	years: number;
	/** Number of months remaining after full years are counted. */
	months: number;
	/** Number of days remaining after full months are counted. */
	days: number;
	/** Number of hours remaining after full days are counted. */
	hours: number;
	/** Number of minutes remaining after full hours are counted. */
	minutes: number;
	/** Number of seconds remaining after full minutes are counted. */
	seconds: number;
	/** Number of milliseconds remaining after full seconds are counted. */
	milliseconds: number;
}

/** Key of {@link TimeDuration} */
export type DurationKey = keyof TimeDuration;

/** Options for formatting duration string */
export interface DurationOptions {
	/** The time to compare with. Defaults to `now`. */
	toTime?: ChronosInput;
	/** If true, returns all values as positive numbers. Defaults to `true`. */
	absolute?: boolean;
	/** Maximum number of units to display, e.g. 2 → "1 hour, 20 minutes" */
	maxUnits?: NumberRange<1, 7>;
	/** Separator between units (default: `", "`) */
	separator?: string;
	/** Display mode: `"full"` (default) → "2 hours", `"short"` → "2h" */
	style?: 'full' | 'short';
	/** Whether to include zero values (default: `false`) */
	showZero?: boolean;
}

/** Common options to either skip or keep days */
interface $SkipOrKeepDays {
	/**
	 * An array of weekdays to exclude from the date range.
	 * - Accepts either weekday names (e.g., `'Saturday'`, `'Sunday'`) or numeric indices (0 for Sunday to 6 for Saturday).
	 * - Ignored if {@link onlyDays} is provided.
	 *
	 * @example
	 * skipDays: ['Saturday', 'Sunday']
	 * skipDays: [0, 6] // Sunday and Saturday
	 */
	skipDays?: Array<WeekDay> | Array<Enumerate<7>>;

	/**
	 * An array of weekdays to explicitly include in the date range.
	 * - Accepts either weekday names (e.g., `'Monday'`, `'Wednesday'`) or numeric indices (0 for Sunday to 6 for Saturday).
	 * - When provided, this overrides {@link skipDays} and includes only the specified days.
	 *
	 * @example
	 * onlyDays: ['Monday', 'Wednesday']
	 * onlyDays: [1, 3] // Monday and Wednesday
	 */
	onlyDays?: Array<WeekDay> | Array<Enumerate<7>>;
}

/** - Options to define a **fixed date range** using explicit `from` and `to` dates. */
export interface RangeWithDates<F extends RangedChronosFormat = 'local'>
	extends $CommonRangeOptions<F>,
		$SkipOrKeepDays {
	/** - Start date of the range (inclusive). Defaults to the current `Chronos` instance if not provided. */
	from?: ChronosInput;

	/** - End date of the range (inclusive). Defaults to **4 weeks from the current `Chronos` instance** if not provided. */
	to?: ChronosInput;
}

/** - Options to define a **relative date range** starting from the current date. */
export interface RelativeDateRange<F extends RangedChronosFormat = 'local'>
	extends $CommonRangeOptions<F>,
		$SkipOrKeepDays {
	/**
	 * The number of time units to move **forward from current `Chronos` instance**.
	 *
	 * - Determines the size of the range.
	 * - `current` → `start`, and `start + span` → `end`.
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

/** - Unified type that supports either a fixed or relative date range configuration. */
export type DatesInRangeOptions<F extends RangedChronosFormat = 'local'> =
	| RangeWithDates<F>
	| RelativeDateRange<F>;
