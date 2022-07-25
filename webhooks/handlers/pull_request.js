import Db_sqlite from "../../core/database/db_sqlite.js";

function on_create_pr(_data) {
	console.log("on_create_pr");
	return true;
}

function on_pr_changes(_data) {
	console.log("on_pr_changes");
	return true;
}

async function on_pr_review_added(data) {
	console.log("on_pr_review_added");

	const reviewer = data.review.user.login;
	const pr_id = data.pull_request.number;

	const res = await Db_sqlite.PrepareAndQuery(`
		select user.username
		from user
		left join user_action on user_action.uid = user.id
		left join action on action.id = user_action.aid
		where user.username = ? and action.id = ?
		`, [reviewer, pr_id]);

	console.log(res);
	return true;
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
