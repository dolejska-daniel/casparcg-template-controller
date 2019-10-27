module Template.ElementAnimation {
    export class Controller {
        get element(): HTMLElement {
            return this._element;
        }

        get template(): Template.Controller {
            return this._template;
        }

        private _element: HTMLElement;

        private readonly _originalElement: HTMLElement;
        private readonly _stages: ElementAnimation.Stage[];
        private readonly _template: Template.Controller;

        /**
         * @param template
         * @param element Target element of the animation.
         */
        constructor(template: Template.Controller, element: HTMLElement) {
            this._template = template;
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
        //
        //=====================================================================dd==

        public Play(stage_id: number): void {
            if (this._stages.hasOwnProperty(stage_id)) {
                // play animations in specified stage
                this._stages[stage_id].Play();
            }
        }

        public PreparePlay(stage_id: number): void {
            if (this._stages.hasOwnProperty(stage_id)) {
                // prepare animations in specified stage
                this._stages[stage_id].PreparePlay();
            }
        }

        //=====================================================================dd==
        //
        //=====================================================================dd==

        public DuplicateElement(): HTMLElement {
            return <HTMLElement>this._originalElement.cloneNode(true);
        }

        public ReplaceElement(new_element: HTMLElement) {
            this._element.parentElement.replaceChild(new_element, this._element);
            this._element = new_element;
        }
    }
}
