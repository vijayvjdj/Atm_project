const mysql = require('mysql2');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'vjdjvijay@143',
    database: 'atm_db'
});

let balance = 0;
const correctPin = '3585';

function verifyPin(callback) {
    rl.question('Enter your PIN: ', (enteredPin) => {
        const query = 'SELECT balance FROM accounts WHERE pin = ?';
        db.query(query, [enteredPin], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                balance = results[0].balance;
                callback(true);
            } else {
                console.log('Invalid PIN.');
                callback(false);
            }
        });
    });
}

function updateBalanceInDatabase(callback) {
    const query = 'UPDATE accounts SET balance = ? WHERE pin = ?';
    db.query(query, [balance, correctPin], (err) => {
        if (err) throw err;
        callback();
    });
}

function deposit() {
    rl.question('Enter amount to deposit: ', (amount) => {
        amount = parseFloat(amount);
        if (amount > 0) {
            balance += amount;
            updateBalanceInDatabase(() => {
                console.log(`Successfully deposited: $${amount}`);
                atmMenu();
            });
        } else {
            console.log('Deposit amount must be positive.');
            atmMenu();
        }
    });
}

function withdraw() {
    rl.question('Enter amount to withdraw: ', (amount) => {
        amount = parseFloat(amount);
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            updateBalanceInDatabase(() => {
                console.log(`Successfully withdrew: $${amount}`);
                atmMenu();
            });
        } else if (amount > balance) {
            console.log('Insufficient balance.');
            atmMenu();
        } else {
            console.log('Withdrawal amount must be positive.');
            atmMenu();
        }
    });
}
function updateMobileNumber(pin, newMobileNumber) {
    rl.question('Enter your number: ', (newMobileNumber) => {
    const query = 'UPDATE accounts SET mobile_number = ?';
    
    db.query(query, [newMobileNumber], (err, results) => {
        if (err) {
            console.error('Error updating mobile number:', err.message);
        } else if(results.affectedRows > 0) {
            console.log('Mobile number updated successfully.');
        }
    });
});
}

function atmMenu() {
    console.log('\nATM Machine Menu:');
    console.log('1. Deposit Money');
    console.log('2. Withdraw Money');
    console.log('3. updateMobilenumber');
    console.log('4. Exit');
    rl.question('Select an option: ', (choice) => {
        switch (choice) {
            case '1':
                deposit();
                break;
            case '2':
                withdraw();
                break;
            case '3' :
                updateMobileNumber();
                break;
            case '4':
                console.log('Thank you for using the ATM. Goodbye!');
                rl.close();
                db.end();
                break;
            default:
                console.log('Invalid option. Please try again.');
                atmMenu();
        }
    });
}

function startATM() {
    db.connect((err) => {
        if (err) throw err;
        console.log('Connected to the database.');
        verifyPin((isVerified) => {
            if (isVerified) {
                atmMenu();
            } else {
                console.log('Incorrect PIN. Access denied.');
                rl.close();
                db.end();
            }
        });
    });
}

startATM();