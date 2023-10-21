const { Image } = require('image-js')
const fs = require('fs')

function p2c(pixel) {
	return pixel.slice(0, 3).map(c => c.toString(16).padStart(2, '0')).join('')
}

async function go() {
	const image = await Image.load('rick.jpg')
	const colors = {}
	const small = image.resize({ width: 99 })
	const grid = []
	for (let i = 0; i < small.size; i++) {
		const color = p2c(small.getPixel(i))
		if (!colors[color]) colors[color] = 0
		colors[color]++
	}
	const compressed = {}
	const compressionArray = []
	for (let color in colors) {
		if (colors[color] < 3) continue
		compressionArray.push(color)
		compressed[color] = compressionArray.length - 1
	}
	for (let y = 0; y < small.height; y++) {
		const row = []
		for (let x = 0; x < small.width; x++) {
			const color = p2c(small.getPixelXY(x, y))
			row.push('"'+color+'"')
			// if (compressed[color] !== undefined) {
			// 	row.push(`${String.fromCharCode}`)
			// } else {
			// }
		}
		grid.push(row)
	}
	const formula = '=MAP({' + grid
		.map(row => row.join(','))
		.join(';') + '},LAMBDA(c,SPARKLINE(1,{"charttype","bar";"color1","#"&c})))'
	fs.writeFileSync('out', formula)
	console.log(`formula size: ${formula.length}`)
	const perc = ((compressionArray.length / Object.keys(colors).length) * 100).toFixed(2)
	console.log(`colors: ${Object.keys(colors).length} total, ${compressionArray.length} active unique (${perc}%)`)
}

go()
