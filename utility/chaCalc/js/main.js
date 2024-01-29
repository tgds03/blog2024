import LineChart from './linechart.js'
import { ChaController, ToneController, VowelContorller, PBController } from './controller.js'
import parseCSV from './parsecsv.js';

const lineChart = new LineChart("lineChart");

const chaContorller = new ChaController("chaRange", "chaRangeLabel", function () {
	lineChart.cha = chaContorller.$range.value;
	chartUpdate();
});

const toneController = new ToneController("toneRange", "toneRangeLabel", function() {
	const pitch = toneController.freq() * Math.pow(2, pbController.value / 1200);
	lineChart.pitch = pitch;
	chartUpdate();
	pitchUpdate(pitch);
})

const pbController = new PBController("pbRange", "pbRangeLabel", function() {
	const pitch = toneController.freq() * Math.pow(2, pbController.value / 1200);
	lineChart.pitch = pitch;
	chartUpdate();
	pitchUpdate(pitch);
})

const vowelContorller = new VowelContorller("vowelSelect", function() {
	lineChart.vowel = vowelContorller.value;
	chartUpdate();
})



let vowelData = undefined;

const xhr = new XMLHttpRequest();
xhr.open('GET', '/utility/chaCalc/data/seeu.json');
xhr.onload = () => {
	if (xhr.status != 200) {
		console.error("Can't load vowel data");
		return;
	}
	vowelData = JSON.parse(xhr.response);
	chartUpdate();
	pitchUpdate(523);
}
xhr.send();

function chartUpdate() {
	const dataName = `${vowelContorller.value}_${toneController.toneNamer()}`;
	lineChart.vowelSequence = parseCSV(vowelData[dataName]);
	lineChart.draw();
}

function pitchUpdate(pitch) {
	const toneName = [ "A", "A♯", "B", "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯" ];
	const $label1 = document.getElementById("pitchLabel"),
		$label2 = document.getElementById("pitchNameLabel");
	
	const t = Math.round(Math.log2(pitch / 440) * 12),
		name = `${toneName[(t % 12 + 12) % 12]}${Math.floor((t-3)/12)+4}`

	$label1.textContent = `Pitch : ${pitch.toFixed(2)}hz (${name})`;
}