module Template.ElementAnimation {
	/**
	 * Animation stage.
	 *
	 * This class allows splitting animations into discreet steps.
	 */
	export class Stage {
		get template(): Template.Controller {
			return Template.Controller.GetInstance();
		}

		get id(): number {
			return this._id;
		}

		private readonly _id: number;
		private readonly _controller: ElementAnimation.Controller;
		private readonly _animations: ElementAnimation.Animation[];

		/**
		 * @param controller Element specific controller.
		 * @param source_object Object containing stage definition.
		 * @constructor
		 */
		constructor(controller: ElementAnimation.Controller, source_object: object) {
			if (source_object.hasOwnProperty("id") == false)
				StageError.SpecError(controller.element.id, "Property 'id' is not defined!");
			if (source_object.hasOwnProperty("animations") == false)
				StageError.SpecError(controller.element.id, "Property 'animations' is not defined!");

			this._id = source_object["id"];
			this._controller = controller;

			if (typeof this._id != "number" || this._id < 0)
				StageError.SpecError(controller.element.id, `ID '${this._id}' is not valid! Only numeric values >=0 are accepted.`);

			this._animations = [];
			let animations = source_object["animations"];
			for (let object_id in animations) {
				if (animations.hasOwnProperty(object_id)) {
					let animation = new ElementAnimation.Animation(controller, animations[object_id]);
					if (this.id == 0) {
						// this is special non-playable animation group
						if (!animation.after || animation.after[0] != "$") {
							// animation does not have ID defined (no animation can depend on it)
							StageError.SpecMistake(controller.element.id, "Variable independent animation defined in stage 0! This stage is only used for variable dependent animations.");
						}
					}
					this._animations.push(animation);
				}
			}
		}

		//=====================================================================dd==
		//  ANIMATION CONTROLS
		//=====================================================================dd==

		/**
		 * Starts or queues up existing animations within this stage.
		 */
		public Play(): void {
			this.PreparePlay();

			let previous_animation: Promise<void> = undefined;
			for (let object_id in this._animations) {
				let animation = this._animations[object_id];
				previous_animation = this.PlaySingleAnimation(animation, previous_animation);
			}
		}

		/**
		 * Processes single animation.
		 *
		 * @param animation Animation to be started/queued up.
		 * @param previous_animation Previous animation's process promise.
		 */
		private PlaySingleAnimation(animation: ElementAnimation.Animation, previous_animation?: Promise<void>): Promise<void> {
			// prepare element for animation
			let element = this._controller.DuplicateElement();
			// apply animation onto prepared element
			let animation_process = animation.Play(element);

			// create animation trigger - this function starts the animation
			let animation_trigger = () => {
				// trigger animation by replacing the element
				this._controller.ReplaceElement(element);
			};

			if (animation.id) {
				// animation id is defined, other animations may depend on it
				this.template.RegisterAnimation(animation.id, animation_process);
			}

			if (animation.after) {
				// animation depends on something it can either be different animation or
				// it can depend on variable element update
				if (animation.after[0] == "$") {
					// animation depends on variable element update
					// register its trigger function
					this.template.RegisterVariableDependency(animation.after.substr(1), animation_trigger);
				} else {
					// animation depends on different animation
					// register its trigger function
					this.template.RegisterAnimationDependency(animation.after, animation_trigger);
				}
			} else {
				// animation does not depend on different animation
				if (previous_animation) {
					// let's chain it after the previous one
					previous_animation.then(animation_trigger);
				} else {
					// there is no previous animation, lets trigger it
					animation_trigger();
				}
			}

			// return this animation's process promise,
			// it will be fulfilled after animation is complete
			return animation_process;
		}

		//=====================================================================dd==
		//  ANIMATION PREPARATION CONTROLS
		//=====================================================================dd==

		/**
		 * Prepares this animation stage.
		 */
		public PreparePlay(): void {
			this.PrefetchAnimationIds();
		}

		/**
		 * Walks through existing animations and registers specified IDs.
		 * This allows working with animation dependencies.
		 */
		private PrefetchAnimationIds(): void {
			for (let object_id in this._animations) {
				let animation = this._animations[object_id];
				if (animation.id)
					this.template.RegisterAnimation(animation.id);
			}
		}
	}

	class StageError {
		public static SpecError(element_id: string, reason: string) {
			throw new Error(
				`Invalid animation stage specification for element #${element_id}: ${reason}`
			)
		}

		public static SpecMistake(element_id: string, reason: string) {
			console.error(`Wrong animation stage specification for element #${element_id}: ${reason}`);
        }
    }
}