module Template.ElementReference {
	export class Manager {
		private static _instance: Manager;

		private readonly _entries: ElementReference.Entry[];
		private readonly _dependencies: string[][];

		constructor() {
			if (Manager._instance)
				throw new Error("Template.ElementReference.Manager is implemented as a singleton. Creating new instances is not allowed.");
			Manager._instance = this;

			this._entries = [];
			this._dependencies = [];
		}

		/**
		 * Get existing or create new element reference manager instance.
		 */
		public static GetInstance(): Manager {
			if (Manager._instance)
				return Manager._instance;

			return new Manager();
		}

		//=====================================================================dd==
		//  TARGET ELEMENT CONTROLS
		//=====================================================================dd==

		public RegisterElement(element: HTMLElement): ElementReference.Entry {
			if (this._entries.hasOwnProperty(element.id))
				throw new Error(`Element #${element.id} has already been registered in ElementReference.Manager.`);

			let entry = new Entry(element);
			this._entries[element.id] = entry;
			this._dependencies[element.id] = [];

			let variable_elements = element.getElementsByClassName(ElementVariables.Controller.CLASS_SELECTOR);
			for (let element_id = 0; element_id < variable_elements.length; element_id++)
				this.RegisterDependency(element.id, <HTMLElement>variable_elements.item(element_id));

			return entry;
		}

		public RegisterDependency(element_id: string, depending_element: HTMLElement): void {
			if (this._dependencies[element_id] == undefined)
				throw new Error(`Failed to register depending element #${depending_element.id} to unregistered element #${element_id}.`);

			this._dependencies[element_id].push(depending_element.id);
		}

		public ElementReplaced(element: HTMLElement): void {
			if (this._dependencies[element.id] == undefined)
				throw new Error(`Failed to update element reference of unregistered element #${element.id}.`);

			let dependencies = this._dependencies[element.id];
			for (let dependency_id in dependencies) {
				if (dependencies.hasOwnProperty(dependency_id)) {
					let depending_element_id = dependencies[dependency_id];
					this._entries[depending_element_id].UpdateReferenceQuietly(document.getElementById(depending_element_id));
				}
			}
		}

		public UpdateBaseContents(): void {
			for (let element_id in this._entries) {
				if (this._entries.hasOwnProperty(element_id)) {
					let entry = this._entries[element_id];
					entry.UpdateBaseContents();
				}
			}
		}
	}
}
