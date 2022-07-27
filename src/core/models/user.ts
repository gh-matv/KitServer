import Db_sqlite from "../database/db_sqlite.js";

class User {

	userid: number;
	username: string;

	static async GetOrCreateByName(username) {
		let db_userid = 0;

		Db_sqlite.PrepareAndQuery('select id from "user" where username = ?', username).then((val) => { db_userid = val[0]?.id; });

		if(db_userid == null || db_userid === 0) {
			await Db_sqlite.PrepareAndQuery("insert or ignore into user(username) values(?)", username);
			await Db_sqlite.PrepareAndQuery("select id from user where username = ?", username).then((val) => { db_userid = val[0]?.id; })
		}

		let u = new User();
		u.userid = db_userid;
		u.username = username;

		return u;
	}

}

export default User;
