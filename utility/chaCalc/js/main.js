import LineChart from './linechart.js'
import { ChaController, ToneController, VowelContorller } from './controller.js'
import parseCSV from './parsecsv.js';

const lineChart = new LineChart("lineChart");

const chaContorller = new ChaController("chaRange", "chaRangeLabel", function () {
	lineChart.cha = chaContorller.$range.value;
	lineChart.draw();
});

const toneController = new ToneController("toneRange", "toneRangeLabel", function() {
	const dataName = `${vowelContorller.value}_${toneController.toneNamer()}`;
	lineChart.vowelSequence = parseCSV(vowelData[dataName]);
	
	lineChart.pitch = toneController.freq();
	lineChart.draw();
})

const vowelContorller = new VowelContorller("vowelSelect", function() {
	const dataName = `${vowelContorller.value}_${toneController.toneNamer()}`;
	lineChart.vowelSequence = parseCSV(vowelData[dataName]);

	lineChart.vowel = vowelContorller.value;
	lineChart.draw();
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
}
xhr.send();
