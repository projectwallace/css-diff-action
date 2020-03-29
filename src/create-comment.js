const prettyBytes = require('pretty-bytes')

function formatNumber(number) {
	return Number.isInteger(number)
		? new Intl.NumberFormat().format(number)
		: parseFloat(number).toFixed(3)
}

function formatValue(value, key) {
	if (['test'].includes(key)) {
		return formatFilesize(value)
	}

	return formatNumber(value)
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

	return `${new Intl.NumberFormat('en-US', {
		style: 'percent',
		maximumFractionDigits: decimals,
	}).format(number)}`
}

exports.createCommentMarkdown = ({ changes }) => {
	if (changes.length === 0) {
		return 'No changes in CSS Analytics detected'
	}

	return `
		### CSS Analytics changes

		| changed metrics | ${changes.length} |
		|-----------------|-------------------|

		| metric | current value | value after PR | difference |
		|--------|---------------|----------------|------------|
		${changes
			.map(({ title, diff, aggregate }) => {
				if (aggregate === 'list') {
					const oldValues = `<ol>${diff.diff
						.map((item) => {
							if (item.removed) {
								return `<li><del><code>${item.value}</code></del></li>`
							}
							if (item.added) {
								return `<li></li>`
							}
							return `<li><code>${item.value}</code></li>`
						})
						.join('')}</ol>`
					const newValues = `<ol>${diff.diff
						.map((item) => {
							if (item.added) {
								return `<li><ins><code>${item.value}</code></ins></li>`
							}
							if (item.removed) {
								return `<li></li>`
							}
							return `<li><code>${item.value}</code></li>`
						})
						.join('')}</ol>`
					return `| ${title} | ${oldValues} | ${newValues} | |`
				}

				return `| ${title} | ${formatValue(diff.oldValue)} | ${formatValue(
					diff.newValue
				)} | ${formatDiff(diff.diff.absolute)} (${formatPercentage(
					diff.diff.relative
				)}) |`

				// return `| ${title} | <ol>${diff.diff
				// 	.map((item) => {
				// 		return `<li>${item.removed ? '<del>' : ''}${
				// 			item.added
				// 				? ' '
				// 				: `<code>` +
				// 				  (item.value.property
				// 						? `${item.value.property}: ${item.value.value}`
				// 						: item.value.value || item.value) +
				// 				  `</code>`
				// 		}${item.removed ? '</del>' : ''}</li>`
				// 	})
				// 	.join('')}</ol> | <ol>${diff.diff
				// 	.map((item) => {
				// 		return `<li>${item.added ? '<ins>' : ' '}${
				// 			item.removed
				// 				? ' '
				// 				: `<code>` +
				// 				  (item.value.property
				// 						? `${item.value.property}: ${item.value.value}`
				// 						: item.value.value || item.value) +
				// 				  `</code>`
				// 		}${item.added ? '</ins>' : ''}</li>`
				// 	})
				// 	.join('')}</ol> | N/A |`
			})
			.join('\n')}
		`
		.split('\n')
		.map((line) => line.trim())
		.join('\n')
		.trim()
}
