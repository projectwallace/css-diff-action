const prettyBytes = require('pretty-bytes')

const DEPRECATED_METRICS = ['stylesheets.size']

function formatNumber(number) {
	return Number.isInteger(number)
		? new Intl.NumberFormat().format(number)
		: parseFloat(number).toFixed(3)
}

function formatFilesize(number, relative = false) {
	if (
		number === null ||
		Number.isNaN(number) ||
		typeof number === 'undefined'
	) {
		return ''
	}

	return prettyBytes(number, { signed: relative })
}

function formatDiff(number) {
	if (
		number === null ||
		Number.isNaN(number) ||
		typeof number === 'undefined'
	) {
		return ''
	}

	if (number === 0) {
		return 0
	}

	return number > 0 ? `+${formatNumber(number)}` : formatNumber(number)
}

function formatPercentage(number, decimals = 2) {
	if (
		number === null ||
		Number.isNaN(number) ||
		typeof number === 'undefined'
	) {
		return ''
	}

	if (number === Infinity) {
		return '∞'
	}

	return `${number > 0 ? '+' : ''}${new Intl.NumberFormat('en-US', {
		style: 'percent',
		maximumFractionDigits: decimals,
	}).format(number)}`
}

function formatListItem({ key, value }) {
	if (key === 'atrules.fontfaces.unique') {
		return `<dl>${Object.entries(JSON.parse(value))
			.map(([prop, val]) => {
				return `<dt><code>${prop}</code></dt><dd><code>${val}</code></dd>`
			})
			.join('')}</dl>`
	}

	return `<code>${value}</code>`
}

exports.createCommentMarkdown = ({ changes }) => {
	if (changes.length === 0) {
		return 'No changes in CSS Analytics detected'
	}

	return `
		### CSS Analytics changes

		_Last updated: ${new Date().toISOString()}_

		| metric | current value | value after PR | difference |
		|--------|---------------|----------------|------------|
		${changes
			.filter(({ key }) => !DEPRECATED_METRICS.includes(key))
			.map(({ title, diff, aggregate, key }) => {
				if (aggregate === 'list') {
					const oldValues = diff.diff
						.map((item) => {
							if (item.added) return `<li></li>`
							if (item.removed)
								return `<li><del>${formatListItem({
									key,
									value: item.value,
								})}</del></li>`
							return `<li>${formatListItem({ key, value: item.value })}</li>`
						})
						.join('')
					const newValues = diff.diff
						.map((item) => {
							if (item.removed) return `<li></li>`
							if (item.added)
								return `<li><ins>${formatListItem({
									key,
									value: item.value,
								})}</ins></li>`
							return `<li>${formatListItem({ key, value: item.value })}</li>`
						})
						.join('')
					return `| ${title} | <ol>${oldValues}</ol> | <ol>${newValues}</ol> | |`
				}

				if (key.includes('totalBytes')) {
					return `| ${title} | ${formatFilesize(
						diff.oldValue
					)} | ${formatFilesize(diff.newValue)} | ${formatFilesize(
						diff.diff.absolute,
						true
					)} (${formatPercentage(diff.diff.relative)}) |`
				}

				return `| ${title} | ${formatNumber(diff.oldValue)} | ${formatNumber(
					diff.newValue
				)} | ${formatDiff(diff.diff.absolute)} (${formatPercentage(
					diff.diff.relative
				)}) |`
			})
			.join('\n')}
		`
		.split('\n')
		.map((line) => line.trim())
		.join('\n')
		.trim()
}
