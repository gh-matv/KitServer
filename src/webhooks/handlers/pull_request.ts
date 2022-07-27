import User from "../../core/models/user.js";
import Action from "../../core/models/action.js";

function on_create_pr(_data) {
	console.log("on_create_pr");
	return true;
}

function on_pr_changes(_data) {
	console.log("on_pr_changes");
	return true;
}

async function on_pr_review_added(data) {

	const reviewer = data.review.user.login;
	const pr_id = data.pull_request.number;

	const db_user = await User.GetOrCreateByName(reviewer)
	await Action.CreateAction(pr_id, "pull_request_review", db_user);

	console.log(`User ${db_user.username} added a review to PR ${pr_id}`);
}

export default function handle(event, data) {

	if(["create", "pull_request", "issue_comment", "pull_request_review"].indexOf(event) === -1) {
		return;
	}

	switch(event)
	{
		case "create": // A new PR has been created right now
			return on_create_pr(data);

		case "pull_request": // Something happens to an existing PR
			return on_pr_changes(data);

		case "pull_request_review":
			return on_pr_review_added(data);

		default:
			throw `pull_request.js > Event ${event} not handled !`;

	}

}
