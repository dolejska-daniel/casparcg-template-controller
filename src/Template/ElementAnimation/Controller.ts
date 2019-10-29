module Template.ElementAnimation {
	/**
	 * Element animation controller.
	 *
	 * This class provides per-element animation controls.
	 */
	export class Controller {
		public static readonly CLASS_SELECTOR = "js-animate";

		get element(): HTMLElement {
			return this._elementRef.element;
		}

		private readonly _elementRef: ElementReference.Entry;
		private readonly _stages: ElementAnimation.Stage[];

		/**
		 * @param element_ref Target element of the animation.
		 */
		constructor(element_ref: ElementReference.Entry) {
			this._elementRef = element_ref;

			let source_object_json = this.element.getAttribute("data-animations");
			let source_object = [];
			try {
				source_object = JSON.parse(source_object_json);
			} catch (e) {
				ControllerError.SpecError(this.element.id, "Value of attribute 'data-animations' malformed. (" + e + ")");
			}

			this._stages = [];
			for (let object_id in source_object) {
				if (source_object.hasOwnProperty(object_id)) {
					let stage = new ElementAnimation.Stage(this, source_object[object_id]);
					if (this._stages.hasOwnProperty(stage.id))
						ControllerError.SpecError(this.element.id, "Animation stage '" + stage.id + "' defined more than once!");

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
			return this._elementRef.GetDuplicate();
		}

		/**
		 * Replaces existing target element with its duplicate which triggers
		 * applied animation.
		 *
		 * @param new_element Element to be inserted into current template.
		 */
		public ReplaceElement(new_element: HTMLElement) {
			return this._elementRef.element = new_element;
		}
	}

	class ControllerError {
		public static SpecError(element_id: string, reason: string) {
			throw new Error(
				`Invalid animation specification for element #${element_id}: ${reason}`
			)
		}
	}
}
