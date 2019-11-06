module Template.Utils {
	/**
	 * Utilities for random generation of any kind.
	 */
	export class Random {
		/**
		 * Generates random string of 5 characters prefixed by underscore.
		 */
		public static GetRandomId(): string {
			return "_" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
		}
	}
}