const fs = require('fs')
const got = require('got')
const core = require('@actions/core')
const github = require('@actions/github')

try {
	const cssPath = core.getInput('css-path')
	const webhookToken = core.getInput('project-wallace-token')
	const githubToken = core.getInput('github-token')
	const debug = Boolean(core.getInput('debug'))
	const payload = github.context.payload

	if (debug) {
		console.log(
			JSON.stringify(
				{
					cssPath,
					payload,
				},
				null,
				2
			)
		)
	}

	const css = fs.readFileSync(cssPath, 'utf8')
	const event = fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')

	if (debug) {
		console.log('Event Name: ' + process.env.GITHUB_EVENT_NAME)
		console.log({ event })
		console.log({ css })
	}

	got(
		`https://www.projectwallace.com/webhooks/v1/imports/preview?token=${webhookToken}`,
		{
			method: 'post',
			headers: {
				'Content-Type': 'text/css',
				Accept: 'application/json',
			},
			body: css,
		}
	).then((response) => {
		const { diff } = JSON.parse(response.body)

		const hasChanges = Object.values(diff).some((metric) => metric.changed)
		const changes = Object.entries(diff)
			.filter(([name, metric]) => metric.changed === true)
			.reduce((all, metric) => {
				const [id, changeSet] = metric
				all[id] = changeSet
				return all
			}, {})
		const changeCount = Object.entries(changes).length

		if (debug) {
			console.log({
				hasChanges,
				changeCount,
				changes,
			})
		}

		core.setOutput('hasChanges', hasChanges)
		core.setOutput('changeCount', changeCount)
		core.setOutput('changes', changes)
	})
} catch (error) {
	if (debug) {
		console.error(error)
	}
	core.setFailed(error.message)
}
