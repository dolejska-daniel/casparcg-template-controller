///<reference path="BaseModule.ts"/>
module Template.ElementVariables.Modules {
	/**
	 * ReplaceContents update module.
	 *
	 * This module provides complete content replacement functionality.
	 * It uses update data as element's new content.
	 */
	export class ReplaceContents extends BaseModule {
		public Initialize(args: object): void {
			if (args)
				console.warn("ReplaceContents module does not accept any arguments!");
		}

		public Update(data: any): void {
			if (typeof data != "string" && typeof data != "number")
				console.warn("ReplaceContents module received non-string update data!");

			this.element.innerHTML = data.toString();
		}
	}
}