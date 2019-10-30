module Template.ElementVariables {
	/**
	 * Variable controller.
	 *
	 * Provides simple interface to template variable control.
	 */
	export class Controller {
		public static readonly CLASS_SELECTOR = "js-update";

		get element(): HTMLElement {
			return this._element;
		}

		private readonly _element: HTMLElement;
		private readonly _module: Modules.ModuleInterface;

		constructor(element: HTMLElement) {
			this._element = element;

			// get module name
			let module_name = this.element.getAttribute("data-module");
			if (!module_name)
				ControllerError.SpecError(this.element.id, "Attribute 'data-module' undefined.");

			// get arguments
			let module_args_json = this.element.getAttribute("data-module-args");
			let module_args: object;
			try {
				module_args = JSON.parse(module_args_json);
			} catch (e) {
				ControllerError.SpecError(this.element.id, "Value of attribute 'data-module-args' malformed. (" + e + ")");
			}

			// instantiate and initialize module
			try {
				this._module = new Modules[module_name](this);
				this._module.Initialize(module_args);
			} catch (e) {
				ControllerError.SpecError(this.element.id, "Failed to initialize specified module. (" + e + ")");
			}
		}

		//=====================================================================dd==
		//  TEMPLATE VARIABLES CORE FUNCTIONALITY
		//=====================================================================dd==

		/**
		 * Processes data provided by CG_UPDATE command.
		 *
		 * @param data Data provided by CasparCG server.
		 */
		public Update(data: any): void {
			this._module.Update(data);
		}
	}

	class ControllerError {
		public static SpecError(element_id: string, reason: string) {
			throw new Error(
				`Invalid update specification for element #${element_id}: ${reason}`
			)
		}
	}
}