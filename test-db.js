const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'csv_challenge',
  user: 'postgres',
  password: 'vanshika123', // hardcoded for testing
});

console.log('Attempting connection...');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
  } else {
    console.log('✅ Connection successful!');
    console.log('Current time from database:', res.rows[0].now);
  }
  pool.end();
});