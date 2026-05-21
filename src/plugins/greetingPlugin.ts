import type { ChronosPlugin, ClockTime, GreetingConfigs } from '../types';
import { getGreeting } from '../utils/greet';

declare module 'chronos-date' {
	interface Chronos {
		/**
		 * @instance Returns a greeting message based on current instance of `Chronos` time or provided time in the `configs`.
		 *
		 * @remarks This method internally uses {@link https://chronos.nazmul-nhb.dev/docs/utils/get-greeting getGreeting} function.
		 *
		 * @param configs - Configuration options for greeting times and messages.
		 * @returns The appropriate greeting message.
		 */
		getGreeting(configs?: GreetingConfigs): string;

		/**
		 * @instance Returns a greeting message based on current instance of `Chronos` time or provided time in the `configs`.
		 *
		 * @remarks This method is an alias for {@link Chronos.getGreeting getGreeting} method.
		 *
		 * @param configs - Configuration options for greeting times and messages.
		 * @returns The appropriate greeting message.
		 */
		greet(configs?: GreetingConfigs): string;
	}
}

/** * Plugin to inject `getGreeting`/`greet` method */
export const greetingPlugin: ChronosPlugin = ($Chronos) => {
	$Chronos.prototype.getGreeting = function (configs) {
		const currentTime = this.formatSafe('HH:mm') as ClockTime;

		return getGreeting({ currentTime, ...configs });
	};

	$Chronos.prototype.greet = function (configs) {
		return this.getGreeting(configs);
	};
};
