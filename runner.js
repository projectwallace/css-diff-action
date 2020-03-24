const fs = require('fs')
const got = require('got')

const css = fs.readFileSync('style.css', 'utf8');

if (!process.env.PROJECT_WALLACE_TOKEN) {
	console.error('Error: Missing PROJECT_WALLACE_TOKEN')
	process.exit(1)
}

got(`https://www.projectwallace.com/webhooks/v1/imports/preview?token=${process.env.PROJECT_WALLACE_TOKEN}`, {
	method: 'post',
	headers: {
		'Content-Type': 'text/css',
		Accept: 'application/json'
	},
	body: css
}).then(response => {
	const {diff} = JSON.parse(response.body)

	const hasChanges = Object.values(diff).some(metric => metric.changed)
	const changes = Object.entries(diff)
		.filter(([name, metric]) => metric.changed === true)
		.reduce((all, metric) => {
			all[metric[0]] = metric[1]
			return all
		}, {})
	const changeCount = changes.length

	console.log({
		hasChanges,
		changeCount,
		changes
	})
}).catch(error => {
	console.error(error)
})