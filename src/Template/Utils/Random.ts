module Template.Utils {
	export class Random {
		public static GetRandomId(): string {
			return "_" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
		}
	}
}