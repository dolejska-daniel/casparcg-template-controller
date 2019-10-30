module Template.ElementVariables {
	/**
	 * Variable update dependency.
	 *
	 * This class allows animations to be started after completion of specified
	 * animation (even on completely different element).
	 */
	export class Dependency {

		private readonly _variable_id: string;
		private readonly _callbacks: (() => void)[];

		/**
		 * @constructor
		 */
		constructor(variable_id: string) {
			this._variable_id = variable_id;
			this._callbacks = [];
		}

		//=====================================================================dd==
		//  VARIABLE UPDATE DEPENDENCY CORE FUNCTIONALITY
		//=====================================================================dd==

		/**
		 * Registers depending animation's trigger function.
		 *
		 * @param callback Animation trigger function.
		 */
		public AddDependency(callback: () => void): void {
			this._callbacks.push(callback);
		}

		/**
		 * Triggers all registered animations.
		 */
		public TriggerDependencies(): void {
			for (let callback_id = 0; callback_id < this._callbacks.length; callback_id++)
				this._callbacks[callback_id]();
		}
	}
}