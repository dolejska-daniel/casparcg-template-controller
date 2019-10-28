module Template.ElementVariables {
    /**
     * Vairable controller.
     *
     * Provides simple interface to template variable control.
     */
    export class Controller {
        private _element: HTMLElement;
        private _module: Modules.Module;

        constructor(element: HTMLElement) {
            this._element = element;

            let update_settings_json = element.getAttribute("data-update");
            let update_settings = JSON.parse(update_settings_json);
            if (update_settings == false)
                throw new Error("Invalid update specification for element #" + element.id + " provided - data attribute is missing.");
            if (update_settings.hasOwnProperty("module") == false)
                throw new Error("Invalid update specification for element #" + element.id + " provided - property 'module' is missing.");

            this._module = new Modules[update_settings["module"]](this);
            this._module.Initialize(update_settings["args"] ? update_settings["args"] : []);
        }

        //=====================================================================dd==
        //  TEMPLATE VARIABLES CORE FUNCTIONALITY
        //=====================================================================dd==

        /**
         * Processes data provided by CG_UPDATE command.
         *
         * @param data Data provided by CasparCG server.
         */
        public Update(data: object) {
            // TODO: Implement functionality itself
        }
    }
}