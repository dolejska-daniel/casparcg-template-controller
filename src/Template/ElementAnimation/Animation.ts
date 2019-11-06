module Template.ElementAnimation {
	/**
	 * Animation.
	 *
	 * This class contains and represents single element animation.
	 */
	export class Animation {
		public get stage_id(): number {
			return this._stage.id;
		}

		public readonly id?: string;
		public readonly after?: string;
		public readonly classes: string[];
		public readonly details: ElementAnimation.Details;

		private readonly _stage: ElementAnimation.Stage;

		/**
		 * @param stage Element specific controller.
		 * @param source_object Object containing animation definition.
		 * @constructor
		 */
		constructor(stage: ElementAnimation.Stage, source_object: Partial<ElementAnimation.Animation>) {
			if (source_object.hasOwnProperty("classes") == false)
				throw new Error("Invalid base object for ObjectAnimation provided - property 'classes' is missing.");

			// assign values to class fields
			Object.assign(this, source_object);
			if (!this.id)
				this.id = Utils.Random.GetRandomId();

			// assign class fields
			this._stage = stage;
			this.details = new Details(source_object["details"]);
		}

		//=====================================================================dd==
		//  ANIMATION CONTROLS
		//=====================================================================dd==

		/**
		 * Asynchronously starts the animation process.
		 *
		 * @param element Target element.
		 */
		public Play(element: HTMLElement): void {
			// apply predefined animation classes
			this.ApplyClasses(element);
			// apply predefined element details
			this.ApplyDetails(element);
		}

		public Clear(element: HTMLElement): void {
			// remove previously applied classes
			this.RemoveClasses(element);
			// remove previously applied classes
			this.RemoveDetails(element);

			// force page reflow - this allows us to start next animation
			void element.offsetWidth;
		}

		//=====================================================================dd==
		//  CORE ANIMATION FUNCTIONALITY
		//=====================================================================dd==

		/**
		 * Applies defined classes to target element.
		 *
		 * @param element Target element.
		 */
		private ApplyClasses(element: HTMLElement): void {
			// force page reflow - this allows us to start next animation
			void element.offsetWidth;

			// remove initial classes
			element.classList.remove("initially-invisible");

			for (let class_id in this.classes)
				element.classList.add(this.classes[class_id]);

			element.setAttribute("data-active-animation", this.id);
		}

		/**
		 * @param element Target element.
		 */
		private RemoveClasses(element: HTMLElement): void {
			// remove applied classes
			for (let class_id in this.classes)
				element.classList.remove(this.classes[class_id]);

			element.setAttribute("data-active-animation", "");
		}

		/**
		 * Applies defined animation details to target element.
		 *
		 * @param element Target element.
		 */
		private ApplyDetails(element: HTMLElement): void {
			this.details.ApplyOn(element);
		}

		/**
		 * Applies defined animation details to target element.
		 *
		 * @param element Target element.
		 */
		private RemoveDetails(element: HTMLElement): void {
			this.details.RemoveFrom(element);
		}

		//=====================================================================dd==
		//  CORE ANIMATION FUNCTIONALITY
		//=====================================================================dd==

		/**
		 * Does animation depend on other animation or action?
		 */
		public IsDependent(): boolean {
			return typeof this.after == "string";
		}

		/**
		 * Does animation depend on other animation?
		 */
		public IsAnimationDependent(): boolean {
			return this.IsDependent() && !this.IsVariableDependent();
		}

		/**
		 * Does animation depend on variable element update?
		 */
		public IsVariableDependent(): boolean {
			return this.IsDependent() && this.after[0] == "$";
		}
	}
}
