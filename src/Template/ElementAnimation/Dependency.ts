module Template.ElementAnimation {
    /**
     * Animation dependency.
     *
     * This class allows animations to be started after completion of specified
     * animation (even on completely different element).
     */
    export class Dependency {
	    get target_animation(): ElementAnimation.Animation {
		    return this._animation;
	    }

	    private readonly _animation: Template.ElementAnimation.Animation;
	    private readonly _callbacks: (() => void)[];

        /**
         * @constructor
         */
        constructor(animation: ElementAnimation.Animation) {
	        this._animation = animation;
	        this._callbacks = [];
        }

        //=====================================================================dd==
        //  ANIMATION DEPENDENCY CORE FUNCTIONALITY
        //=====================================================================dd==

        /**
         * Registers depending animation's trigger function.
         *
         * @param callback Animation trigger function.
         */
        public AddDependency(callback: () => void): void {
	        this._callbacks.push(callback);
        }

	    /**
	     * Triggers all registered animations.
	     */
	    public TriggerDependencies(): void {
		    for (let callback_id = 0; callback_id < this._callbacks.length; callback_id++)
			    this._callbacks[callback_id]();
        }
    }
}