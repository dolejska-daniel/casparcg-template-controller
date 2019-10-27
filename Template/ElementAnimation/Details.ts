module Template.ElementAnimation {
    export class Details {
        public readonly delay?: string;
        public readonly duration?: string;
        public readonly timing?: string;
        public readonly origin?: string;

        constructor(source_object?: Partial<ElementAnimation.Details>) {
            // assign values to class fields
            Object.assign(this, source_object);
        }

        //=====================================================================dd==
        //
        //=====================================================================dd==

        public ApplyOn(element: HTMLElement): void
        {
            // define which CSS properties correspond to which detail entries
            const entries = {
                "delay": [
                    "-webkit-animation-delay",
                    "animation-delay",
                ],
                "duration": [
                    "-webkit-animation-duration",
                    "animation-duration",
                    "-webkit-transition-duration",
                    "transition-duration",
                ],
                "timing": [
                    "-webkit-animation-timing-function",
                    "animation-timing-function",
                ],
                "origin": [
                    "-webkit-transform-origin",
                    "transform-origin",
                ],
            };

            // for each definition
            for (let entry_name in entries)
            {
                // check whether that detail is set
                if (!this[entry_name])
                    continue;

                // get corresponding CSS properties
                const style_properties = entries[entry_name];
                // each CSS property set to value specified by detail entry
                for (let property_id in style_properties)
                    element.style.setProperty(style_properties[property_id], this[entry_name], "important");
            }
        }
    }
}
