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
	let db_userid = 0;
	let db_actionid = 0;

	// Get user and action ID
	// Here we use Promise.all to parallelize those queries
	await Promise.all([
		Db_sqlite.PrepareAndQuery("select id from action where ref = ?", pr_id).then((val) => db_actionid = val[0]?.id),
		Db_sqlite.PrepareAndQuery("select user.id from user where username = ?", reviewer).then((val) => db_userid = val[0]?.id),
	])

	// If the user does not exist in db, create it
	if(db_userid === undefined) {
		console.log("User does not exist, creating it !");
		await Db_sqlite.PrepareAndQuery("insert into user(username) values(?)", reviewer);
		await Db_sqlite.PrepareAndQuery("select id from user where username = ?", reviewer).then((val) => { db_userid = val[0]?.id; })
	}

	// If the action doesn't exist in db, create it
	if(db_actionid === undefined) {
		console.log("Action does not exist, creating it !");
		await Db_sqlite.PrepareAndQuery("insert into action(descr, ref) values(?,?)", ["pull_request_review_added", pr_id]);
		await Db_sqlite.PrepareAndQuery("select max(id) as id from action", []).then((val) => { db_actionid = val[0]?.id; })
	}

	await Db_sqlite.PrepareAndQuery("insert into user_action(aid, uid) values(?,?)", [db_actionid, db_userid]);

	console.log({db_userid, db_actionid});
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
