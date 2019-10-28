module Template.ElementVariables.Modules {
    /**
     * Generic update module interface.
     */
    export interface Module {
        /**
         * @param args Array of module-specific arguments.
         */
        Initialize(args): void;

        /**
         * @param data Updated contents.
         */
        Update(data: object): void;
    }
}