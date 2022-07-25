
import {MongoClient} from "mongodb";
import config from "../../config.js";

export default class Db_mongo
{
	static db = null;

	static async Open() {
		Db_mongo.db = new MongoClient(config.database.mongo.connection_string);
		await (async () => {
			await Db_mongo.db.connect();
			await Db_mongo.db.db(config.database.mongo.dbname).command({ping: 1});
			console.log("[Success] Connected to mongo database");
		})();
	}

}
