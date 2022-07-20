
const express = require('express');
const session = require("express-session");
const { MongoClient } = require("mongodb");

const c = require('./config');

// Initialization of the database
const db = new MongoClient("mongodb://localhost:27017");
(async () => {
	await db.connect();
	await db.db("Kit").command({ping:1});
	console.log("Connected to mongo database");
})();

// Initialize callbacks
const qq = require('./reqs');

// Start express server
const app = express();

app.use(session({
	secret: 'keyboard cat',
	resave: true,
	cookie: { maxAge: 3000 },
	saveUninitialized: false,
}))

app.get('/', (req, res) => {

	if(!req.session.views) req.session.views = 0;
	++req.session.views;

	res.json(req.session);
})

app.get('/eval', async (req, res) => {
	res.json(await qq.pulls(12));
});

app.get('/evala', async (req, res) => {
	res.json(await qq.pr_comments(12))
});

app.get('/view/:username', async (req, res) => {
	let userInfos = await db.db("Kit").collection("User").findOne({ username: req.params.username});

	let score = 1000;
	for (const historyElement of userInfos.history)
	{
		if(historyElement.type.startsWith("pr"))
		{
			let data = await db.db("Kit").collection("PullRequests").findOne({ number: historyElement.ref});
			if(!data.merged) continue;

			// Score change applied immediately when the commit is merged
			score += data.comments * c.constants.pull_request.score_per_comment;
			score += data.review_comments * c.constants.pull_request.score_per_review_comment;
			score += data.additions * c.constants.commit.score_per_addition;
			score += data.deletions * c.constants.commit.score_per_deletion;
			score += data.changed_files * c.constants.commit.score_per_changed_file;
		}
	}
	userInfos.score = score;

	res.json(userInfos||{});
})

app.get('/onprchange/:pullreqid', async (req, res) => {

	const pr_id = req.params.pullreqid;
	const prinfos = await qq.pulls(pr_id);

	const initiator = prinfos.user.login;
	const merged_by = prinfos.merged_by?.login;

	const has_been_merged = prinfos.merged;
	const merged_automatically = prinfos.auto_merge||false;

	const comment_count = prinfos.comments; // issues/12/comments
	const comments = comment_count > 0 ? await qq.pr_comments(pr_id) : [];

	const review_count = prinfos.review_comments;    // pulls/12/comments
	const reviews = review_count > 0 ? await qq.pr_reviews(pr_id) : [];

	res.json({
		initiator,
		merged_by,
		has_been_merged,
		comments,
		reviews
	});
})

// Nothing else matched, 404 ?
app.get('*', (req, res) => {
	res.send(404);
})

app.listen(3000);
console.log("Express server listening on port 3000");

