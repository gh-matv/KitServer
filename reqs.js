
const { Octokit } = require("@octokit/core");
const got = require("got");

const queryer = async (req) => {

    const o = new Octokit({
        auth: "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",
    });

    const x =  await o.request(req, {
        owner: 'gh-matv',
        repo: 'KitWorld',
    })

    return x.data;
}

module.exports = {
    "pulls": async (id) => {
        return await queryer(`GET /repos/{owner}/{repo}/pulls/${id}`)
    },
    "pr_comments": async (pr_id) => {
        return await queryer(`GET /repos/{owner}/{repo}/issues/${pr_id}/comments`)
    },
    "pr_reviews": async (pr_id) => {
        return await queryer(`GET /repos/{owner}/{repo}/pulls n/${pr_id}/comments`)
    },
    "pr_diffs": async (pr_id) => {
        return got(`https://patch-diff.githubusercontent.com/raw/gh-matv/KitWorld/pull/${pr_id}.diff`);
    }
}
