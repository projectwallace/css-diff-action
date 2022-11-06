const fs = require('fs')
const got = require('got')
const core = require('@actions/core')
const github = require('@actions/github')
const Sentry = require("@sentry/node")
const { createCommentMarkdown } = require('./create-comment')

Sentry.init({
	dsn: "https://5f217579acd24d33af01995ed625d981@o50610.ingest.sentry.io/4504022978199552",
});

async function run() {
	try {
		const cssPath = core.getInput('css-path')
		const webhookToken = core.getInput('project-wallace-token')
		const githubToken = core.getInput('github-token')
		const shouldPostPrComment = core.getInput('post-pr-comment') === 'true'
		const { eventName, payload } = github.context

		if (eventName !== 'pull_request') return
		if (!shouldPostPrComment) return

		// Read CSS file
		const css = fs.readFileSync(cssPath, 'utf8')

		const redactedToken = '*'.padStart(16, '*') + webhookToken.slice(16)

		// POST CSS to projectwallace.com to get the diff
		const response = await got(
			`https://www.projectwallace.com/webhooks/v3/imports/preview?token=${webhookToken}`,
			{
				method: 'post',
				headers: {
					'Content-Type': 'text/css',
					Accept: 'application/json',
				},
				body: css,
			}
		).catch((error) => {
			Sentry.captureException(error, {
				tags: {
					step: 'fetching diff',
					token: redactedToken,
				}
			})
			core.setFailed(`Could not retrieve diff from projectwallace.com`)
			throw error
		})

		let diff

		try {
			const parsed = JSON.parse(response.body)
			diff = parsed.diff
		} catch (error) {
			Sentry.captureException(error, {
				tags: {
					step: 'parsing diff',
					token: redactedToken,
				}
			})
			console.error('Cannot parse JSON response from projectwallace.com')
			core.setFailed(error.message)
		}

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
			wallaceComment = comments.find(comment => comment.body.toLowerCase().includes('css analytics changes') || comment.body.includes('No changes in CSS Analytics detected'))
		} catch (error) {
			Sentry.captureException(error, {
				tags: {
					step: 'fetching comment',
					owner,
					repo,
					issue_number,
				}
			})
			console.error('error fetching PW comment')
			console.error(error)
		}

		if (wallaceComment) {
			console.log(`Updating comment ID ${wallaceComment.id}`)
			await octokit.issues.updateComment({
				owner,
				repo,
				issue_number,
				comment_id: wallaceComment.id,
				body: formattedBody,
			})
				.catch((error) => {
					Sentry.captureException(error, {
						tags: {
							step: 'updating comment',
							owner,
							repo,
							issue_number,
						}
					})
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
					Sentry.captureException(error, {
						tags: {
							step: 'posting comment',
							owner,
							repo,
							issue_number,
						}
					})
					core.warning(`Error ${error}: Failed to post new comment to PR`)
					throw error
				})
		}
	} catch (error) {
		Sentry.captureException(error, {
			tags: {
				step: 'general error'
			}
		})
		core.setFailed(error.message)
	}
}

run()
