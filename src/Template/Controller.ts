module Template {
	/**
	 * Template controller.
	 *
	 * Provides simple template control interface.
	 */
	export class Controller {
		get debug(): boolean {
			return this._debug;
		}

		get stage_id(): number {
			return this._stage_id;
		}

		private _stage_id: number;
		private _debug: boolean;

		private readonly _dependencies: ElementAnimation.Dependency[];
		private readonly _animations: ElementAnimation.Controller[];
		private readonly _variables: ElementVariables.Controller[];
		private readonly _referenceManager: ElementReference.Manager;

		private static _instance: Template.Controller;

		/**
		 * @param debug Is template in debug mode?
		 * @constructor
		 */
		constructor(debug: boolean = false) {
			if (Controller._instance)
				throw new Error("Template.Controller is implemented as a singleton. Creating new instances is not allowed.");
			Controller._instance = this;

			this._stage_id = 0;
			this._dependencies = [];
			this._animations = [];
			this._variables = [];
			this._referenceManager = ElementReference.Manager.GetInstance();
			this.SetDebug(debug);

			let animated_elements = document.getElementsByClassName(ElementAnimation.Controller.CLASS_SELECTOR);
			for (let element_index = 0; element_index < animated_elements.length; element_index++) {
				let element = <HTMLElement>animated_elements.item(element_index);
				if (!element.id)
					throw new Error("Elements with '" + ElementAnimation.Controller.CLASS_SELECTOR + "' class are required to have unique identifiers (id='XXX').");

				let element_ref = this._referenceManager.RegisterElement(element);
				let controller = new ElementAnimation.Controller(element_ref);
				this._animations.push(controller);
			}

			let variable_elements = document.getElementsByClassName(ElementVariables.Controller.CLASS_SELECTOR);
			for (let element_index = 0; element_index < variable_elements.length; element_index++) {
				let element = <HTMLElement>variable_elements.item(element_index);
				if (!element.id)
					throw new Error("Elements with '" + ElementVariables.Controller.CLASS_SELECTOR + "' class are required to have unique identifiers (id='XXX').");

				let element_ref = this._referenceManager.RegisterElement(element);
				let controller = new ElementVariables.Controller(element_ref);
				this._variables[element.id] = controller;
			}
		}

		/**
		 * Get existing or create new template controller instance.
		 * Debug parameter is only used when new instance has to be created.
		 *
		 * @param debug Is template in debug mode?
		 */
		public static GetInstance(debug?: boolean): Controller {
			if (Controller._instance)
				return Controller._instance;

			return new Controller(debug);
		}

		/**
		 * Sets debug status for current template.
		 *
		 * @param debug Is template in debug mode?
		 */
		public SetDebug(debug?: boolean): void {
			this._debug = debug;
			if (debug != undefined) {
				if (debug) {
					document.getElementsByTagName("body").item(0).classList.add("debug");
				} else {
					document.getElementsByTagName("body").item(0).classList.remove("debug");
				}
			}
		}

		//=====================================================================dd==
		//  TEMPLATE CONTROLS
		//=====================================================================dd==

		/**
		 * Processes existing animation on single element in current stage.
		 */
		public Play(): void {
			// prepares current stage to be played
			this.PreparePlay();

			for (let object_id in this._animations) {
				let controller = this._animations[object_id];
				// process the animations in given stage
				controller.Play(this.stage_id);
			}
		}

		/**
		 * Clears all previously registered dependencies and pre-processes
		 * animations in current stage.
		 */
		private PreparePlay(): void {
			// remove existing dependencies from before
			this.ClearDependencies();

			for (let object_id in this._animations) {
				let controller = this._animations[object_id];
				// pre-process the animations in given stage
				controller.PreparePlay(this.stage_id);
			}

			let body = document.getElementsByTagName("body").item(0);
			body.classList.add("play");
			body.classList.remove("stop");
		}

		/**
		 * Selects next stage identifier as current and starts playing
		 * animations defined within that stage.
		 */
		public Next(): void {
			this._stage_id++;
			this.Play();
		}

		/**
		 * Updates values of template variables.
		 *
		 * @param data Object containing current values for template variables.
		 */
		public Update(data: object): void {
			for (let element_id in data) {
				if (data.hasOwnProperty(element_id) == false)
					continue;

				let variable_controller = this._variables[element_id];
				if (variable_controller == undefined)
					console.warn(`Variable key '${element_id}' defined in update data does not match any registered variable elements.`);

				variable_controller.Update(data[element_id]);
			}
			this._referenceManager.UpdateBaseContents();
		}

		/**
		 * Hides all existing contents of current template.
		 */
		public Stop(): void {
			let body = document.getElementsByTagName("body").item(0);
			body.classList.remove("play");
			body.classList.add("stop");
		}

		//=====================================================================dd==
		//  ANIMATION DEPENDENCY CONTROLS
		//=====================================================================dd==

		/**
		 * Registers existing animation ID. Can also specify its process
		 * promise.
		 *
		 * @param animation_id Stage-unique animation identifier.
		 * @param animation_promise Stage process promise.
		 */
		public RegisterAnimation(animation_id: string, animation_promise?: Promise<void>) {
			if (this._dependencies.hasOwnProperty(animation_id)) {
				// animation ID was already registered, save its process promise
				this._dependencies[animation_id].SetProcessPromise(animation_promise);
			} else {
				// animation ID was not registered yet, create it
				this._dependencies[animation_id] = new ElementAnimation.Dependency(animation_promise);
			}
		}

		/**
		 * Registers existing dependency on specific animation and provides its
		 * trigger function. After specified animation is finished, all
		 * registered dependencies will be triggered.
		 *
		 * @param animation_id Stage-unique animation identifier.
		 * @param callback Animation's trigger function.
		 */
		public RegisterDependency(animation_id: string, callback: () => void): void {
			if (this._dependencies.hasOwnProperty(animation_id) == false) {
				// either this animation depends on nonexistent animation
				// or animation ID prefetch was not done
				throw new Error("Trying to register animation dependency to unregistered/nonexistent animation.");
			}

			this._dependencies[animation_id].AddDependency(callback);
		}

		/**
		 * Clears all registered animation dependencies.
		 */
		public ClearDependencies(): void {
			for (let object_id in this._dependencies)
				delete this._animations[object_id];
		}
	}
}
