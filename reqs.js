
import Octokit from "@octokit/core";
import fetch from "node-fetch";

const OWNER = 'gh-matv';
const REPO = 'KitServer';

const queryer = async (req) => {

    const o = new Octokit({
        auth: process.env.GH_PRIVATE_TOKEN,
    });

    const x =  await o.request(req, {
        owner: OWNER,
        repo: REPO,
    })

    return x.data;
}

const x = {
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
        const token = process.env.GH_PRIVATE_TOKEN;
        // https://2fd.github.io/graphdoc/github/gitactor.doc.html
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
                              user {
                                login
                              }
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

export default x;
