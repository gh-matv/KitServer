
const gh_wh = {
	/**
	 * @param {Express} app
	 */
	register_endpoints: (app) => {

		app.post("/wh/github/", (req, res) => {
			console.log(req.body);
			res.json({});
		})

	}
}

export default gh_wh;
