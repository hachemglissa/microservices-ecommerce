const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/orders.db');

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            productId INTEGER,
            status TEXT
        )
    `);

});

module.exports = db;