module Template.ElementVariables.Modules {
	/**
	 * Base update module.
	 *
	 * Abstract update module implementation.
	 */
	export abstract class BaseModule implements ModuleInterface {
		get element(): HTMLElement {
			return this._controller.element;
		}

		private readonly _controller: ElementVariables.Controller;

		/**
		 * @param controller Element specific controller.
		 */
		constructor(controller: ElementVariables.Controller) {
			this._controller = controller;
		}

		/**
		 * @inheritDoc ModuleInterface
		 */
		abstract Initialize(args: object): void;

		/**
		 * @inheritDoc ModuleInterface
		 */
		abstract Update(data: any): void;
	}
}