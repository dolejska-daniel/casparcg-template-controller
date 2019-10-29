module Template.ElementAnimation {
    /**
     * Animation dependency.
     *
     * This class allows animations to be started after completion of specified
     * animation (even on completely different element).
     */
    export class Dependency {
        private _processPromise: Promise<void>;
        private readonly _callbacks: (() => void)[];

        /**
         * @param processPromise Animation process promise.
         * @constructor
         */
        constructor(processPromise?: Promise<void>) {
            this._processPromise = processPromise;
            this._callbacks = [];
        }

        //=====================================================================dd==
        //  ANIMATION DEPENDENCY CORE FUNCTIONALITY
        //=====================================================================dd==

        /**
         * Sets animation process promise for the dependents.
         * Also immediately chains already registered trigger functions.
         *
         * @param processPromise Animation process promise.
         */
        public SetProcessPromise(processPromise: Promise<void>): void {
            this._processPromise = processPromise;

            if (processPromise) {
                for (let callback_id in this._callbacks)
                    this._processPromise.then(this._callbacks[callback_id]);
            }
        }

        /**
         * Registers depending animation's trigger function.
         *
         * @param callback Animation trigger function.
         */
        public AddDependency(callback: () => void): void {
            if (this._processPromise != undefined)
                this._processPromise.then(callback);
            else
                this._callbacks.push(callback);
        }

        private async TriggerDependencies(): Promise<void> {
            return new Promise<void>(resolve => {
                for (let callback_id in this._callbacks)
                    this._processPromise.then(this._callbacks[callback_id]);
            });
        }
    }
}