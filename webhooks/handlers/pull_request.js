
function on_create_pr(data) {
	console.log("on_create_pr");
	return true;
}

function on_pr_changes(data) {
	console.log("on_pr_changes");
	return true;
}

export default function handle(event, data) {

	if(["create", "pull_request", "issue_comment", "pull_request_review"].indexOf(event) === -1)
	{
		// If it's not a handled value, return success
		return true;
	}

	switch(event)
	{
		case "create": // A new PR has been created right now
			return on_create_pr(data);

		case "pull_request": // Something happens to an existing PR
			return on_pr_changes(data);

		default:
			throw `pull_request.js > Event ${event} not handled !`;

	}

}
