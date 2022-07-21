
const { Octokit } = require("@octokit/core");

const OWNER = 'gh-matv';
const REPO = 'KitWorld';

const queryer = async (req) => {

    const o = new Octokit({
        auth: process.env.GITHUB_PRIVATE_TOKEN,
    });

    const x =  await o.request(req, {
        owner: OWNER,
        repo: REPO,
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
    "blame": async (file, expression="master") => {
        const token = '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';
        const query = `
            query {
              repositoryOwner(login: "${OWNER}") {
                repository(name: "${REPO}") {
                  object(expression: "${expression}") {
                    ... on Commit {
                      blame(path: "${file}") {
                        ranges {
                          startingLine
                          endingLine
                          age
                          commit {
                            oid
                            author {
                              name
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
        `;
        const result = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + token
            },
            body: JSON.stringify({ query: query })
        });

        return await result.json()
    }
}
