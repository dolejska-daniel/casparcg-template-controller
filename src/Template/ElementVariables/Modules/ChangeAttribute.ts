///<reference path="BaseModule.ts"/>
module Template.ElementVariables.Modules {
	/**
	 * ChangeAttribute update module.
	 *
	 * This module provides attribute replacement/formatting.
	 * It uses update data as element's attribute names and values.
	 */
	export class ChangeAttribute extends BaseModule {

		private attributeDefaults: object = {};

		public Initialize(args: object): void {
			for (let attribute_name in args) {
				if (args.hasOwnProperty(attribute_name) == false)
					continue;

				if (typeof attribute_name != "string") {
					console.warn(`ChangeAttribute module update data contains non-string attribute name '${attribute_name}'!`);
					continue;
				}

				let value = args[attribute_name];
				if (typeof value != "string" && typeof value != "number") {
					console.warn(`ChangeAttribute module argument data contains non-trivial attribute value '${value}' for attribute '${attribute_name}'!`);
					continue;
				}

				this.attributeDefaults[attribute_name] = value;
			}
		}

		public Update(data: any): void {
			if (typeof data != "object")
				return console.warn("ChangeAttribute module received non-object update data!");

			for (let attribute_name in data) {
				if (data.hasOwnProperty(attribute_name) == false)
					continue;

				if (typeof attribute_name != "string") {
					console.warn(`ChangeAttribute module update data contains non-string attribute name '${attribute_name}'!`);
					continue;
				}

				this.UpdateAttribute(attribute_name, data[attribute_name]);
			}
		}

		private UpdateAttribute(attribute_name: string, data: any): void {
			let content = this.attributeDefaults[attribute_name] || data;
			if (typeof data == "object") {
				if (typeof this.attributeDefaults[attribute_name] == "undefined")
					return console.warn(`ChangeAttribute module update data contains non-trivial attribute value '${attribute_name}' for attribute '${attribute_name}', but no formatting has been predefined!`);

				data.reverse();
				do {
					let replacement = data.pop();
					if (content.indexOf('{}') == -1) {
						console.warn(`ChangeAttribute module update data do contain too many values for '${attribute_name}' attribute' formatting!`);
						continue;
					}
					content = content.replace('{}', replacement);
				}
				while (data.length > 0);

				if (content.indexOf('{}') != -1)
					console.warn(`ChangeAttribute module update data does not contain enough values for '${attribute_name}' attribute' formatting!`);
			}

			try {
				this.element.setAttribute(attribute_name, content);
			} catch (e) {
				console.error(`ChangeAttribute module update data contain invalid attribute name '${attribute_name}'!`);
			}
		}
	}
}