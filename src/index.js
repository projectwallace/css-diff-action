const fs = require('fs')
const got = require('got')
const core = require('@actions/core')
const github = require('@actions/github')
const { createCommentMarkdown } = require('./create-comment')

async function run() {
	try {
		const cssPath = core.getInput('css-path')
		const webhookToken = core.getInput('project-wallace-token')
		const githubToken = core.getInput('github-token')
		const { eventName, payload } = github.context

		if (eventName !== 'pull_request') {
			return
		}

		// Read CSS file
		const css = fs.readFileSync(cssPath, 'utf8')

		// POST CSS to projectwallace.com to get the diff
		const response = await got(
			`https://www.projectwallace.com/webhooks/v2/imports/preview?token=${webhookToken}`,
			{
				method: 'post',
				headers: {
					'Content-Type': 'text/css',
					Accept: 'application/json',
				},
				body: css,
			}
		).catch((error) => {
			throw error
		})
		const { diff } = JSON.parse(response.body)

		// POST the actual PR comment
		const formattedBody = createCommentMarkdown({ changes: diff })
		const owner = payload.repository.owner.login
		const repo = payload.repository.name
		const issue_number = payload.number

		const octokit = new github.GitHub(githubToken)
		await octokit.issues
			.createComment({
				owner,
				repo,
				issue_number,
				body: formattedBody,
			})
			.catch((error) => {
				throw error
			})
	} catch (error) {
		core.setFailed(error.message)
	}
}

run()
