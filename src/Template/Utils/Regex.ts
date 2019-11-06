module Template.Utils {
	/**
	 * Utilities for generic regex usage of any kind.
	 */
	export class Regex {
		/**
		 * Generates random string of 5 characters prefixed by underscore.
		 */
		public static HasClass(element: HTMLElement, class_name: string): boolean {
			let regex = new RegExp(`(^${class_name}\\s)|(\\s${class_name}\\s)|(\\s${class_name}$)|(^${class_name}$)`);
			return !!element.classList.value.match(regex);
		}
	}
}