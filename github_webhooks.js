

const github_webhooks = {
	/**
	 * @param {Express} app
	 */
	register_endpoints: async (app) => {

		console.log("registering webhook endpoints");

		app.get("/wh/github", (_req, res) => { res.send("Only POST on this EP"); });
		app.post("/wh/github", async (req, res) => {

			const event = req.headers["x-github-event"]; // ["push", "pull_request", ]

			console.log(req.body);
			console.log(event);

			res.send("done");
		});

	}
}

export default github_webhooks;
