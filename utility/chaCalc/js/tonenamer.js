const toneName = [ "A", "A♯", "B", "C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯" ];

export default function freq2Tone(freq) {
	const t = Math.round(Math.log2(freq / 440) * 12),
		name = `${toneName[(t % 12 + 12) % 12]}${Math.floor((t-3)/12)+4}`;
	return name;
}