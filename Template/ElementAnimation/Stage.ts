module Template.ElementAnimation {
    export class Stage {
        get template(): Template.Controller {
            return this._controller.template;
        }

        get id(): number {
            return this._id;
        }

        private readonly _id: number;
        private readonly _controller: ElementAnimation.Controller;
        private readonly _animations: ElementAnimation.Animation[];

        /**
         * @param controller
         * @param source_object
         * @constructor
         */
        constructor(controller: ElementAnimation.Controller, source_object) {
            if (source_object.hasOwnProperty("id") == false)
                throw new Error("Invalid base object for ObjectAnimationStage provided - property 'id' is missing.");

            if (source_object.hasOwnProperty("animations") == false)
                throw new Error("Invalid base object for ObjectAnimationStage provided - property 'animations' is missing.");

            this._id = source_object["id"];
            this._controller = controller;

            this._animations = [];
            let animations = source_object["animations"];
            for (let object_id in animations) {
                if (animations.hasOwnProperty(object_id)) {
                    let animation = new ElementAnimation.Animation(controller, animations[object_id]);
                    this._animations.push(animation);
                }
            }
        }

        //=====================================================================dd==
        //
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

        //=====================================================================dd==
        //
        //=====================================================================dd==

        /**
         * Prepares this animation stage.
         */
        public PreparePlay(): void {
            this.PrefetchAnimationIds();
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
                // animation depends on different animation,
                // register trigger function
                this.template.RegisterDependency(animation.after, animation_trigger);
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
}