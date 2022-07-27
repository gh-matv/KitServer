
// Initialize databases

import sq from "sqlite3";
import config from "./config.js"

const { Database } = sq.verbose();
const db = new Database(config.database.sqlite_filename);

db.serialize(() => {

	// Create the table that will store all users
	db.run(`

		CREATE TABLE IF NOT EXISTS user (
		   id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		   username text NOT NULL,
		   CONSTRAINT user_username UNIQUE (username)
		);		
	`);

	// Create the table that stores the actions on the git server
	db.run(`
	
		CREATE TABLE IF NOT EXISTS action (
			id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			"uid" INTEGER NOT NULL,
			time TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
			descr TEXT NOT NULL DEFAULT "",
			ref INTEGER NOT NULL,
			CONSTRAINT UN_action_unique UNIQUE("uid",descr,ref),
			CONSTRAINT FK_user_action FOREIGN KEY ("uid") REFERENCES user(id)
		)
	
	`);
});

db.close();
