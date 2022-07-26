
// Initialize databases

import sq from "sqlite3";
import config from "./config.js"

const { Database } = sq.verbose();
const db = new Database(config.database.sqlite_filename);

db.serialize(() => {

	// Create the table that will store all users
	db.run(`

		CREATE TABLE IF NOT EXISTS user (
		   id INTEGER PRIMARY KEY AUTOINCREMENT,
		   username text NOT NULL
		);		
	`);

	// Create the table that stores the actions on the git server
	db.run(`
	
		CREATE TABLE IF NOT EXISTS action (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			time TEXT DEFAULT CURRENT_TIMESTAMP,
			descr TEXT DEFAULT "",
			ref INTEGER NOT NULL
		)
	
	`)

	// Table used to make an N-N relationship between user and action
	db.run(`
	
		CREATE TABLE IF NOT EXISTS user_action (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			aid INTEGER NOT NULL,
			uid INTEGER NOT NULL,
			CONSTRAINT FK_useraction_user FOREIGN KEY (uid) REFERENCES user(id),
			CONSTRAINT FK_useraction_action FOREIGN KEY (aid) REFERENCES action(id)
		)
	
	`)
});

debugger;

db.close();
