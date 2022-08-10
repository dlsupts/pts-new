export type ColorRangeInfo = {
	colorStart: number
	colorEnd: number
	useEndAsStart: boolean
}

function calculatePoint(i: number, intervalSize: number, info: ColorRangeInfo) {
	const { colorStart, colorEnd, useEndAsStart } = info
	return useEndAsStart ? colorEnd - (i * intervalSize) : colorStart + (i * intervalSize)
}

export default function interpolateColors(
	dataLength: number,
	colorScale: (t: number) => string,
	info: ColorRangeInfo = {
		colorStart: 0,
		colorEnd: 1,
		useEndAsStart: false
	}) {
	const { colorStart, colorEnd } = info
	const intervalSize = (colorEnd - colorStart) / dataLength
	const colorArray: string[] = []

	for (let i = 0; i < dataLength; i++) {
		colorArray.push(colorScale(calculatePoint(i, intervalSize, info)))
	}
	
	return colorArray
}
