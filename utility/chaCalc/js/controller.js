class Controller {
	constructor() {
		// this.registerEvent();
		// this.update();
		this.callback = undefined;
	}

	registerEvent = () => {
		throw SyntaxError("Abstract method registerEvent must be concreated");
	}

	update = () => {
		throw SyntaxError("Abstract method update must be concreated");
	}
}

class ChaController extends Controller {
	constructor(rangeId, labelId, callback) {
		super();

		this.$range = document.getElementById(rangeId);
		this.$label = document.getElementById(labelId);
		this.callback = callback;

		this.registerEvent();
		this.updateLabel();
	}

	registerEvent = () => {
		this.$range.oninput = this.update;
	}

	update = () => {
		this.updateLabel();
		this.callback();
	}

	updateLabel = () => {
		this.$label.innerHTML = "CHA : " + this.$range.value;
	}
}

const toneName = [ "A", "A♯", "B", "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯" ]

class ToneController extends Controller {
	constructor(rangeId, labelId, callback) {
		super();

		this.$range = document.getElementById(rangeId);
		this.$label = document.getElementById(labelId);
		
		this.callback = callback;
		this.updateLabel();
		this.registerEvent();
	}

	registerEvent = () => {
		this.$range.oninput = this.update;
	}

	update = () => {
		this.updateLabel();
		this.callback();
	}

	updateLabel = () => {
		const val = this.toneNamer();
		this.$label.innerHTML = "노트 : " + val;
	}

	toneNamer = () => {
		// 0 : YAMAHA A1 (110Hz)
		const val = Number(this.$range.value);
		return toneName[val % 12] + (Math.trunc( (val-3) / 12) + 2);
	}

	freqNamer = () => {
		// 0 : YAMAHA A1 (110Hz) 	
		return this.freq().toFixed(2) + "hz";
	}

	freq = () => {
		const val = this.$range.value;
		return 110 * Math.pow(2, val / 12);
	}
}

class PBController extends Controller {
	constructor(rangeId, labelId, callback) {
		super();

		this.$range = document.getElementById(rangeId);
		this.$label = document.getElementById(labelId);
		this.value = 0;
		this.callback = callback;

		this.registerEvent();
		this.updateLabel();
	}

	registerEvent = () => {
		this.$range.oninput = this.update;
		this.$label.onclick = this.reset;
	}

	update = () => {
		this.value = this.$range.value / 480 * 2400;
		this.updateLabel();
		this.callback();
	}

	updateLabel = () => {
		this.$label.innerHTML = "PB : " + this.value.toFixed(0) + "cent";
	}

	reset = () => {
		this.$range.value = 0;
		this.update();
	}
}

class VowelContorller extends Controller {
	constructor(selectorName, callback) {
		super();
		this.$selectors = document.querySelectorAll(`input[name='${selectorName}']`);
		this.value = document.querySelector(`input[name='${selectorName}']:checked`).value;
		this.callback = callback;

		this.registerEvent();
	}

	registerEvent = () => {
		for (const $selector of this.$selectors) {
			$selector.onclick = this.update;
		}
	}

	update = () => {
		this.value = document.querySelector("input[name='vowelSelect']:checked").value;
		this.callback();
	}
}

export { ChaController, ToneController, VowelContorller, PBController }