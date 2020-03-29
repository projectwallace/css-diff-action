const test = require('ava')
const createCommentMarkdown = require('./create-comment')

const diffFixture = JSON.parse(
	`[
		{
				"title": "Filesize (raw bytes)",
				"details": "stylesheet",
				"higherIsBetter": false,
				"aggregate": "sum",
				"key": "stylesheets.size",
				"diff": {
						"oldValue": 5607,
						"newValue": 226,
						"changed": true,
						"diff": {
								"absolute": -5381,
								"relative": -0.959693240592117
						}
				}
		},
		{
				"title": "Filesize (raw bytes)",
				"details": "stylesheet",
				"higherIsBetter": false,
				"aggregate": "sum",
				"key": "stylesheets.filesize.uncompressed.totalBytes",
				"diff": {
						"oldValue": 5607,
						"newValue": 226,
						"changed": true,
						"diff": {
								"absolute": -5381,
								"relative": -0.959693240592117
						}
				}
		},
		{
				"title": "Filesize (gzip)",
				"details": "stylesheet",
				"higherIsBetter": false,
				"aggregate": "sum",
				"key": "stylesheets.filesize.compressed.gzip.totalBytes",
				"diff": {
						"oldValue": 1724,
						"newValue": 167,
						"changed": true,
						"diff": {
								"absolute": -1557,
								"relative": -0.9031322505800464
						}
				}
		},
		{
				"title": "Filesize compression ratio (gzip)",
				"details": "stylesheet",
				"higherIsBetter": true,
				"aggregate": "sum",
				"key": "stylesheets.filesize.compressed.gzip.compressionRatio",
				"diff": {
						"oldValue": 0.6925271981451757,
						"newValue": 0.26106194690265483,
						"changed": true,
						"diff": {
								"absolute": -0.4314652512425209,
								"relative": -0.6230300447377838
						}
				}
		},
		{
				"title": "Simplicity",
				"details": "stylesheet",
				"higherIsBetter": true,
				"aggregate": "average",
				"key": "stylesheets.simplicity",
				"diff": {
						"oldValue": 0.8076923076923077,
						"newValue": 1,
						"changed": true,
						"diff": {
								"absolute": 0.1923076923076923,
								"relative": 0.23809523809523808
						}
				}
		},
		{
				"title": "Average cohesion",
				"details": "stylesheet",
				"higherIsBetter": true,
				"aggregate": "average",
				"key": "stylesheets.cohesion.average",
				"diff": {
						"oldValue": 1.6785714285714286,
						"newValue": 1.75,
						"changed": true,
						"diff": {
								"absolute": 0.0714285714285714,
								"relative": 0.04255319148936168
						}
				}
		},
		{
				"title": "Lines of Code",
				"higherIsBetter": false,
				"aggregate": "sum",
				"key": "stylesheets.linesOfCode.total",
				"diff": {
						"oldValue": 25,
						"newValue": 19,
						"changed": true,
						"diff": {
								"absolute": -6,
								"relative": -0.24
						}
				}
		},
		{
				"title": "Source Lines of Code",
				"higherIsBetter": false,
				"aggregate": "sum",
				"key": "stylesheets.linesOfCode.sourceLinesOfCode.total",
				"diff": {
						"oldValue": 257,
						"newValue": 11,
						"changed": true,
						"diff": {
								"absolute": -246,
								"relative": -0.9571984435797666
						}
				}
		},
		{
				"title": "@font-faces",
				"higherIsBetter": false,
				"aggregate": "sum",
				"key": "atrules.fontfaces.total",
				"diff": {
						"oldValue": 4,
						"newValue": 0,
						"changed": true,
						"diff": {
								"absolute": -4,
								"relative": -1
						}
				}
		},
		{
				"higherIsBetter": false,
				"title": "Unique @font-faces",
				"details": "fontfaces",
				"aggregate": "sum",
				"key": "atrules.fontfaces.totalUnique",
				"diff": {
						"oldValue": 4,
						"newValue": 0,
						"changed": true,
						"diff": {
								"absolute": -4,
								"relative": -1
						}
				}
		},
		{
				"higherIsBetter": false,
				"title": "@font-faces",
				"details": "fontfaces",
				"aggregate": "list",
				"key": "atrules.fontfaces.unique",
				"diff": {
						"diff": [
								{
										"value": "{\"font-family\":\"'PT Serif'\",\"font-style\":\"normal\",\"font-weight\":\"400\",\"font-display\":\"swap\",\"src\":\"local('PT Serif'),local('PTSerif-Regular'),url(/fonts/pt-serif-normal-400.woff2) format('woff2')\",\"unicode-range\":\"U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD\"}",
										"added": false,
										"removed": true,
										"changed": true
								},
								{
										"value": "{\"font-family\":\"'PT Serif'\",\"font-style\":\"normal\",\"font-weight\":\"700\",\"font-display\":\"swap\",\"src\":\"local('PT Serif Bold'),local('PTSerif-Bold'),url(/fonts/pt-serif-normal-700.woff2) format('woff2')\",\"unicode-range\":\"U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD\"}",
										"added": false,
										"removed": true,
										"changed": true
								},
								{
										"value": "{\"font-family\":\"\\\"PT Serif\\\"\",\"font-style\":\"normal\",\"font-weight\":\"400\",\"font-display\":\"swap\",\"src\":\"local(\\\"PT Serif\\\"), local(\\\"PTSerif-Regular\\\"), url(\\\"/fonts/pt-serif-normal-400.woff2\\\") format(\\\"woff2\\\")\",\"unicode-range\":\"U+0-FF, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD\"}",
										"added": false,
										"removed": true,
										"changed": true
								},
								{
										"value": "{\"font-family\":\"\\\"PT Serif\\\"\",\"font-style\":\"normal\",\"font-weight\":\"700\",\"font-display\":\"swap\",\"src\":\"local(\\\"PT Serif Bold\\\"), local(\\\"PTSerif-Bold\\\"), url(\\\"/fonts/pt-serif-normal-700.woff2\\\") format(\\\"woff2\\\")\",\"unicode-range\":\"U+0-FF, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD\"}",
										"added": false,
										"removed": true,
										"changed": true
								}
						],
						"changed": true
				}
		},
		{
				"title": "@media queries",
				"higherIsBetter": false,
				"aggregate": "sum",
				"key": "atrules.mediaqueries.total",
				"diff": {
						"oldValue": 8,
						"newValue": 0,
						"changed": true,
						"diff": {
								"absolute": -8,
								"relative": -1
						}
				}
		},
		{
				"title": "Unique @media queries",
				"details": "mediaqueries",
				"higherIsBetter": false,
				"aggregate": "sum",
				"key": "atrules.mediaqueries.totalUnique",
				"diff": {
						"oldValue": 6,
						"newValue": 0,
						"changed": true,
						"diff": {
								"absolute": -6,
								"relative": -1
						}
				}
		},
		{
				"title": "@media queries",
				"aggregate": "list",
				"key": "atrules.mediaqueries.unique",
				"diff": {
						"diff": [
								{
										"value": "(min-width: 60rem)",
										"added": false,
										"removed": true,
										"changed": true
								},
								{
										"value": "(min-width: 80rem)",
										"added": false,
										"removed": true,
										"changed": true
								},
								{
										"value": "(min-width:60rem)",
										"added": false,
										"removed": true,
										"changed": true
								},
								{
										"value": "(min-width:80rem)",
										"added": false,
										"removed": true,
										"changed": true
								},
								{
										"value": "screen and (prefers-color-scheme: dark)",
										"added": false,
										"removed": true,
										"changed": true
								},
								{
										"value": "screen and (prefers-color-scheme:dark)",
										"added": false,
										"removed": true,
										"changed": true
								}
						],
						"changed": true
				}
		}
	]`
)

test('the comment shows the amount of changes', (t) => {
	const actual = createCommentMarkdown({ changes: diffFixture.diff })

	t.is(actual, 3)
})
