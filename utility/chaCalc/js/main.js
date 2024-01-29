import LineChart from './linechart.js'
import { ChaController, ToneController, VowelContorller } from './controller.js'

const lineChart = new LineChart("lineChart");

const chaContorller = new ChaController("chaRange", "chaRangeLabel", function () {
	lineChart.cha = chaContorller.$range.value;
});

const toneController = new ToneController("toneRange", "toneRangeLabel", function() {
	lineChart.pitch = toneController.freq();
})

const vowelContorller = new VowelContorller("vowelSelect", function() {
	
})