import LineChart from './linechart.js'
import { ChaController, ToneController, VowelContorller, PBController, PitchLockController } from './controller.js'
import freq2Tone from "./tonenamer.js"
import parseCSV from './parsecsv.js';

const lineChart = new LineChart("lineChart");
let pitchLock = false,
	pitchLockValue = undefined;
	

const chaContorller = new ChaController("chaRange", "chaRangeLabel", function () {
	lineChart.offset = chaContorller.value;
	chartUpdate();
});

const toneController = new ToneController("toneRange", "toneRangeLabel", function() {
	let pitch = toneController.freq * Math.pow(2, pbController.value / 1200);

	if (pitchLock) {
		const $pRange = pbController.$range;
		while (Math.abs( Math.log2(pitch / pitchLockValue) * 12 ) > 0.51) {
			if (pitch < pitchLockValue)
				$pRange.stepUp();
			else
				$pRange.stepDown();
			pbController.updateVars();
			pitch = toneController.freq * Math.pow(2, pbController.value / 1200);
			if ($pRange.value == $pRange.max || $pRange.value == $pRange.min) break;
		}
		pbController.updateLabel();
	}

	lineChart.pitch = pitch;
	chartUpdate();
	pitchUpdate(pitch);
})

const pbController = new PBController("pbRange", "pbRangeLabel", "pbsSelect", function() {
	let pitch = toneController.freq * Math.pow(2, pbController.value / 1200);

	if (pitchLock) {
		const $tRange = toneController.$range;
		while (Math.abs( Math.log2(pitch / pitchLockValue) * 12 ) > 0.51) {
			if (pitch < pitchLockValue)
				$tRange.stepUp();
			else
				$tRange.stepDown();
			toneController.updateVars();
			pitch = toneController.freq * Math.pow(2, pbController.value / 1200);
			if ($tRange.value == $tRange.max || $tRange.value == $tRange.min) break;
		}
		toneController.updateLabel();
	}

	lineChart.pitch = pitch;
	chartUpdate();
	pitchUpdate(pitch);
})

const vowelContorller = new VowelContorller("vowelSelect", function() {
	lineChart.vowel = vowelContorller.value;
	chartUpdate();
})

const pitchLockController = new PitchLockController("pitchLock", function() {
	const pitch = toneController.freq * Math.pow(2, pbController.value / 1200);
	pitchLock = pitchLockController.isCheck;
	pitchLockValue = pitch;

	if (pitchLock) {
		pbController.setRange(24)
		pbController._offset = pbController.value % 100
	} else {
		pbController.setRange(480);
		pbController._offset = 0
	}
		
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

	const $vowelTable = document.getElementById("vowelTable");
	const availableVowel = vowelData.meta.vowel;
	let i = 1;
	for (const vowel in availableVowel) {
		const symbol = availableVowel[vowel];
		$vowelTable.insertAdjacentHTML('beforeend', `
		<div class="col">
			<input class="btn-check" type="radio" name="vowelSelect" id="vowelSelectRadio${i}" value="${vowel}" ${(i == 1) ? 'checked' : ''  }>
			<label class="btn" for="vowelSelectRadio${i}">${symbol}</label>
		</div>
		`
		)
		i += 1;
	}

	vowelContorller.init();
	chartUpdate();
	pitchUpdate(523);
}
xhr.send();

function chartUpdate() {
	const dataName = `${vowelContorller.value}_${toneController.toneName}`;
	lineChart.vowelSequence = parseCSV(vowelData[dataName]);
	lineChart.draw();
}

function pitchUpdate(pitch) {
	const $label1 = document.getElementById("pitchLabel");
	$label1.textContent = `Pitch : ${pitch.toFixed(2)}hz (${freq2Tone(pitch)})`;
}