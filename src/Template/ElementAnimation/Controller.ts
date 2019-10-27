module Template.ElementAnimation {
    /**
     * Element animation controller.
     *
     * This class provides per-element animation controls.
     */
    export class Controller {
        private _element: HTMLElement;

        private readonly _originalElement: HTMLElement;
        private readonly _stages: ElementAnimation.Stage[];

        /**
         * @param element Target element of the animation.
         */
        constructor(element: HTMLElement) {
            this._element = element;
            this._originalElement = element;

            let source_object_json = element.getAttribute("data-animations");
            let source_object = JSON.parse(source_object_json);

            this._stages = [];
            for (let object_id in source_object) {
                if (source_object.hasOwnProperty(object_id)) {
                    let stage = new ElementAnimation.Stage(this, source_object[object_id]);
                    this._stages[stage.id] = stage;
                }
            }
        }

        //=====================================================================dd==
        //  ANIMATION CONTROLS
        //=====================================================================dd==

        /**
         * Plays existing animations within current stage.
         *
         * @param stage_id Current stage identifier.
         */
        public Play(stage_id: number): void {
            if (this._stages.hasOwnProperty(stage_id)) {
                // play animations in specified stage
                this._stages[stage_id].Play();
            }
        }

        /**
         * Prepares currently active animation stage.
         *
         * @param stage_id Current stage identifier.
         */
        public PreparePlay(stage_id: number): void {
            if (this._stages.hasOwnProperty(stage_id)) {
                // prepare animations in specified stage
                this._stages[stage_id].PreparePlay();
            }
        }

        //=====================================================================dd==
        //  TARGET ELEMENT CONTROLS
        //=====================================================================dd==

        /**
         * Duplicates original animation target element.
         */
        public DuplicateElement(): HTMLElement {
            return <HTMLElement>this._originalElement.cloneNode(true);
        }

        /**
         * Replaces existing target element with its duplicate which triggers
         * applied animation.
         *
         * @param new_element Element to be inserted into current template.
         */
        public ReplaceElement(new_element: HTMLElement) {
            this._element.parentElement.replaceChild(new_element, this._element);
            this._element = new_element;
        }
    }
}
