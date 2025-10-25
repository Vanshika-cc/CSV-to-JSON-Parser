const { pool } = require('../config/database');

/**
 * Insert users into database in batches
 */
async function insertUsers(users) {
  const BATCH_SIZE = 1000;
  let insertedCount = 0;

  try {
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      
      // Build batch insert query
      const values = [];
      const placeholders = [];
      
      batch.forEach((user, index) => {
        const offset = index * 4;
        placeholders.push(
          `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`
        );

        // Combine firstName + lastName
        const fullName = `${user.name.firstName} ${user.name.lastName}`;
        
        // Extract address
        const address = user.address || null;
        
        // Everything else goes to additional_info
        const additionalInfo = {};
        Object.keys(user).forEach((key) => {
          if (key !== 'name' && key !== 'age' && key !== 'address') {
            additionalInfo[key] = user[key];
          }
        });

        values.push(
          fullName,
          user.age,
          address ? JSON.stringify(address) : null,
          Object.keys(additionalInfo).length > 0 ? JSON.stringify(additionalInfo) : null
        );
      });

      const query = `
        INSERT INTO users (name, age, address, additional_info)
        VALUES ${placeholders.join(', ')}
      `;

      await pool.query(query, values);
      insertedCount += batch.length;
      console.log(`Inserted ${insertedCount}/${users.length} users`);
    }

    return insertedCount;
  } catch (error) {
    console.error('Error inserting users:', error);
    throw error;
  }
}

/**
 * Clear all users from database
 */
async function clearUsers() {
  try {
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY');
  } catch (error) {
    console.error('Error clearing users:', error);
    throw error;
  }
}

/**
 * Get all users from database
 */
async function getAllUsers() {
  try {
    const result = await pool.query(
      'SELECT id, name, age, address, additional_info FROM users ORDER BY id'
    );
    console.log(`Fetched ${result.rows.length} users from database`);
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

module.exports = { 
  insertUsers, 
  clearUsers,
  getAllUsers  // Added this export
};