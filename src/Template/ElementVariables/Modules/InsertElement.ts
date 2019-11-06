///<reference path="BaseModule.ts"/>
module Template.ElementVariables.Modules {
	/**
	 * InsertElement update module.
	 *
	 * This module provides complete content insertion functionality.
	 * It uses update data as element's additional content.
	 */
	export class InsertElement extends BaseModule {
		public static readonly TEMPLATE_CLASS_SELECTOR = "js-insert-template";
		public static readonly TEMPLATE_VAR_CLASS_SELECTOR = "js-insert-var";

		private templateInstanceId: number = 0;
		private templateElement: HTMLElement;
		private variableElements: HTMLElement[];

		public Initialize(args: object): void {
			if (args)
				console.warn("InsertElement module does not accept any arguments!");

			// check template existence
			let template_elements = this.element.getElementsByClassName(InsertElement.TEMPLATE_CLASS_SELECTOR);
			if (template_elements.length != 1)
				return console.error(`Single InsertElement module' template element (class='${InsertElement.TEMPLATE_CLASS_SELECTOR}') is required to be present (${template_elements.length} found)!`);

			// duplicate template and remove it from page
			this.templateElement = <HTMLElement>template_elements[0].cloneNode(true);
			this.element.removeChild(template_elements[0]);

			// register defined variables (to ease access)
			this.variableElements = [];
			let variable_elements = this.templateElement.getElementsByClassName(InsertElement.TEMPLATE_VAR_CLASS_SELECTOR);
			for (let element_id = 0; element_id < variable_elements.length; element_id++) {
				let variable_element = variable_elements.item(element_id);

				// make sure that variable elements' IDs have prefix of main element id
				if (!variable_element.id || variable_element.id.indexOf(`${this.element.id}-`) == -1)
					return console.error(`InsertElement module's variable template elements are required to have unique identifiers with parent ID prefix (id='${this.element.id}-XXX')!`);

				// store the ID without prefix
				let variable_element_id = variable_element.id.substring(this.element.id.length + 1);
				this.variableElements[variable_element_id] = <HTMLElement>variable_element;
			}
		}

		public ProcessUpdate(data: any): void {
			// process provided data - do all specified values exist?
			for (let variable_id in data) {
				if (data.hasOwnProperty(variable_id) == false)
					continue;

				if (this.variableElements.hasOwnProperty(variable_id) == false) {
					console.warn(`InsertElement module update data do contain value of template-undefined variable '${variable_id}'!`);
					continue;
				}

				this.variableElements[variable_id].innerHTML = data[variable_id];
			}

			// check predefined variables - has all variables been provided?
			for (let variable_id in this.variableElements) {
				if (this.variableElements.hasOwnProperty(variable_id) == false)
					continue;

				if (data.hasOwnProperty(variable_id) == false)
					return console.error(`InsertElement module update data is missing value for template-defined variable '${variable_id}'!`);
			}

			// clone template with new data and update its ID
			let element = <HTMLElement>this.templateElement.cloneNode(true);
			if (element.id) {
				// make sure there are no IDs twice
				element.id = `${element.id}-${this.templateInstanceId}`;
			} else if (Utils.Regex.HasClass(element, ElementAnimation.Controller.CLASS_SELECTOR)) {
				// element is animated and has no ID defined
				// generate random one
				element.id = Utils.Random.GetRandomId();
			}

			// update IDs of underlying variable elements
			let variable_elements = element.getElementsByClassName(InsertElement.TEMPLATE_VAR_CLASS_SELECTOR);
			for (let element_id = 0; element_id < variable_elements.length; element_id++) {
				let variable_element = <HTMLElement>variable_elements.item(element_id);
				variable_element.id = `${variable_element.id}-${this.templateInstanceId}`;
			}

			// insert child to page
			this.templateInstanceId++;
			this.element.appendChild(element);

			// template controller shortcut
			let template_controller = Template.Controller.GetInstance();

			// check whether insert template is animated and if so - register it
			if (Utils.Regex.HasClass(element, ElementAnimation.Controller.CLASS_SELECTOR))
				template_controller.RegisterAnimatedElement(element);

			// register animated child elements
			let animated_elements = element.getElementsByClassName(ElementAnimation.Controller.CLASS_SELECTOR);
			for (let element_index = 0; element_index < animated_elements.length; element_index++) {
				let element = <HTMLElement>animated_elements.item(element_index);
				template_controller.RegisterAnimatedElement(element);
			}
		}
	}
}