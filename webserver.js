
import config from "./config.js";
import express from "express";
import session from "express-session";

import sqlite from "./core/database/db_sqlite.js";
import mongo from "./core/database/db_mongo.js";

import github_request from "./reqs.js";
import github_webhooks from "./webhooks/github_webhooks.js";

sqlite.Open();
await mongo.Open()

const app = express();
app.use(express.json({}));
app.use(session({
	secret: process.env.SESSION_TOKEN_KEY,
	resave: true,
	cookie: { maxAge: 3000 },
	saveUninitialized: false
}));

github_webhooks.register_endpoints(app);

app.get('/', async (req, res) => {

	if (!req.session.views) req.session.views = 0;
	++req.session.views;

	res.json(await github_request.blame("webserver.js"));
});
app.get('/eval', async (req, res) => {
	res.json(await github_request.pulls(12));
});
app.get('/evala', async (req, res) => {
	res.json(await github_request.pr_comments(12));
});
app.get('/view/:username', async (req, res) => {
	let userInfos = await db.db("Kit").collection("User").findOne({username: req.params.username});

	let score = 1000;
	for (const historyElement of userInfos.history) {
		if (historyElement.type.startsWith("pr")) {
			let data = await db.db("Kit").collection("PullRequests").findOne({number: historyElement.ref});
			if (!data.merged) continue;

			// Score change applied immediately when the commit is merged
			score += data.comments * config.score.pull_request.score_per_comment;
			score += data.review_comments * config.score.pull_request.score_per_review_comment;
			score += data.additions * config.score.commit.score_per_addition;
			score += data.deletions * config.score.commit.score_per_deletion;
			score += data.changed_files * config.score.commit.score_per_changed_file;
		}
	}
	userInfos.score = score;

	res.json(userInfos || {});
});
app.get('/onprchange/:pullreqid', async (req, res) => {

	const pr_id = parseInt(req.params?.pullreqid) || 0;
	const prinfos = await github_request.pulls(pr_id);

	const initiator = prinfos.user.login;
	const merged_by = prinfos.merged_by?.login;

	const has_been_merged = prinfos.merged;
	// const merged_automatically = prinfos.auto_merge||false;

	const comment_count = prinfos.comments; // issues/12/comments
	const comments = comment_count > 0 ? await github_request.pr_comments(pr_id) : [];

	const review_count = prinfos.review_comments;    // pulls/12/comments
	const reviews = review_count > 0 ? await github_request.pr_reviews(pr_id) : [];

	res.json({
		initiator,
		merged_by,
		has_been_merged,
		comments, // This is fixed
		reviews
	});
});

// Nothing else matched, 404 ?
app.get('*', (req, res) => {
	res.send(404);
});

app.listen(config.server.listen_port);
console.log(`Express server listening on port ${config.server.listen_port}`);
