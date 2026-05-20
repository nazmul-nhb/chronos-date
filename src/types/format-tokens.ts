import type { LooseLiteral } from 'nhb-toolbox/utils/types';
import type {
	DATE_FORMATS,
	DAY_FORMATS,
	HOUR_FORMATS,
	MILLISECOND_FORMATS,
	MINUTE_FORMATS,
	MONTH_FORMATS,
	SECOND_FORMATS,
	TIME_FORMATS,
	YEAR_FORMATS,
} from '../constants/basic';

/** Year in either 4 or 2 digits format */
export type YearToken = (typeof YEAR_FORMATS)[number];
/** Month in either 1 or 2 digits or 3 letters or full word format */
export type MonthToken = (typeof MONTH_FORMATS)[number];
/** Day in either 2 letters or full word format */
export type DayToken = (typeof DAY_FORMATS)[number];
/** Date in either 1 or 2 digits format */
export type DateToken = (typeof DATE_FORMATS)[number];
/** Second in either 1 or 2 digits format */
export type HourToken = (typeof HOUR_FORMATS)[number];
/** Second in either 1 or 2 digits format */
export type MinuteToken = (typeof MINUTE_FORMATS)[number];
/** Second in either 1 or 2 digits format */
export type SecondToken = (typeof SECOND_FORMATS)[number];
/** Millisecond in either 1 or 2 digits format */
export type MSToken = (typeof MILLISECOND_FORMATS)[number];
/** Time formats in either capital or lowercase `am/pm` format */
export type TimeToken = (typeof TIME_FORMATS)[number];

/** Standard date/time format tokens for `Chronos`. */
export type FormatToken =
	| YearToken
	| MonthToken
	| DayToken
	| DateToken
	| HourToken
	| MinuteToken
	| SecondToken
	| MSToken
	| TimeToken
	| 'Z'
	| 'ZZ';

/** Standard date formats. */
export type DateFormatToken =
	| `${DateToken} ${Exclude<MonthToken, 'M' | 'MM'>}`
	| `${Exclude<MonthToken, 'M' | 'MM'>} ${DateToken}`
	| `${DayToken}, ${DateToken} ${Exclude<MonthToken, 'M' | 'MM'>}`
	| `${DayToken}, ${Exclude<MonthToken, 'M' | 'MM'>} ${DateToken}`
	| `${Exclude<MonthToken, 'M' | 'MM'>} ${DateToken}, ${YearToken}`
	| `${DateToken} ${Exclude<MonthToken, 'M' | 'MM'>}, ${YearToken}`
	| `${Exclude<MonthToken, 'M' | 'MM'>} ${DateToken} ${YearToken}`
	| `${DateToken} ${Exclude<MonthToken, 'M' | 'MM'>} ${YearToken}`
	| `${DayToken}, ${Exclude<MonthToken, 'M' | 'MM'>} ${DateToken}, ${YearToken}`
	| `${DayToken}, ${DateToken} ${Exclude<MonthToken, 'M' | 'MM'>}, ${YearToken}`
	| `${DayToken}, ${Exclude<MonthToken, 'M' | 'MM'>} ${DateToken} ${YearToken}`
	| `${DayToken}, ${DateToken} ${Exclude<MonthToken, 'M' | 'MM'>} ${YearToken}`
	| `${Exclude<DateToken, 'Do'>}.${Exclude<MonthToken, 'mmm' | 'mmmm'>}.${YearToken}`
	| `${YearToken}.${Exclude<MonthToken, 'mmm' | 'mmmm'>}.${Exclude<DateToken, 'Do'>}`
	| `${Exclude<DateToken, 'Do'>}/${Exclude<MonthToken, 'mmm' | 'mmmm'>}/${YearToken}`
	| `${Exclude<DateToken, 'Do'>}-${Exclude<MonthToken, 'mmm' | 'mmmm'>}-${YearToken}`
	| `${Exclude<MonthToken, 'mmm' | 'mmmm'>}/${Exclude<DateToken, 'Do'>}/${YearToken}`
	| `${Exclude<MonthToken, 'mmm' | 'mmmm'>}-${Exclude<DateToken, 'Do'>}-${YearToken}`
	| `${YearToken}-${Exclude<MonthToken, 'mmm' | 'mmmm'>}-${Exclude<DateToken, 'Do'>}`
	| `${YearToken}/${Exclude<MonthToken, 'mmm' | 'mmmm'>}/${Exclude<DateToken, 'Do'>}`
	| `${YearToken}-${Exclude<DateToken, 'Do'>}-${Exclude<MonthToken, 'mmm' | 'mmmm'>}`
	| `${YearToken}/${Exclude<DateToken, 'Do'>}/${Exclude<MonthToken, 'mmm' | 'mmmm'>}`;

/** Standard Time Formats */
export type TimeFormatToken =
	| `${Exclude<HourToken, 'h' | 'hh' | 'H'>}:${Exclude<MinuteToken, 'm'>}`
	| `${Exclude<HourToken, 'H' | 'HH' | 'h'>}:${Exclude<MinuteToken, 'm'>} ${TimeToken}`
	| `${Exclude<HourToken, 'h' | 'hh' | 'H'>}:${Exclude<MinuteToken, 'm'>}:${Exclude<SecondToken, 's'>}`
	| `${Exclude<HourToken, 'H' | 'HH' | 'h'>}:${Exclude<MinuteToken, 'm'>}:${Exclude<SecondToken, 's'>} ${TimeToken}`
	| `${Exclude<HourToken, 'h' | 'hh' | 'H'>}:${Exclude<MinuteToken, 'm'>}:${Exclude<SecondToken, 's'>}:${Exclude<MSToken, 'ms'>}`
	| `${Exclude<HourToken, 'H' | 'HH' | 'h'>}:${Exclude<MinuteToken, 'm'>}:${Exclude<SecondToken, 's'>}:${Exclude<MSToken, 'ms'>} ${TimeToken}`;

type DateTimeISO = 'YYYY-MM-DDTHH:mm:ss.mssZZ';
type TokenConnector = ' ' | ', ' | '; ' | ' - ';

/** Format tokens for time only string */
export type TimeOnlyFormat = LooseLiteral<TimeFormatToken>;

/** Pre-defined literal types for formatting date and time. Optionally can pass any string. */
export type SafeFormat = LooseLiteral<
	| DateTimeISO
	| DateFormatToken
	| TimeFormatToken
	| `${DateFormatToken}${TokenConnector}${TimeFormatToken}`
>;
