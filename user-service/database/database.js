const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/users.db');

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )
    `);

    db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO users(name) VALUES ('Hachem')`);
            db.run(`INSERT INTO users(name) VALUES ('Ali')`);
        }
    });

});

module.exports = db;