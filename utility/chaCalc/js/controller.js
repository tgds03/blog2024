import freq2Tone from "./tonenamer.js"

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

class ToneController extends Controller {
	constructor(rangeId, labelId, callback) {
		super();

		this.$range = document.getElementById(rangeId);
		this.$label = document.getElementById(labelId);
		this.freq = 110 * Math.pow(2, this.$range.value / 12);
		this.toneName = freq2Tone(this.freq);
		
		this.callback = callback;
		this.updateLabel();
		this.registerEvent();
	}

	registerEvent = () => {
		this.$range.oninput = this.update;
	}

	update = () => {
		this.updateVars();
		this.updateLabel();
		this.callback();
	}

	updateLabel = () => {
		this.$label.innerHTML = "노트 : " + this.toneName;
	}

	updateVars = () => {
		this.freq = 110 * Math.pow(2, this.$range.value / 12);
		this.toneName = freq2Tone(this.freq);
	}
}

class PBController extends Controller {
	constructor(rangeId, labelId, callback) {
		super();

		this.$range = document.getElementById(rangeId);
		this.$label = document.getElementById(labelId);
		this.value = 0;
		this._range = 480;
		this._offset = 0;
		this.callback = callback;

		this.registerEvent();
		this.updateLabel();
	}

	registerEvent = () => {
		this.$range.oninput = this.update;
		this.$label.onclick = this.reset;
	}

	update = () => {
		this.updateVars();
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

	updateVars = () => {
		this.value = this.$range.value / this._range * 2400 + this._offset;
	}

	setRange = (range) => {
		const temp = this.$range.value;
		this.$range.max = range;
		this.$range.min = -range;
		this.$range.value = temp * range / this._range;
		this._range = range;
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

class PitchLockController extends Controller {
	constructor(checkId, callback) {
		super();

		this.$check = document.getElementById(checkId);
		this.callback = callback;
		this.isCheck = false;
		
		this.registerEvent();
	}

	registerEvent = () => {
		this.$check.onclick = this.update;
	}

	update = () => {
		this.isCheck = !this.isCheck;
		this.callback();
	}
}

export { ChaController, ToneController, VowelContorller, PBController, PitchLockController }