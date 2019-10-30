module Template.ElementAnimation {
    /**
     * Animation details.
     *
     * This class contains additional animation variables.
     */
    export class Details {
	    // define which CSS properties correspond to which detail entries
	    public static ENTRIES = {
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

	    public readonly delay?: string;
	    public readonly duration?: string = "500ms";
	    public readonly timing?: string;
	    public readonly origin?: string;

	    /**
	     * @param source_object Object containing animation details definition.
	     * @constructor
	     */
	    constructor(source_object?: Partial<ElementAnimation.Details>) {
		    // assign values to class fields
		    Object.assign(this, source_object);
	    }

	    //=====================================================================dd==
	    //  CORE ANIMATION DETAILS FUNCTIONALITY
	    //=====================================================================dd==

	    /**
	     * Applies animation details to target element.
	     *
	     * @param element Target element.
	     */
	    public ApplyOn(element: HTMLElement): void {
		    // for each definition
		    for (let entry_name in Details.ENTRIES) {
			    // check whether that detail is set
			    if (!this[entry_name])
				    continue;

			    // get corresponding CSS properties
			    const style_properties = Details.ENTRIES[entry_name];
			    // each CSS property set to value specified by detail entry
			    for (let property_id in style_properties)
				    if (style_properties.hasOwnProperty(property_id))
					    element.style.setProperty(style_properties[property_id], this[entry_name], "important");
		    }
	    }

	    public RemoveFrom(element: HTMLElement) {
		    // for each definition
		    for (let entry_name in Details.ENTRIES) {
			    // check whether that detail is set
			    if (!this[entry_name])
				    continue;

			    // get corresponding CSS properties
			    const style_properties = Details.ENTRIES[entry_name];
			    // each CSS property set to value specified by detail entry
			    for (let property_id in style_properties)
				    if (style_properties.hasOwnProperty(property_id))
					    element.style.setProperty(style_properties[property_id], "unset");
		    }
	    }
    }
}
