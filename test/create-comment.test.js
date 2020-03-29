const test = require('ava')
const { createCommentMarkdown } = require('../src/create-comment')

const diffFixture = [
	{
		title: 'Filesize (raw bytes)',
		details: 'stylesheet',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'stylesheets.size',
		diff: {
			oldValue: 5607,
			newValue: 226,
			changed: true,
			diff: {
				absolute: -5381,
				relative: -0.959693240592117,
			},
		},
	},
	{
		title: 'Filesize (raw bytes)',
		details: 'stylesheet',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'stylesheets.filesize.uncompressed.totalBytes',
		diff: {
			oldValue: 5607,
			newValue: 226,
			changed: true,
			diff: {
				absolute: -5381,
				relative: -0.959693240592117,
			},
		},
	},
	{
		title: 'Filesize (gzip)',
		details: 'stylesheet',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'stylesheets.filesize.compressed.gzip.totalBytes',
		diff: {
			oldValue: 1724,
			newValue: 167,
			changed: true,
			diff: {
				absolute: -1557,
				relative: -0.9031322505800464,
			},
		},
	},
	{
		title: 'Filesize compression ratio (gzip)',
		details: 'stylesheet',
		higherIsBetter: true,
		aggregate: 'sum',
		key: 'stylesheets.filesize.compressed.gzip.compressionRatio',
		diff: {
			oldValue: 0.6925271981451757,
			newValue: 0.26106194690265483,
			changed: true,
			diff: {
				absolute: -0.4314652512425209,
				relative: -0.6230300447377838,
			},
		},
	},
	{
		title: 'Simplicity',
		details: 'stylesheet',
		higherIsBetter: true,
		aggregate: 'average',
		key: 'stylesheets.simplicity',
		diff: {
			oldValue: 0.8076923076923077,
			newValue: 1,
			changed: true,
			diff: {
				absolute: 0.1923076923076923,
				relative: 0.23809523809523808,
			},
		},
	},
	{
		title: 'Average cohesion',
		details: 'stylesheet',
		higherIsBetter: true,
		aggregate: 'average',
		key: 'stylesheets.cohesion.average',
		diff: {
			oldValue: 1.6785714285714286,
			newValue: 1.75,
			changed: true,
			diff: {
				absolute: 0.0714285714285714,
				relative: 0.04255319148936168,
			},
		},
	},
	{
		title: 'Lines of Code',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'stylesheets.linesOfCode.total',
		diff: {
			oldValue: 25,
			newValue: 19,
			changed: true,
			diff: {
				absolute: -6,
				relative: -0.24,
			},
		},
	},
	{
		title: 'Source Lines of Code',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'stylesheets.linesOfCode.sourceLinesOfCode.total',
		diff: {
			oldValue: 257,
			newValue: 11,
			changed: true,
			diff: {
				absolute: -246,
				relative: -0.9571984435797666,
			},
		},
	},
	{
		title: '@font-faces',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'atrules.fontfaces.total',
		diff: {
			oldValue: 4,
			newValue: 0,
			changed: true,
			diff: {
				absolute: -4,
				relative: -1,
			},
		},
	},
	{
		higherIsBetter: false,
		title: 'Unique @font-faces',
		details: 'fontfaces',
		aggregate: 'sum',
		key: 'atrules.fontfaces.totalUnique',
		diff: {
			oldValue: 4,
			newValue: 0,
			changed: true,
			diff: {
				absolute: -4,
				relative: -1,
			},
		},
	},
	{
		higherIsBetter: false,
		title: '@font-faces',
		details: 'fontfaces',
		aggregate: 'list',
		key: 'atrules.fontfaces.unique',
		diff: {
			diff: [
				{
					value:
						'{"font-family":"\'PT Serif\'","font-style":"normal","font-weight":"400","font-display":"swap","src":"local(\'PT Serif\'),local(\'PTSerif-Regular\'),url(/fonts/pt-serif-normal-400.woff2) format(\'woff2\')","unicode-range":"U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"}',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value:
						'{"font-family":"\'PT Serif\'","font-style":"normal","font-weight":"700","font-display":"swap","src":"local(\'PT Serif Bold\'),local(\'PTSerif-Bold\'),url(/fonts/pt-serif-normal-700.woff2) format(\'woff2\')","unicode-range":"U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"}',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value:
						'{"font-family":"\\"PT Serif\\"","font-style":"normal","font-weight":"400","font-display":"swap","src":"local(\\"PT Serif\\"), local(\\"PTSerif-Regular\\"), url(\\"/fonts/pt-serif-normal-400.woff2\\") format(\\"woff2\\")","unicode-range":"U+0-FF, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value:
						'{"font-family":"\\"PT Serif\\"","font-style":"normal","font-weight":"700","font-display":"swap","src":"local(\\"PT Serif Bold\\"), local(\\"PTSerif-Bold\\"), url(\\"/fonts/pt-serif-normal-700.woff2\\") format(\\"woff2\\")","unicode-range":"U+0-FF, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD"}',
					added: false,
					removed: true,
					changed: true,
				},
			],
			changed: true,
		},
	},
	{
		title: '@media queries',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'atrules.mediaqueries.total',
		diff: {
			oldValue: 8,
			newValue: 0,
			changed: true,
			diff: {
				absolute: -8,
				relative: -1,
			},
		},
	},
	{
		title: 'Unique @media queries',
		details: 'mediaqueries',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'atrules.mediaqueries.totalUnique',
		diff: {
			oldValue: 6,
			newValue: 0,
			changed: true,
			diff: {
				absolute: -6,
				relative: -1,
			},
		},
	},
	{
		title: '@media queries',
		aggregate: 'list',
		key: 'atrules.mediaqueries.unique',
		diff: {
			diff: [
				{
					value: '(min-width: 60rem)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '(min-width: 80rem)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '(min-width:60rem)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '(min-width:80rem)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'screen and (prefers-color-scheme: dark)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'screen and (prefers-color-scheme:dark)',
					added: false,
					removed: true,
					changed: true,
				},
			],
			changed: true,
		},
	},
	{
		title: 'Rules',
		details: 'stylesheet',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'rules.total',
		diff: {
			oldValue: 84,
			newValue: 4,
			changed: true,
			diff: {
				absolute: -80,
				relative: -0.9523809523809523,
			},
		},
	},
	{
		title: 'Maximum selectors per rule',
		higherIsBetter: false,
		aggregate: 'max',
		key: 'rules.selectors.max',
		diff: {
			oldValue: 3,
			newValue: 1,
			changed: true,
			diff: {
				absolute: -2,
				relative: -0.6666666666666666,
			},
		},
	},
	{
		title: 'Average selectors per rule',
		higherIsBetter: false,
		aggregate: 'average',
		key: 'rules.selectors.average',
		diff: {
			oldValue: 1.2380952380952381,
			newValue: 1,
			changed: true,
			diff: {
				absolute: -0.23809523809523814,
				relative: -0.19230769230769235,
			},
		},
	},
	{
		title: 'Selectors',
		details: 'selectors',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'selectors.total',
		diff: {
			oldValue: 104,
			newValue: 4,
			changed: true,
			diff: {
				absolute: -100,
				relative: -0.9615384615384616,
			},
		},
	},
	{
		title: 'Unique selectors',
		details: 'selectors',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'selectors.totalUnique',
		diff: {
			oldValue: 22,
			newValue: 4,
			changed: true,
			diff: {
				absolute: -18,
				relative: -0.8181818181818182,
			},
		},
	},
	{
		title: 'Avg. Selector Complexity',
		details: 'selectors',
		higherIsBetter: false,
		aggregate: 'average',
		key: 'selectors.complexity.average',
		diff: {
			oldValue: 1.1538461538461537,
			newValue: 1.25,
			changed: true,
			diff: {
				absolute: 0.09615384615384626,
				relative: 0.08333333333333343,
			},
		},
	},
	{
		title: 'Total Selector Complexity',
		details: 'selectors',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'selectors.complexity.sum',
		diff: {
			oldValue: 120,
			newValue: 5,
			changed: true,
			diff: {
				absolute: -115,
				relative: -0.9583333333333334,
			},
		},
	},
	{
		title: 'Unique Selector Complexities',
		details: 'selectors',
		aggregate: 'list',
		key: 'selectors.complexity.unique',
		diff: {
			diff: [
				{
					value: 0,
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 1,
					added: false,
					removed: false,
					changed: false,
				},
				{
					value: 2,
					added: false,
					removed: false,
					changed: false,
				},
				{
					value: 3,
					added: false,
					removed: true,
					changed: true,
				},
			],
			changed: true,
		},
	},
	{
		title: 'Unique Selector Complexity',
		details: 'selectors',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'selectors.complexity.totalUnique',
		diff: {
			oldValue: 4,
			newValue: 2,
			changed: true,
			diff: {
				absolute: -2,
				relative: -0.5,
			},
		},
	},
	{
		title: 'Max. Selector Complexity',
		details: 'selectors',
		higherIsBetter: false,
		aggregate: 'max',
		key: 'selectors.complexity.max.value',
		diff: {
			oldValue: 3,
			newValue: 2,
			changed: true,
			diff: {
				absolute: -1,
				relative: -0.3333333333333333,
			},
		},
	},
	{
		title: 'Max. Complexity Selectors',
		details: 'selectors',
		aggregate: 'list',
		key: 'selectors.complexity.max.selectors',
		diff: {
			diff: [
				{
					value: 'button:focus',
					added: true,
					removed: false,
					changed: true,
				},
				{
					value: 'nav a:nth-of-type(2)',
					added: false,
					removed: true,
					changed: true,
				},
			],
			changed: true,
		},
	},
	{
		title: 'Universal selectors',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'selectors.universal.total',
		diff: {
			oldValue: 2,
			newValue: 0,
			changed: true,
			diff: {
				absolute: -2,
				relative: -1,
			},
		},
	},
	{
		title: 'Unique universal selectors',
		details: 'selectors',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'selectors.universal.totalUnique',
		diff: {
			oldValue: 1,
			newValue: 0,
			changed: true,
			diff: {
				absolute: -1,
				relative: -1,
			},
		},
	},
	{
		title: 'Universal selectors',
		aggregate: 'list',
		key: 'selectors.universal.unique',
		diff: {
			diff: [
				{
					value: '*',
					added: false,
					removed: true,
					changed: true,
				},
			],
			changed: true,
		},
	},
	{
		title: 'Top specificity selectors',
		aggregate: 'list',
		formatter: null,
		key: 'selectors.specificity.top',
		diff: {
			diff: [
				{
					value: '.bio',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '.logo',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '.sidebar',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '.unstyled',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'body',
					added: true,
					removed: false,
					changed: true,
				},
				{
					value: 'button',
					added: true,
					removed: false,
					changed: true,
				},
				{
					value: 'button:focus',
					added: true,
					removed: false,
					changed: true,
				},
				{
					value: 'html',
					added: true,
					removed: false,
					changed: true,
				},
				{
					value: 'nav a:nth-of-type(2)',
					added: false,
					removed: true,
					changed: true,
				},
			],
			changed: true,
		},
	},
	{
		title: 'Declarations',
		details: 'declarations',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'declarations.total',
		diff: {
			oldValue: 141,
			newValue: 7,
			changed: true,
			diff: {
				absolute: -134,
				relative: -0.950354609929078,
			},
		},
	},
	{
		title: 'Unique declarations',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'declarations.totalUnique',
		diff: {
			oldValue: 98,
			newValue: 7,
			changed: true,
			diff: {
				absolute: -91,
				relative: -0.9285714285714286,
			},
		},
	},
	{
		title: 'Properties',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'properties.total',
		diff: {
			oldValue: 141,
			newValue: 7,
			changed: true,
			diff: {
				absolute: -134,
				relative: -0.950354609929078,
			},
		},
	},
	{
		title: 'Unique properties',
		details: 'declarations',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'properties.totalUnique',
		diff: {
			oldValue: 42,
			newValue: 6,
			changed: true,
			diff: {
				absolute: -36,
				relative: -0.8571428571428571,
			},
		},
	},
	{
		title: 'Properties',
		aggregate: 'list',
		key: 'properties.unique',
		diff: {
			diff: [
				{
					value: '--main-width',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '--ratio',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '--sidebar-width',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '-moz-osx-font-smoothing',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '-moz-tab-size',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '-ms-text-size-adjust',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '-webkit-appearance',
					added: true,
					removed: false,
					changed: true,
				},
				{
					value: '-webkit-font-smoothing',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '-webkit-overflow-scrolling',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '-webkit-text-size-adjust',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'align-items',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'animation-duration',
					added: true,
					removed: false,
					changed: true,
				},
				{
					value: 'background',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'background-color',
					added: false,
					removed: false,
					changed: false,
				},
				{
					value: 'border',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'border-color',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'border-radius',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'box-sizing',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'color',
					added: false,
					removed: false,
					changed: false,
				},
				{
					value: 'display',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'fill',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'flex-direction',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'font-family',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'font-size',
					added: false,
					removed: false,
					changed: false,
				},
				{
					value: 'font-weight',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'gap',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'grid-column',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'grid-template-columns',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'height',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'line-height',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'list-style',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'margin',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'margin-left',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'margin-top',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'max-width',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'outline',
					added: true,
					removed: false,
					changed: true,
				},
				{
					value: 'overflow',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'overflow-x',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'padding',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'padding-left',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'tab-size',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'text-decoration-color',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'text-decoration-thickness',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'text-size-adjust',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'white-space',
					added: false,
					removed: true,
					changed: true,
				},
			],
			changed: true,
		},
	},
	{
		title: 'Prefixed properties',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'properties.prefixed.total',
		diff: {
			oldValue: 7,
			newValue: 1,
			changed: true,
			diff: {
				absolute: -6,
				relative: -0.8571428571428571,
			},
		},
	},
	{
		title: 'Unique prefixed properties',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'properties.prefixed.totalUnique',
		diff: {
			oldValue: 6,
			newValue: 1,
			changed: true,
			diff: {
				absolute: -5,
				relative: -0.8333333333333334,
			},
		},
	},
	{
		title: 'Prefixed properties %',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'properties.prefixed.share',
		diff: {
			oldValue: 0.04964539007092199,
			newValue: 0.14285714285714285,
			changed: true,
			diff: {
				absolute: 0.09321175278622086,
				relative: 1.877551020408163,
			},
		},
	},
	{
		title: 'Prefixed properties',
		aggregate: 'list',
		key: 'properties.prefixed.unique',
		diff: {
			diff: [
				{
					value: '-moz-osx-font-smoothing',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '-moz-tab-size',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '-ms-text-size-adjust',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '-webkit-appearance',
					added: true,
					removed: false,
					changed: true,
				},
				{
					value: '-webkit-font-smoothing',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '-webkit-overflow-scrolling',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '-webkit-text-size-adjust',
					added: false,
					removed: true,
					changed: true,
				},
			],
			changed: true,
		},
	},
	{
		title: 'Values',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'values.total',
		diff: {
			oldValue: 141,
			newValue: 7,
			changed: true,
			diff: {
				absolute: -134,
				relative: -0.950354609929078,
			},
		},
	},
	{
		title: 'Font-sizes',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'values.fontsizes.total',
		diff: {
			oldValue: 10,
			newValue: 1,
			changed: true,
			diff: {
				absolute: -9,
				relative: -0.9,
			},
		},
	},
	{
		title: 'Unique font-sizes',
		details: 'fontsizes',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'values.fontsizes.totalUnique',
		diff: {
			oldValue: 7,
			newValue: 1,
			changed: true,
			diff: {
				absolute: -6,
				relative: -0.8571428571428571,
			},
		},
	},
	{
		title: 'Font-sizes',
		aggregate: 'list',
		key: 'values.fontsizes.unique',
		diff: {
			diff: [
				{
					value: '0.5rem',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '.5rem',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '100%',
					added: false,
					removed: false,
					changed: false,
				},
				{
					value: '110%',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '120%',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'calc(80% + 0.4vw)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'calc(80% + .4vw)',
					added: false,
					removed: true,
					changed: true,
				},
			],
			changed: true,
		},
	},
	{
		title: 'Font-families',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'values.fontfamilies.total',
		diff: {
			oldValue: 4,
			newValue: 0,
			changed: true,
			diff: {
				absolute: -4,
				relative: -1,
			},
		},
	},
	{
		title: 'Unique font-families',
		details: 'fontfamilies',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'values.fontfamilies.totalUnique',
		diff: {
			oldValue: 4,
			newValue: 0,
			changed: true,
			diff: {
				absolute: -4,
				relative: -1,
			},
		},
	},
	{
		title: 'Font-families',
		aggregate: 'list',
		key: 'values.fontfamilies.unique',
		diff: {
			diff: [
				{
					value: '"PT Serif", Georgia, serif',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: "'PT Serif',Georgia,serif",
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'monospace, monospace',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'monospace,monospace',
					added: false,
					removed: true,
					changed: true,
				},
			],
			changed: true,
		},
	},
	{
		title: 'Colors',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'values.colors.total',
		diff: {
			oldValue: 40,
			newValue: 3,
			changed: true,
			diff: {
				absolute: -37,
				relative: -0.925,
			},
		},
	},
	{
		title: 'Unique colors',
		details: 'colors',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'values.colors.totalUnique',
		diff: {
			oldValue: 28,
			newValue: 3,
			changed: true,
			diff: {
				absolute: -25,
				relative: -0.8928571428571429,
			},
		},
	},
	{
		title: 'Colors',
		aggregate: 'list',
		key: 'values.colors.unique',
		diff: {
			diff: [
				{
					value: 'rgb(32, 178, 170)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#20b2aa',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'rgb(245, 248, 248)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#f5f8f8',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'rgb(239, 244, 244)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#eff4f4',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'deepskyblue',
					added: true,
					removed: false,
					changed: true,
				},
				{
					value: 'rgb(10, 20, 24)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#0a1418',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'rgb(17, 28, 33)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#111c21',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'rgb(35, 56, 66)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#233842',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'rgb(53, 84, 99)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#355463',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'rgb(122, 163, 183)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#7aa3b7',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'rgb(226, 230, 232)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#e2e6e8',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'rgb(50, 118, 153)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#327699',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'rgb(101, 169, 204)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#65a9cc',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'rgb(132, 159, 173)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#849fad',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'rgb(102, 135, 153)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#668799',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'rgb(198, 205, 209)',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#c6cdd1',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: 'blue',
					added: true,
					removed: false,
					changed: true,
				},
				{
					value: 'whitesmoke',
					added: true,
					removed: false,
					changed: true,
				},
			],
			changed: true,
		},
	},
	{
		title: 'Color duplicates',
		higherIsBetter: false,
		aggregate: 'list',
		key: 'values.colors.duplicates.unique',
		diff: {
			diff: [
				{
					value: '#0a1418',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#7aa3b7',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#20b2aa',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#65a9cc',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#111c21',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#849fad',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#233842',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#327699',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#355463',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#668799',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#c6cdd1',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#e2e6e8',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#eff4f4',
					added: false,
					removed: true,
					changed: true,
				},
				{
					value: '#f5f8f8',
					added: false,
					removed: true,
					changed: true,
				},
			],
			changed: true,
		},
	},
	{
		title: 'Color duplicates',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'values.colors.duplicates.total',
		diff: {
			oldValue: 14,
			newValue: 0,
			changed: true,
			diff: {
				absolute: -14,
				relative: -1,
			},
		},
	},
	{
		title: 'Color duplicates',
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'values.colors.duplicates.totalUnique',
		diff: {
			oldValue: 14,
			newValue: 0,
			changed: true,
			diff: {
				absolute: -14,
				relative: -1,
			},
		},
	},
	{
		title: 'Animation durations',
		details: null,
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'values.animations.durations.total',
		diff: {
			oldValue: 0,
			newValue: 1,
			changed: true,
			diff: {
				absolute: 1,
				relative: 1,
			},
		},
	},
	{
		title: 'Unique animation durations',
		details: null,
		higherIsBetter: false,
		aggregate: 'sum',
		key: 'values.animations.durations.totalUnique',
		diff: {
			oldValue: 0,
			newValue: 1,
			changed: true,
			diff: {
				absolute: 1,
				relative: 1,
			},
		},
	},
	{
		title: 'Animation durations',
		details: null,
		aggregate: 'list',
		key: 'values.animations.durations.unique',
		diff: {
			diff: [
				{
					value: '2s',
					added: true,
					removed: false,
					changed: true,
				},
			],
			changed: true,
		},
	},
]

let actual

test.beforeEach(() => {
	actual = createCommentMarkdown({ changes: diffFixture })
})

test('it shows the amount of changes', (t) => {
	t.true(actual.includes('| changed metrics | 54 |'))
})

test('it shows a table header', (t) => {
	t.true(
		actual.includes('| metric | current value | value after PR | difference |')
	)
})

test('it shows filesize diffs correctly', (t) => {
	const expected =
		'| Filesize (raw bytes) | 5.61 kB | 226 B | -5.38 kB (-95.97%) |'
	t.true(actual.includes(expected))
})

test('it shows total diffs correctly', (t) => {
	t.true(actual.includes('| Rules | 84 | 4 | -80 (-95.24%) |'))
	t.true(
		actual.includes(
			'| Avg. Selector Complexity | 1.154 | 1.250 | +0.096 (+8.33%) |'
		)
	)
})

test('it shows array-like diffs correctly', (t) => {
	t.true(
		actual.includes(
			`| @font-faces | <ol><li><del><dl><dt><code>font-family</code></dt><dd><code>'PT Serif'</code></dd><dt><code>font-style</code></dt><dd><code>normal</code></dd><dt><code>font-weight</code></dt><dd><code>400</code></dd><dt><code>font-display</code></dt><dd><code>swap</code></dd><dt><code>src</code></dt><dd><code>local('PT Serif'),local('PTSerif-Regular'),url(/fonts/pt-serif-normal-400.woff2) format('woff2')</code></dd><dt><code>unicode-range</code></dt><dd><code>U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD</code></dd></dl></del></li><li><del><dl><dt><code>font-family</code></dt><dd><code>'PT Serif'</code></dd><dt><code>font-style</code></dt><dd><code>normal</code></dd><dt><code>font-weight</code></dt><dd><code>700</code></dd><dt><code>font-display</code></dt><dd><code>swap</code></dd><dt><code>src</code></dt><dd><code>local('PT Serif Bold'),local('PTSerif-Bold'),url(/fonts/pt-serif-normal-700.woff2) format('woff2')</code></dd><dt><code>unicode-range</code></dt><dd><code>U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD</code></dd></dl></del></li><li><del><dl><dt><code>font-family</code></dt><dd><code>"PT Serif"</code></dd><dt><code>font-style</code></dt><dd><code>normal</code></dd><dt><code>font-weight</code></dt><dd><code>400</code></dd><dt><code>font-display</code></dt><dd><code>swap</code></dd><dt><code>src</code></dt><dd><code>local("PT Serif"), local("PTSerif-Regular"), url("/fonts/pt-serif-normal-400.woff2") format("woff2")</code></dd><dt><code>unicode-range</code></dt><dd><code>U+0-FF, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD</code></dd></dl></del></li><li><del><dl><dt><code>font-family</code></dt><dd><code>"PT Serif"</code></dd><dt><code>font-style</code></dt><dd><code>normal</code></dd><dt><code>font-weight</code></dt><dd><code>700</code></dd><dt><code>font-display</code></dt><dd><code>swap</code></dd><dt><code>src</code></dt><dd><code>local("PT Serif Bold"), local("PTSerif-Bold"), url("/fonts/pt-serif-normal-700.woff2") format("woff2")</code></dd><dt><code>unicode-range</code></dt><dd><code>U+0-FF, U+131, U+152-153, U+2BB-2BC, U+2C6, U+2DA, U+2DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD</code></dd></dl></del></li></ol> | <ol><li></li><li></li><li></li><li></li></ol> | |`
		)
	)
})

test('it shows complex array-like diffs correctly', (t) => {
	t.true(
		actual.includes(
			'| Properties | <ol><li><del><code>--main-width</code></del></li><li><del><code>--ratio</code></del></li><li><del><code>--sidebar-width</code></del></li><li><del><code>-moz-osx-font-smoothing</code></del></li><li><del><code>-moz-tab-size</code></del></li><li><del><code>-ms-text-size-adjust</code></del></li><li></li><li><del><code>-webkit-font-smoothing</code></del></li><li><del><code>-webkit-overflow-scrolling</code></del></li><li><del><code>-webkit-text-size-adjust</code></del></li><li><del><code>align-items</code></del></li><li></li><li><del><code>background</code></del></li><li><code>background-color</code></li><li><del><code>border</code></del></li><li><del><code>border-color</code></del></li><li><del><code>border-radius</code></del></li><li><del><code>box-sizing</code></del></li><li><code>color</code></li><li><del><code>display</code></del></li><li><del><code>fill</code></del></li><li><del><code>flex-direction</code></del></li><li><del><code>font-family</code></del></li><li><code>font-size</code></li><li><del><code>font-weight</code></del></li><li><del><code>gap</code></del></li><li><del><code>grid-column</code></del></li><li><del><code>grid-template-columns</code></del></li><li><del><code>height</code></del></li><li><del><code>line-height</code></del></li><li><del><code>list-style</code></del></li><li><del><code>margin</code></del></li><li><del><code>margin-left</code></del></li><li><del><code>margin-top</code></del></li><li><del><code>max-width</code></del></li><li></li><li><del><code>overflow</code></del></li><li><del><code>overflow-x</code></del></li><li><del><code>padding</code></del></li><li><del><code>padding-left</code></del></li><li><del><code>tab-size</code></del></li><li><del><code>text-decoration-color</code></del></li><li><del><code>text-decoration-thickness</code></del></li><li><del><code>text-size-adjust</code></del></li><li><del><code>white-space</code></del></li></ol> | <ol><li></li><li></li><li></li><li></li><li></li><li></li><li><ins><code>-webkit-appearance</code></ins></li><li></li><li></li><li></li><li></li><li><ins><code>animation-duration</code></ins></li><li></li><li><code>background-color</code></li><li></li><li></li><li></li><li></li><li><code>color</code></li><li></li><li></li><li></li><li></li><li><code>font-size</code></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li><ins><code>outline</code></ins></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ol> | |'
		)
	)
})

test('it matches the snapshot exactly', (t) => {
	t.snapshot(actual)
})
