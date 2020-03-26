const fs = require('fs')
const got = require('got')
const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
	try {
		const cssPath = core.getInput('css-path')
		const webhookToken = core.getInput('project-wallace-token')
		const githubToken = core.getInput('github-token')
		const debug = Boolean(core.getInput('debug'))
		const { actor, eventName, payload } = github.context

		if (!eventName === 'pull_request') {
			if (debug) console.log('Event is not a Pull Request; Exiting.')
			return
		}

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

		core.setGroup('calculate changes')
		const response = await got(
			`https://www.projectwallace.com/webhooks/v1/imports/preview?token=${webhookToken}`,
			{
				method: 'post',
				headers: {
					'Content-Type': 'text/css',
					Accept: 'application/json',
				},
				body: css,
			}
		)
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

		if (debug)
			console.log(JSON.stringify({ hasChanges, changeCount, changes }, null, 2))
		core.endGroup()

		core.setGroup('create PR comment')
		const owner = payload.repository.owner.login
		const repo = payload.repository.name
		const issue_number = payload.number
		if (debug) console.log({ owner, repo, issue_number })

		let formattedBody = 'No changes in CSS Analytics detected'

		function formatNumber(number) {
			return Number.isInteger(number)
				? new Intl.NumberFormat().format(number)
				: parseFloat(number).toFixed(3)
		}

		if (changeCount > 0) {
			formattedBody = `
### CSS Analytics changes

| changed metrics | ${changeCount} |
|-----------------|----------------|

| metric | current value | value after PR | difference |
|--------|---------------|----------------|------------|
${Object.entries(changes)
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

		const octokit = new github.GitHub(githubToken)
		await octokit.issues.createComment({
			owner,
			repo,
			issue_number,
			body: formattedBody,
		})
		core.endGroup()
	} catch (error) {
		if (debug) console.error(error)
		core.setFailed(error.message)
	}
}

run()
