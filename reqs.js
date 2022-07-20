
const { Octokit } = require("@octokit/core");

const queryer = async (req) => {

    const o = new Octokit({
        auth: process.env.GITHUB_PRIVATE_TOKEN,
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
}
