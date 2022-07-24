
import sq from "sqlite3";
const { Database } = sq.verbose();

export default class Db
{
	static db = null;

	static Open(location = ":memory:") {
		if(Db.db !== null) return;
		Db.db = new Database(location);
	}

	static Exec(req) {
		Db.db.serialize(() => {
			Db.db.run(req);
		})
	}

	static Query(req) {
		Db.db.serialize(() => {
			Db.db.each(req, (err, row) => {
				console.log(row.id + ": " + row.info);
			});
		})
	}
}

