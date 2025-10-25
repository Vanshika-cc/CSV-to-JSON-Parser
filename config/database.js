const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  process.exit(-1);
});

// Create table if not exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    address JSONB NULL,
    additional_info JSONB NULL
  );
`;

const initializeDatabase = async () => {
  try {
    await pool.query(createTableQuery);
    console.log('Users table ready');
  } catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
};

module.exports = { pool, initializeDatabase };