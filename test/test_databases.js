
import Db_mongo from "../src/core/database/db_mongo.js";
import Db_sqlite from "../src/core/database/db_sqlite.js";

// TODO : https://dev.to/oliverjumpertz/building-a-project-with-typescript-express-mocha-and-chai-13fc

describe('Connection to databases', function () {

    it("should connect to mongo", () => {
        return Db_mongo.Open();
    })

    it("should connect to sqlite", async () => {
        return Db_sqlite.Open();
    })

});
