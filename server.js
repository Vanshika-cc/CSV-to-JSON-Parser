const express = require('express');
require('dotenv').config();

const { initializeDatabase } = require('./config/database');
const { parseCSV } = require('./utils/csvParser');
const { insertUsers, clearUsers } = require('./services/userService');
const { calculateAgeDistribution } = require('./utils/ageDistribution');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

/**
 * Health check endpoint
 */
app.get('/', (req, res) => {
  res.json({
    message: 'CSV to JSON Parser API',
    endpoints: {
      'GET /': 'API information',
      'GET /process-csv': 'Process CSV and upload to database',
      'GET /health': 'Health check',
    },
  });
});

/**
 * Main endpoint to process CSV
 */
app.get('/process-csv', async (req, res) => {
  try {
    console.log('\n Starting CSV processing...\n');

    const csvFilePath = process.env.CSV_FILE_PATH;

    // Step 1: Parse CSV
    console.log('Reading CSV file...');
    const users = await parseCSV(csvFilePath);
    console.log(`Parsed ${users.length} records\n`);

    // Step 2: Clear existing data
    console.log('Clearing existing data...');
    await clearUsers();
    console.log('');

    // Step 3: Insert into database
    console.log('Inserting users into database...');
    const insertedCount = await insertUsers(users);
    console.log('');

    // Step 4: Calculate age distribution
    console.log('Calculating age distribution...');
    const ageDistribution = await calculateAgeDistribution();

    res.json({
      success: true,
      message: 'CSV processed successfully',
      data: {
        totalRecords: users.length,
        insertedRecords: insertedCount,
        ageDistribution: ageDistribution,
      },
    });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * Start server
 */
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log(` Server running on http://localhost:${PORT}`);
      console.log('='.repeat(50));
      console.log('Available endpoints:');
      console.log(`  GET  http://localhost:${PORT}/`);
      console.log(`  GET  http://localhost:${PORT}/process-csv`);
      console.log(`  GET  http://localhost:${PORT}/health`);
      console.log('='.repeat(50) + '\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();