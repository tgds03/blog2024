import parseCSV from './parsecsv.js';

const DOMAIN = 5000;
const RANGE = -100;
const XTICK_COUNT = 11;

export default class LineChart {
	padding = {
		top: 25,
		bottom: 25,
		left: 15,
		right: 15,
	}

	chartAABB = {
		top: this.padding.top,
		bottom: undefined,
		left: this.padding.left,
		right: undefined,
		width: undefined,
		height: undefined
	}

	primaryColor = "red"
	bodyColor = "white"
	offset = 0	// cent

	parameter = {
		pitch: 440,
		tonename: 'A3',
		vowel: 'kor_a',
	}
	vowelSequence = undefined;

	constructor(id) {
		this.canvas = document.getElementById(id);
		this.ctx = this.canvas.getContext("2d");

		window.addEventListener("resize", this.resize);

		this.resize();
	}

	get pitch() { return this.parameter.pitch; }
	get vowel() { return this.parameter.vowel; }
	
	set pitch(freq) {
		this.parameter.pitch = freq;
		// this.draw();
	}
	set vowel(vowel) {
		this.parameter.vowel = vowel;
		// this.draw();
	}

	resize = () => {
		const chart = this.chartAABB,
			padding = this.padding;
		this.canvas.width = this.canvas.clientWidth;
		this.canvas.height = this.canvas.clientHeight;

		chart.bottom = this.canvas.clientHeight - padding.bottom;
		chart.right = this.canvas.clientWidth - padding.right;
		chart.width = chart.right - chart.left;
		chart.height = chart.bottom - chart.top;

		this.draw();
	}

	draw = () => {
		const ctx = this.ctx;
		const width = this.canvas.clientWidth;
		const height = this.canvas.clientHeight;

		ctx.clearRect(0, 0, width, height);
		this._drawAxis();
		this._drawHarmonics();
		this._drawVowelFilter();
	}

	_drawAxis = () => {
		const ctx = this.ctx;
		const {top, bottom, left, right, width, height} = this.chartAABB;

		ctx.beginPath();
		ctx.strokeStyle = this.bodyColor;
		ctx.lineWidth = 1.0;

		ctx.moveTo(left, bottom);
		ctx.lineTo(right, bottom);
		ctx.stroke();

		// XAXIS TICKS
		ctx.beginPath();
		ctx.strokeStyle = this.bodyColor;
		ctx.lineWidth = 0.2;

		for (let i = 0; i < XTICK_COUNT; i++) {
			const xPoint = left + i / (XTICK_COUNT - 1) * width,
				text = (DOMAIN * i / (XTICK_COUNT - 1)).toFixed(0);
			ctx.moveTo(xPoint, top);
			ctx.lineTo(xPoint, bottom);

			ctx.save();
			ctx.translate(xPoint, bottom);
			ctx.rotate(-Math.PI / 4);
			
			ctx.textAlign = 'right';
			ctx.fillStyle = this.bodyColor;
			ctx.fillText(text, -8, 4);
			ctx.restore();
		}
		ctx.stroke();
	}

	_drawHarmonics = () => {
		const ctx = this.ctx;
		const {top, bottom, left, right, width, height} = this.chartAABB;

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = this.primaryColor;
		

		const freq = this.pitch || 440;
		const sequence = this.vowelSequence;

		let j = 0, f = 0;
		let yPoint = NaN, yprePoint = NaN;
		for (let i = 1; freq * i < DOMAIN; i++) {
			const xPoint = left + freq * i / DOMAIN * width;
			const coef = Math.pow(2, this.offset/1200);
			yprePoint = yPoint;
			if (sequence) { 
				while( f < freq * i && j < sequence.length - 1) {
					f = Number(sequence[j]?.freq) * coef || 0;
					j++;
				}
				const x1 = Number(sequence[j-1]?.freq) * coef,
					x2 = Number(sequence[j].freq) * coef,
					y1 = Number(sequence[j-1].dB), 
					y2 = Number(sequence[j].dB),
					yValue = (y2 - y1) / (x2 - x1) * (freq * i - x1) + y1;
				yPoint = top + yValue / RANGE * height;
			}
			if (!yPoint) 
				yPoint = Math.min(yprePoint + 1, bottom);
			ctx.moveTo(xPoint, yPoint);
			ctx.lineTo(xPoint, bottom);
		}
		ctx.stroke();
	}

	_drawVowelFilter = () => {
		if (!this.vowelSequence)
			return;

		const ctx = this.ctx;
		const {top, bottom, left, right, width, height} = this.chartAABB;
		const sequence = this.vowelSequence;

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = this.bodyColor;	

		for (const e of sequence) {
			if (!e.freq) continue;
			const freq = e.freq * Math.pow(2, this.offset / 1200);
			const xPoint = left + freq / DOMAIN * width;
			const yPoint = top + e.dB / RANGE * height;
			ctx.lineTo(xPoint, yPoint);
		}
		ctx.stroke();
	}
}