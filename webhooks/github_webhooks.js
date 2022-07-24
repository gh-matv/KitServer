
import pull_request_handler from "./handlers/pull_request.js"

const github_webhooks = {
	/**
	 * @param {Express} app
	 */
	register_endpoints: async (app) => {

		console.log("registering webhook endpoints");

		app.get("/wh/github", (_req, res) => { res.send("Only POST on this EP"); });
		app.post("/wh/github", async (req, res) => {

			const event = req.headers["x-github-event"]; // ["push", "create", "pull_request", "issue_comment", "pull_request_review", ... ]
			const body = req.body;

			pull_request_handler(event, body);
			// TODO : add all other handlers here

			res.send("OK");
		});

	}
}

export default github_webhooks;
