
import config from "./config.js";
import express from "express";

import sqlite from "./core/database/db_sqlite.js";
import mongo from "./core/database/db_mongo.js";

import github_request from "./reqs.js";
import github_webhooks from "./webhooks/github_webhooks.js";

async function server() {

    sqlite.Open();
    await mongo.Open()

    const app = express();
    app.use(express.json({}));

    github_webhooks.register_endpoints(app);

    app.get('/', async (req, res) => {
        res.json(await github_request.blame("webserver.js"));
    });
    app.get('/eval', async (req, res) => {
        res.json(await github_request.pulls(12));
    });
    app.get('/evala', async (req, res) => {
        res.json(await github_request.pr_comments(12));
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

}

export default server;
