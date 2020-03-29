function formatNumber(number) {
	return Number.isInteger(number)
		? new Intl.NumberFormat().format(number)
		: parseFloat(number).toFixed(3)
}

exports.createCommentMarkdown = ({ changes }) => {
	if (changes.length === 0) {
		return 'No changes in CSS Analytics detected'
	}

	return `
### CSS Analytics changes

| changed metrics | ${changes.length} |
|-----------------|----------------|

| metric | current value | value after PR | difference |
|--------|---------------|----------------|------------|
${changes
	.map((metric) => {
		const { title, diff } = metric
		if (typeof diff.oldValue !== 'undefined') {
			return `| ${title} | ${formatNumber(diff.oldValue)} | ${formatNumber(
				diff.newValue
			)} | ${formatNumber(diff.diff.absolute)} (${
				diff.diff.relative > 0 ? '+' : ''
			}${formatNumber(diff.diff.relative * 100)}%) |`
		}

		return `| ${title} | <ol>${diff.diff
			.map((item) => {
				return `<li>${item.removed ? '<del>' : ''}${
					item.added
						? ' '
						: `<code>` +
						  (item.value.property
								? `${item.value.property}: ${item.value.value}`
								: item.value.value || item.value) +
						  `</code>`
				}${item.removed ? '</del>' : ''}</li>`
			})
			.join('')}</ol> | <ol>${diff.diff
			.map((item) => {
				return `<li>${item.added ? '<ins>' : ' '}${
					item.removed
						? ' '
						: `<code>` +
						  (item.value.property
								? `${item.value.property}: ${item.value.value}`
								: item.value.value || item.value) +
						  `</code>`
				}${item.added ? '</ins>' : ''}</li>`
			})
			.join('')}</ol> | N/A |`
	})
	.join('\n')}
`
}
