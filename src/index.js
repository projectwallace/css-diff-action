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
		const shouldPostPrComment = core.getInput('post-pr-comment') === 'true'
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
			core.setFailed(`Could not retrieve diff from projectwallace.com`)
			throw error
		})
		const { diff } = JSON.parse(response.body)
		console.log(JSON.stringify(diff, null, 2))

		if (!shouldPostPrComment) return

		// POST the actual PR comment
		const formattedBody = createCommentMarkdown({ changes: diff })
		const owner = payload.repository.owner.login
		const repo = payload.repository.name
		const issue_number = payload.number

		const octokit = new github.GitHub(githubToken)
		let wallaceComment

		try {
			const response = await octokit.issues.listComments({
				owner,
				repo,
				issue_number,
			})
			const comments = response.data
			wallaceComment = comments.find(comment => comment.body.toLowerCase().includes('css analytics changes'))

			console.log(JSON.stringify(wallaceComment, null, 2))
		} catch (error) {
			console.error('error fetching PW comment')
			console.error(error)
		}

		if (wallaceComment) {
			await octokit.issues.updateComment({
				owner,
				repo,
				issue_number,
				comment_id: wallaceComment.id,
				body: formattedBody,
			})
				.catch((error) => {
					core.warning(`Error ${error}: Failed to update comment to PR`)
					throw error
				})
		} else {
			await octokit.issues
				.createComment({
					owner,
					repo,
					issue_number,
					body: formattedBody,
				})
				.catch((error) => {
					core.warning(`Error ${error}: Failed to post comment to PR`)
					throw error
				})
		}
	} catch (error) {
		core.setFailed(error.message)
	}
}

run()
