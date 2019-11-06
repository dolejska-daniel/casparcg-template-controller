module Template.ElementAnimation {
	/**
	 * Element animation controller.
	 *
	 * This class provides per-element animation controls.
	 */
	export class Controller {
		public static readonly CLASS_SELECTOR = "js-animate";

		get template(): Template.Controller {
			return Template.Controller.GetInstance();
		}

		get element(): HTMLElement {
			return this._element;
		}

		private readonly _element: HTMLElement;
		private readonly _stages: ElementAnimation.Stage[];

		/**
		 * @param element Target element of the animation.
		 */
		constructor(element: HTMLElement) {
			this._element = element;

			let source_object_json = this.element.getAttribute("data-animations");
			let source_object = [];
			try {
				source_object = JSON.parse(source_object_json);
			} catch (e) {
				ControllerError.SpecError(this.element.id, "Value of attribute 'data-animations' malformed. (" + e + ")");
			}

			// add event listener so the program can actually know when
			// has animation been completed on this element
			this.element.addEventListener("animationend", (event) => {
				let template_controller = Template.Controller.GetInstance();
				let element = <HTMLElement>event.target;

				let finished_animation_id = element.getAttribute("data-active-animation");
				// get specified animation - either from current stage or from stage 0
				let finished_animation = this.GetAnimation(template_controller.stage_id, finished_animation_id);
				finished_animation = finished_animation || this.GetAnimation(0, finished_animation_id);
				// clear data from previous animation
				finished_animation.Clear(element);

				// trigger possible dependencies
				template_controller.TriggerAnimationDependencies(finished_animation_id);
			});

			// parse specified animation stages
			this._stages = [];
			for (let object_id in source_object) {
				if (source_object.hasOwnProperty(object_id) == false)
					continue;

				// parse single stage and animations within
				let stage = new ElementAnimation.Stage(this, source_object[object_id]);
				// check for duplicate stage definitions
				if (this._stages.hasOwnProperty(stage.id))
					ControllerError.SpecError(this.element.id, "Animation stage '" + stage.id + "' defined more than once!");

				this._stages[stage.id] = stage;

				// special case: if animation is created during lifetime of the
				// template, it will be immediatelly played
				if (this.template.IsInitialized() && stage.id < 2)
					stage.Play();
			}
		}

		//=====================================================================dd==
		//  ANIMATION PLAYBACK CONTROLS
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
		//  ANIMATION ACCESS CONTROLS
		//=====================================================================dd==

		/**
		 * Gets animation by its ID from specified animation stage.
		 *
		 * @param stage_id Stage identifier.
		 * @param animation_id Stage-unique animation identifier.
		 */
		public GetAnimation(stage_id: number, animation_id: string): ElementAnimation.Animation {
			return this._stages[stage_id].GetAnimation(animation_id);
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
