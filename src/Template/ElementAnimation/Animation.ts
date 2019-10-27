module Template.ElementAnimation {
    /**
     * Animation.
     *
     * This class contains and represents single element animation.
     */
    export class Animation {
        public readonly id?: string;
        public readonly after?: string;
        public readonly classes: string[];
        public readonly details: ElementAnimation.Details;

        private readonly _controller: ElementAnimation.Controller;

        /**
         * @param controller Element specific controller.
         * @param source_object Object containing animation definition.
         * @constructor
         */
        constructor(controller: ElementAnimation.Controller, source_object: Partial<ElementAnimation.Animation>) {
            if (source_object.hasOwnProperty("classes") == false)
                throw new Error("Invalid base object for ObjectAnimation provided - property 'classes' is missing.");

            // assign values to class fields
            Object.assign(this, source_object);
            // assign class fields
            this._controller = controller;
            this.details = new Details(source_object["details"]);
        }

        //=====================================================================dd==
        //  ANIMATION CONTROLS
        //=====================================================================dd==

        /**
         * Asynchronously starts the animation process.
         *
         * @param element Target element.
         * @returns Promise<void> Animation process promise - it will be
         *   resolved when the animation is finished.
         */
        public Play(element: HTMLElement): Promise<void> {
            // promise completion of the animation
            return new Promise<void>(resolve => {
                // apply animation
                this.ApplyClasses(element);
                this.ApplyDetails(element);

                // resolve the promise after animation ends
                element.addEventListener("animationend", () => {
                    resolve();
                });
            });
        }

        //=====================================================================dd==
        //  CORE ANIMATION FUNCTIONALITY
        //=====================================================================dd==

        /**
         * Applies defined classes to target element.
         *
         * @param element Target element.
         */
        private ApplyClasses(element: HTMLElement): void {
            // remove initial classes
            element.classList.remove("initially-invisible");
            element.classList.add("animated");

            for (let class_id in this.classes)
                element.classList.add(this.classes[class_id]);
        }

        /**
         * Applies defined animation details to target element.
         *
         * @param element Target element.
         */
        private ApplyDetails(element: HTMLElement): void {
            this.details.ApplyOn(element);
        }
    }
}
