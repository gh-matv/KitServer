
// Initialize databases

import sq from "sqlite3";
const { Database } = sq.verbose();
const db = new Database('sqlite.db');

db.serialize(() => {

	// Create the table that will store all users
	db.run(`

		CREATE TABLE IF NOT EXISTS user (
		   id INTEGER PRIMARY KEY AUTOINCREMENT,
		   first_name text NOT NULL,
		   last_name text NOT NULL
		);		
	`);

	// Create the table that stores the actions on the git server
	db.run(`
	
		CREATE TABLE IF NOT EXISTS action (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			time TEXT DEFAULT CURRENT_TIMESTAMP,
			descr TEXT DEFAULT ""
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

	/*const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
	for (let i = 0; i < 10; i++) {
		stmt.run("Ipsum " + i);
	}
	stmt.finalize();

	db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
		console.log(row.id + ": " + row.info);
	});*/
});

debugger;

db.close();