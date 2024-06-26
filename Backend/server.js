// Import the mysql package
const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ff',
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err.stack);
        return;
    }

    console.log('Connected to MySQL database as id', connection.threadId);

    // Perform database operations here

    // Disconnect from the database when done
    connection.end((err) => {
        if (err) {
            console.error('Error disconnecting from MySQL database:', err.stack);
            return;
        }

        console.log('Disconnected from MySQL database');
    });
});
