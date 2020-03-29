exports.createCommentMarkdown = ({ changes: foobar }) => {
	// Setup changes and filter non-changed metrics
	const changes = Object.entries(foobar)
		.filter(([name, metric]) => metric.changed === true)
		.reduce((all, metric) => {
			const [id, changeSet] = metric
			all[id] = changeSet
			return all
		}, {})
	const changeCount = Object.entries(changes).length
	const hasChanges = changeCount > 0

	function formatNumber(number) {
		return Number.isInteger(number)
			? new Intl.NumberFormat().format(number)
			: parseFloat(number).toFixed(3)
	}

	if (!hasChanges) {
		return 'No changes in CSS Analytics detected'
	}

	return `
### CSS Analytics changes

| changed metrics | ${changeCount} |
|-----------------|----------------|

| metric | current value | value after PR | difference |
|--------|---------------|----------------|------------|
${Object.entries(foobar)
	.filter(([id, changeSet]) => typeof changeSet.diff !== 'undefined')
	.map(([id, changeSet]) => {
		if (typeof changeSet.oldValue !== 'undefined') {
			return `| ${id} | ${formatNumber(changeSet.oldValue)} | ${formatNumber(
				changeSet.newValue
			)} | ${formatNumber(changeSet.diff.absolute)} (${
				changeSet.diff.relative > 0 ? '+' : ''
			}${formatNumber(changeSet.diff.relative * 100)}%) |`
		}

		return `| ${id} | <ol>${changeSet.diff
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
			.join('')}</ol> | <ol>${changeSet.diff
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
