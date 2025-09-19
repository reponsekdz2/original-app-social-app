import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'talka',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true // Keep dates as strings to avoid timezone issues
});

pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to the MySQL database.');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to MySQL database: ', err);
  });


export default pool;
