const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'vjdjvijay@143'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL server.');

    db.query('CREATE DATABASE IF NOT EXISTS atm_db', (err) => {
        if (err) throw err;
        console.log('Database "atm_db" created or already exists.');

        const dbWithDatabase = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'vjdjvijay@143',
            database: 'atm_db'
        });

        dbWithDatabase.connect((err) => {
            if (err) throw err;

            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS accounts (
                    pin VARCHAR(4) NOT NULL,
                    balance DOUBLE DEFAULT 0.0
                )
            `;

            dbWithDatabase.query(createTableQuery, (err) => {
                if (err) throw err;
                console.log('Table "accounts" created or already exists.');

                const insertAccountQuery = `
                    INSERT INTO accounts (pin, balance) VALUES ('3585', 0.0)
                    ON DUPLICATE KEY UPDATE balance = balance
                `;

                dbWithDatabase.query(insertAccountQuery, (err) => {
                    if (err) throw err;
                    console.log('Test account created or already exists.');

                    dbWithDatabase.end();
                    db.end();
                });
            });
        });
    });
});

