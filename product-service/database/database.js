const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/products.db');

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL
        )
    `);

    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO products(name, price) VALUES ('Laptop', 3000)`);
            db.run(`INSERT INTO products(name, price) VALUES ('Phone', 1500)`);
        }
    });

});

module.exports = db;