import User from "./user.js";
import Db_sqlite from "../database/db_sqlite.js";

class Action {

	actionid: number;

	static async CreateAction(ref: number, name: string, user: User) {

		let db_actionid;

		await Db_sqlite.PrepareAndQuery("insert or ignore into action(descr, ref, uid) values(?,?,?)", [name, ref, user.userid]);
		await Db_sqlite.PrepareAndQuery("select max(id) as id from action where uid=?", user.userid).then((val) => { db_actionid = val[0]?.id; })

		const action = new Action();
		action.actionid = db_actionid;

		return action;

	}

}

export default Action;
