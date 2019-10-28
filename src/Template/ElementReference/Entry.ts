module Template.ElementReference {
	export class Entry {
		set element(value: HTMLElement) {
			this._element.parentElement.replaceChild(value, this._element);
			this._element = value;
			this._base.innerHTML = this._element.innerHTML;
			Manager.GetInstance().ElementReplaced(this._element);
		}

		get element(): HTMLElement {
			return this._element;
		}

		/** Current element reference. */
		private _element: HTMLElement;
		/** Initial element reference. */
		private readonly _base: HTMLElement;

		/**
		 * @param element
		 * @constructor
		 */
		constructor(element: HTMLElement) {
			this._element = element;
			this._base = <HTMLElement>element.cloneNode(true);
		}

		//=====================================================================dd==
		//  TARGET ELEMENT CONTROLS
		//=====================================================================dd==

		public GetDuplicate(): HTMLElement {
			return <HTMLElement>this._base.cloneNode(true);
		}

		public UpdateReferenceQuietly(element: HTMLElement) {
			this._element = element;
		}

		public UpdateBaseContents() {
			this._base.innerHTML = this._element.innerHTML;
		}
	}
}
