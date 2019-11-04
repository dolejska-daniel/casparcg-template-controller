///<reference path="BaseModule.ts"/>
module Template.ElementVariables.Modules {
	import has = Reflect.has;

	/**
	 * InsertElement update module.
	 *
	 * This module provides complete content insertion functionality.
	 * It uses update data as element's additional content.
	 */
	export class InsertElement extends BaseModule {
		private templateInstanceId: number = 0;
		private templateElement: HTMLElement;
		private variableElements: HTMLElement[];

		public Initialize(args: object): void {
			if (args)
				console.warn("InsertElement module does not accept any arguments!");

			// check template existence
			let template_elements = this.element.getElementsByClassName("js-insert-template");
			if (template_elements.length != 1)
				return console.error(`Single InsertElement module' template element (class='js-insert-template') is required to be present (${template_elements.length} found)!`);

			// duplicate template and remove it from page
			this.templateElement = <HTMLElement>template_elements[0].cloneNode(true);
			if (!this.templateElement.id)
				return console.error("Elements with 'js-update-element' class are required to have unique identifiers (id='XXX').");
			this.element.removeChild(template_elements[0]);

			// register defined variables (to ease access)
			this.variableElements = [];
			let variable_elements = this.templateElement.getElementsByClassName("js-insert-var");
			for (let element_id = 0; element_id < variable_elements.length; element_id++) {
				let variable_element = variable_elements.item(element_id);
				if (!variable_element.id || variable_element.id.indexOf(`${this.element.id}-`))
					return console.error(`InsertElement module's variable template elements are required to have unique identifiers with template ID prefix (id='${this.element.id}-XXX')!`);

				let variable_element_id = variable_element.id.substring(this.element.id.length + 1);
				this.variableElements[variable_element_id] = <HTMLElement>variable_element;
			}
		}

		public Update(data: any): void {
			// process provided data
			for (let variable_id in data) {
				if (data.hasOwnProperty(variable_id) == false)
					continue;

				if (this.variableElements.hasOwnProperty(variable_id) == false) {
					console.warn(`InsertElement module update data do contain value of template-undefined variable '${variable_id}'!`);
					continue;
				}

				this.variableElements[variable_id].innerHTML = data[variable_id];
			}
			// check predefined variables
			for (let variable_id in this.variableElements) {
				if (this.variableElements.hasOwnProperty(variable_id) == false)
					continue;

				if (data.hasOwnProperty(variable_id) == false)
					return console.error(`InsertElement module update data is missing value for template-defined variable '${variable_id}'!`);
			}

			// clone template with new data and update its ID
			let element = <HTMLElement>this.templateElement.cloneNode(true);
			element.id = `${element.id}-${this.templateInstanceId}`;

			// update IDs of underlying variable elements
			let variable_elements = element.getElementsByClassName("js-insert-var");
			for (let element_id = 0; element_id < variable_elements.length; element_id++) {
				let variable_element = <HTMLElement>variable_elements.item(element_id);
				variable_element.id = `${variable_element.id}-${this.templateInstanceId}`;
			}

			// insert child to page
			this.templateInstanceId++;
			this.element.appendChild(element);

			let selector = ElementAnimation.Controller.CLASS_SELECTOR;
			let template_controller = Template.Controller.GetInstance();

			// check whether insert template is animated and register it if so
			let hasClass = new RegExp(`(^${selector}\\s)|(\\s${selector}\\s)|(\\s${selector}$)|(^${selector}$)`);
			if (element.classList.value.match(hasClass))
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