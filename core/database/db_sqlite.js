
import sq from "sqlite3";
import config from "../../config.js";
const { Database } = sq.verbose();

export default class Db_sqlite
{
	static db = null;

	static Open() {
		if(Db_sqlite.db !== null) return;
		Db_sqlite.db = new Database(config.database.sqlite_filename);
		console.log("[Success] Connected to sqlite database");
	}

	static Exec(req) {
		Db_sqlite.db.serialize(() => {
			Db_sqlite.db.run(req);
		})
	}

	static Query(req) {
		Db_sqlite.db.serialize(() => {
			Db_sqlite.db.each(req, (err, row) => {
				console.log(row.id + ": " + row.info);
			});
		})
	}
}

