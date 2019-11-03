///<reference path="BaseModule.ts"/>
module Template.ElementVariables.Modules {

	/**
	 * Countdown update module.
	 *
	 * This module provides countdown timer.
	 * It uses update data as counter's new target time.
	 */
	export class Countdown extends BaseModule {

		private hideDays: boolean = true;
		private hideHours: boolean = true;
		private hideMinutes: boolean = true;

		private countdownUntil: Date;
		private timer;

		public Initialize(args: object): void {
			if (typeof args != "undefined" && typeof args != "object")
				return console.warn("ChangeAttribute module received non-object argument data!");

			if (args.hasOwnProperty("hideDays"))
				this.hideDays = !!args["hideDays"];

			if (args.hasOwnProperty("hideHours"))
				this.hideHours = !!args["hideHours"];

			if (args.hasOwnProperty("hideMinutes"))
				this.hideMinutes = !!args["hideMinutes"];
		}

		public Update(data: any): void {
			if (typeof data != "number")
				return console.warn("ChangeAttribute module received non-numeric update data! (unix timestamp expected)");

			let timestamp = data * 1000;
			if (timestamp < Date.now())
				timestamp += Date.now();

			this.countdownUntil = new Date(timestamp);
			this.StopCountdown();
			this.StartCountdown();
		}

		private StartCountdown(): void {
			this.timer = setInterval(() => {
				this.CountdownStep();
			}, 200);
		}

		private StopCountdown(): void {
			if (this.timer)
				clearInterval(this.timer);
		}

		private CountdownStep(): void {
			let t = this.countdownUntil.getTime() - Date.now();
			if (t < 0) {
				t = 0;
				clearInterval(this.timer);
			}

			let days = Math.floor(t / (1000 * 60 * 60 * 24));
			let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			let mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
			let secs = Math.floor((t % (1000 * 60)) / 1000);

			let outputs = [];
			if (days) outputs.push(`${days}:`);
			if (hours) outputs.push(`${hours < 10 ? `0${hours}` : hours}:`);
			if (mins) outputs.push(`${mins < 10 ? `0${mins}` : mins}:`);
			outputs.push((secs < 10 ? `0${secs}` : secs));

			this.element.innerText = outputs.join(":");
		}
	}
}