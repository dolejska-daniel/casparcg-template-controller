module Template.ElementVariables.Modules {
	/**
	 * Generic update module interface.
	 */
	export interface ModuleInterface {
		/**
		 * Initializes module by providing element specified arguments.
		 *
		 * @param args Array of module-specific arguments.
		 */
		Initialize(args: object): void;

		/**
		 * Triggers content update by providing update content data.
		 *
		 * @param data Updated contents.
		 */
		Update(data: any): void;
	}
}