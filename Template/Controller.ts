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
        private readonly _controllers: ElementAnimation.Controller[];

        private static _instance: Template.Controller;

        /**
         * @param debug Is template in debug mode?
         * @constructor
         */
        constructor(debug: boolean = false) {
            if (Controller._instance)
                throw new Error("Template.Controller class is implemented as a singleton. Creating new instances is not allowed.");
            Controller._instance = this;

            this._stage_id = 0;
            this._dependencies = [];
            this._controllers = [];
            this.SetDebug(debug);

            let animated_elements_collection = document.getElementsByClassName("js-animate");
            // convert to array
            let animated_elements = <HTMLElement[]>Array.prototype.slice.call(animated_elements_collection);

            for (let element_id in animated_elements) {
                if (animated_elements.hasOwnProperty(element_id) == false)
                    continue;

                let element = animated_elements[element_id];
                let controller = new ElementAnimation.Controller(element);
                this._controllers.push(controller);
            }
        }

        /**
         * Get existing or create new template controller instance.
         *
         * @param debug Is template in debug mode?
         */
        public static GetInstance(debug?: boolean): Controller {
            if (Controller._instance)
            {
                Controller._instance.SetDebug(debug);
                return Controller._instance;
            }

            return new Controller(debug);
        }

        /**
         * Sets debug status for current template.
         *
         * @param debug Is template in debug mode?
         */
        public SetDebug(debug?: boolean): void {
            this._debug = debug;
            if (debug) {
                document.getElementsByTagName("body").item(0).classList.add("debug");
            } else {
                document.getElementsByTagName("body").item(0).classList.remove("debug");
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

            for (let object_id in this._controllers) {
                let controller = this._controllers[object_id];
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

            for (let object_id in this._controllers) {
                let controller = this._controllers[object_id];
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
            // TODO: Implement template variable system
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
                this._dependencies[animation_id].processPromise = animation_promise;
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
                delete this._controllers[object_id];
        }
    }
}
