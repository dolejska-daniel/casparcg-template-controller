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

		get controller(): ElementAnimation.Controller {
			return this._controller;
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
					let animation = new ElementAnimation.Animation(this, animations[object_id]);
					if (this.id == 0) {
						// this is special non-playable animation group
						if (animation.IsVariableDependent() == false) {
							// any variable independent animations are not supposed to be here
							StageError.SpecMistake(controller.element.id, "Variable independent animation defined in stage 0! This stage is only used for variable dependent animations.");
							continue;
						}
					}
					this._animations[animation.id] = animation;
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

			let previous_animation_id: string = undefined;
			for (let object_id in this._animations) {
				let animation = this._animations[object_id];
				previous_animation_id = this.PlaySingleAnimation(animation, previous_animation_id);
			}
		}

		/**
		 * Processes single animation.
		 *
		 * @param animation Animation to be started/queued up.
		 * @param previous_animation_id Previous animation's process promise.
		 */
		private PlaySingleAnimation(animation: ElementAnimation.Animation, previous_animation_id?: string): string {
			// create animation trigger - this function starts the animation
			let animation_trigger = () => {
				// apply and trigger animation onto target element
				animation.Play(this._controller.element);
			};

			if (animation.IsDependent()) {
				// animation depends on something it can either be different animation or
				// it can depend on variable element update
				if (animation.IsVariableDependent()) {
					// animation depends on variable element update
					// register its trigger function
					this.template.RegisterVariableDependency(animation.after.substring(1), animation_trigger);
				} else {
					// animation depends on different animation
					// register its trigger function
					this.template.RegisterAnimationDependency(animation.after, animation_trigger);
				}
			} else {
				// animation does not explicitly depend on different animation
				if (previous_animation_id) {
					// previous animation exists, it now depends on previous animation
					this.template.RegisterAnimationDependency(previous_animation_id, animation_trigger);
				} else {
					// there is no previous animation, lets trigger it
					animation_trigger();
				}
			}

			// return this animation's identifier
			return animation.id;
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

				// other animations may depend on this animation
				this.template.RegisterAnimation(animation);
			}
		}

		public GetAnimation(animation_id: string): ElementAnimation.Animation {
			return this._animations[animation_id];
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