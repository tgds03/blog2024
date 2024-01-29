export default function parseCSV(text, delemiter=",") {
	const lines = text.split('\n');
	const cols = lines[0].split(delemiter);
	const colnum = cols.length;
	const len = lines.length;
	const data = []
	for (let i = 1; i < len; i++) {
		const row = lines[i].split(delemiter);
		const e = {};
		for (let j = 0; j < colnum; j++) {
			if (!cols[j]) continue;
			e[cols[j]] = row[j];
		}
		data.push(e);
	}
	return data;
}