module Template.ElementAnimation {
    export class Dependency {
        set processPromise(value: Promise<void>) {
            this._processPromise = value;

            if (value != undefined)
            {
                for (let callback_id in this._callbacks)
                    this._processPromise.then(this._callbacks[callback_id]);
            }
        }

        private _processPromise: Promise<void>;
        private readonly _callbacks: (() => void)[];

        /**
         * @constructor
         */
        constructor(processPromise?: Promise<void>) {
            this._processPromise = processPromise;
            this._callbacks = [];
        }

        //=====================================================================dd==
        //
        //=====================================================================dd==

        /**
         * @param callback
         */
        public AddDependency(callback: () => void): void {
            if (this._processPromise != undefined)
                this._processPromise.then(callback);
            else
                this._callbacks.push(callback);
        }
    }
}