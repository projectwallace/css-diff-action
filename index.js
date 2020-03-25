const fs = require('fs')
const got = require('got')
const core = require('@actions/core')
const github = require('@actions/github')

try {
	const cssPath = core.getInput('css-path')
	const webhookToken = core.getInput('project-wallace-token')
	const githubToken = core.getInput('github-token')
	const debug = Boolean(core.getInput('debug'))
	const { actor, eventName, payload } = github.context

	const css = fs.readFileSync(cssPath, 'utf8')

	if (debug) {
		console.log(
			JSON.stringify(
				{
					cssPath,
					css,
					eventName,
					payload,
					actor,
				},
				null,
				2
			)
		)
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

		// if (debug) console.log({ hasChanges, changeCount, changes })

		// core.setOutput('hasChanges', hasChanges)
		// core.setOutput('changeCount', changeCount)
		// core.setOutput('changes', changes)

		if (eventName === 'pull_request') {
			const owner = payload.repository.owner.login
			const repo = payload.repository.name
			const issue_number = payload.number
			const body = '```json\n' + JSON.stringify(changes, null, 2) + '\n```'
			if (debug) console.log({ owner, repo, issue_number, body })

			const octokit = new github.GitHub(githubToken)
			octokit.issues
				.createComment({
					owner,
					repo,
					issue_number,
					body,
				})
				.then((result) => console.log({ result }))
		}
	})
} catch (error) {
	if (debug) console.error(error)
	core.setFailed(error.message)
}
