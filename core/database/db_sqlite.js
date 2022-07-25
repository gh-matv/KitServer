
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

	static Query(req, each = (err, {id, info}) => {}) {
		Db_sqlite.db.serialize(() => {
			Db_sqlite.db.each(req, (err, row) => {
				// console.log(row.id + ": " + row.info);
				each(err, {id: row.id, info: row.info});
			});
		})
	}

	static PrepareAndQuery(req, param_or_params) {
		const stmt = Db_sqlite.db.prepare(req);

		return new Promise(resolve => {
			const row = stmt.all(param_or_params, (err, row) => {
				if(err !== null) throw err;
				resolve(row);
			});
		})
	}
}

