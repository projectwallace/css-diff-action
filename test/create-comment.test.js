const test = require('ava')
const { createCommentMarkdown } = require('../src/create-comment')

const diffFixture = [
	{
		title: 'Filesize (raw bytes)',
		aggregate: 'sum',
		key: 'stylesheet.size',
		diff: {
			oldValue: 9,
			newValue: 100,
			diff: { absolute: 91, relative: 10.11111111111111 },
		},
	},
	{
		title: 'Source Lines of Code',
		aggregate: 'sum',
		key: 'stylesheet.sourceLinesOfCode',
		diff: { oldValue: 1, newValue: 9, diff: { absolute: 8, relative: 8 } },
	},
	{
		title: '@font-faces',
		aggregate: 'sum',
		key: 'atrules.fontface.total',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Unique @font-faces',
		aggregate: 'sum',
		key: 'atrules.fontface.totalUnique',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: '@media queries',
		aggregate: 'sum',
		key: 'atrules.media.total',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Unique @media queries',
		aggregate: 'sum',
		key: 'atrules.media.totalUnique',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: '@media queries',
		aggregate: 'list',
		key: 'atrules.media.unique',
		diff: {
			diff: [
				{ value: '(min-width: 30em)', added: true, removed: false, changed: true },
				{ value: 'all', added: false, removed: false, changed: false },
				{ value: 'only screen', added: false, removed: true, changed: true }
			]
		}
	},
	{
		title: 'Rules',
		aggregate: 'sum',
		key: 'rules.total',
		diff: { oldValue: 1, newValue: 3, diff: { absolute: 2, relative: 2 } },
	},
	{
		title: 'Empty rules',
		aggregate: 'sum',
		key: 'rules.empty.total',
		diff: { oldValue: 1, newValue: 0, diff: { absolute: -1, relative: -1 } },
	},
	{
		title: 'Minimum size per rule',
		aggregate: 'min',
		key: 'rules.sizes.min',
		diff: { oldValue: 1, newValue: 2, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Maximum size per rule',
		aggregate: 'max',
		key: 'rules.sizes.max',
		diff: { oldValue: 1, newValue: 2, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Average size per rule',
		aggregate: 'average',
		key: 'rules.sizes.mean',
		diff: { oldValue: 1, newValue: 2, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Most common size per rule',
		aggregate: 'average',
		key: 'rules.sizes.mode',
		diff: { oldValue: 1, newValue: 2, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'RuleSet sizes',
		aggregate: 'list',
		key: 'rules.sizes.unique',
		diff: {
			diff: [
				{ value: '0', added: false, removed: true, changed: true },
				{ value: '2', added: true, removed: false, changed: true },
			],
		},
	},
	{
		title: 'Selectors per RuleSet',
		aggregate: 'list',
		key: 'rules.selectors.unique',
		diff: {
			diff: [
				{ value: '0', added: false, removed: true, changed: true },
				{ value: '1', added: true, removed: false, changed: true },
			],
		},
	},
	{
		title: 'Minimum declarations per rule',
		aggregate: 'min',
		key: 'rules.declarations.min',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Maximum declarations per rule',
		aggregate: 'max',
		key: 'rules.declarations.max',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Average declarations per rule',
		aggregate: 'average',
		key: 'rules.declarations.mean',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Most common declarations per rule',
		aggregate: 'average',
		key: 'rules.declarations.mode',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Declarations per RuleSet',
		aggregate: 'list',
		key: 'rules.declarations.unique',
		diff: {
			diff: [
				{ value: '0', added: false, removed: true, changed: true },
				{ value: '1', added: true, removed: false, changed: true },
			],
		},
	},
	{
		title: 'Selectors',
		aggregate: 'sum',
		key: 'selectors.total',
		diff: { oldValue: 1, newValue: 3, diff: { absolute: 2, relative: 2 } },
	},
	{
		title: 'Unique selectors',
		aggregate: 'sum',
		key: 'selectors.totalUnique',
		diff: { oldValue: 1, newValue: 3, diff: { absolute: 2, relative: 2 } },
	},
	{
		title: 'Total Selector Complexity',
		aggregate: 'sum',
		key: 'selectors.complexity.sum',
		diff: { oldValue: 1, newValue: 3, diff: { absolute: 2, relative: 2 } },
	},
	{
		title: 'Unique Selector Complexities',
		aggregate: 'list',
		key: 'selectors.complexity.unique',
		diff: {
			diff: [
				{ value: '0', added: false, removed: true, changed: true },
				{ value: '1', added: true, removed: false, changed: true },
			],
		},
	},
	{
		title: 'ID selectors',
		aggregate: 'sum',
		key: 'selectors.id.total',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Unique ID Selectors',
		aggregate: 'sum',
		key: 'selectors.id.totalUnique',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Declarations',
		aggregate: 'sum',
		key: 'declarations.total',
		diff: { oldValue: 0, newValue: 4, diff: { absolute: 4, relative: 1 } },
	},
	{
		title: 'Unique declarations',
		aggregate: 'sum',
		key: 'declarations.totalUnique',
		diff: { oldValue: 0, newValue: 4, diff: { absolute: 4, relative: 1 } },
	},
	{
		title: 'Properties',
		aggregate: 'sum',
		key: 'properties.total',
		diff: { oldValue: 0, newValue: 4, diff: { absolute: 4, relative: 1 } },
	},
	{
		title: 'Unique properties',
		aggregate: 'sum',
		key: 'properties.totalUnique',
		diff: { oldValue: 0, newValue: 4, diff: { absolute: 4, relative: 1 } },
	},
	{
		title: 'Properties',
		aggregate: 'list',
		key: 'properties.unique',
		diff: {
			diff: [
				{ value: 'color', added: true, removed: false, changed: true },
				{ value: 'font-family', added: true, removed: false, changed: true },
				{ value: 'font-size', added: true, removed: false, changed: true },
				{ value: 'x', added: true, removed: false, changed: true },
			],
		},
	},
	{
		title: 'Property complexity',
		aggregate: 'sum',
		key: 'properties.complexity.sum',
		diff: { oldValue: 0, newValue: 4, diff: { absolute: 4, relative: 1 } },
	},
	{
		title: 'Max. property complexity',
		aggregate: 'max',
		key: 'properties.complexity.max',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Min. property complexity',
		aggregate: 'min',
		key: 'properties.complexity.min',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Avg. property complexity',
		aggregate: 'average',
		key: 'properties.complexity.mean',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Most common property complexity',
		aggregate: 'average',
		key: 'properties.complexity.mode',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Font-sizes',
		aggregate: 'sum',
		key: 'values.fontSizes.total',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Unique font-sizes',
		aggregate: 'sum',
		key: 'values.fontSizes.totalUnique',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Font-sizes',
		aggregate: 'list',
		key: 'values.fontSizes.unique',
		diff: {
			diff: [{ value: '3em', added: true, removed: false, changed: true }],
		},
	},
	{
		title: 'Font-families',
		aggregate: 'sum',
		key: 'values.fontFamilies.total',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Unique font-families',
		aggregate: 'sum',
		key: 'values.fontFamilies.totalUnique',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Font-families',
		aggregate: 'list',
		key: 'values.fontFamilies.unique',
		diff: {
			diff: [{ value: '"x"', added: true, removed: false, changed: true }],
		},
	},
	{
		title: 'Colors',
		aggregate: 'sum',
		key: 'values.colors.total',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Unique colors',
		aggregate: 'sum',
		key: 'values.colors.totalUnique',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Colors',
		aggregate: 'list',
		key: 'values.colors.unique',
		diff: {
			diff: [{ value: 'red', added: true, removed: false, changed: true }],
		},
	},
	{
		title: 'Units',
		aggregate: 'sum',
		key: 'values.units.total',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Unique units',
		aggregate: 'sum',
		key: 'values.units.totalUnique',
		diff: { oldValue: 0, newValue: 1, diff: { absolute: 1, relative: 1 } },
	},
	{
		title: 'Units',
		aggregate: 'list',
		key: 'values.units.unique',
		diff: {
			diff: [{ value: 'em', added: true, removed: false, changed: true }],
		},
	},
]

let actual

test.beforeEach(() => {
	actual = createCommentMarkdown({ changes: diffFixture })
})

test('it shows a table header', (t) => {
	t.true(
		actual.includes('| metric | current value | value after PR | difference |')
	)
})

test('it shows filesize diffs correctly', (t) => {
	const expected = '| Filesize (raw bytes) | 9 B | 100 B | +91 B (+1,011.11%) |'
	const line = actual
		.split('\n')
		.find((line) => line.startsWith('| Filesize (raw bytes)'))

	t.is(line, expected)
})

test('it shows total diffs correctly', (t) => {
	const lines = actual.split('\n')
	const rules = lines.find((line) => line.startsWith('| Rules |'))
	t.is(rules, '| Rules | 1 | 3 | +2 (+200%) |')

	const selectorComplexity = lines.find((line) =>
		line.startsWith('| Total Selector Complexity |')
	)
	t.is(selectorComplexity, '| Total Selector Complexity | 1 | 3 | +2 (+200%) |')
})

test('it shows complex array-like diffs correctly', (t) => {
	const lines = actual
		.split('\n')
		.filter((line) => line.startsWith('| @media queries |'))
	const media = lines[lines.length - 1]
	t.is(
		media,
		'| @media queries | <ol><li></li><li><code>all</code></li><li><del><code>only screen</code></del></li></ol> | <ol><li><ins><code>(min-width: 30em)</code></ins></li><li><code>all</code></li><li></li></ol> | |'
	)
})
