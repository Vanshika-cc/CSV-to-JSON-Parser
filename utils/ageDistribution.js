const { pool } = require('../config/database');


async function calculateAgeDistribution() {
  try {
    const query = `
      WITH age_groups AS (
        SELECT 
          CASE 
            WHEN age < 20 THEN '< 20'
            WHEN age >= 20 AND age <= 40 THEN '20 to 40'
            WHEN age > 40 AND age <= 60 THEN '40 to 60'
            ELSE '> 60'
          END as age_group
        FROM users
      )
      SELECT 
        age_group,
        COUNT(*) as count
      FROM age_groups
      GROUP BY age_group
      ORDER BY 
        CASE age_group
          WHEN '< 20' THEN 1
          WHEN '20 to 40' THEN 2
          WHEN '40 to 60' THEN 3
          ELSE 4
        END
    `;

    const result = await pool.query(query);
    
    // Get total count
    const totalQuery = 'SELECT COUNT(*) as total FROM users';
    const totalResult = await pool.query(totalQuery);
    const total = parseInt(totalResult.rows[0].total);

    console.log('\n' + '='.repeat(50));
    console.log('AGE DISTRIBUTION REPORT');
    console.log('='.repeat(50));
    console.log('Age-Group\t\t% Distribution');
    console.log('-'.repeat(50));

    result.rows.forEach((row) => {
      const percentage = ((row.count / total) * 100).toFixed(2);
      console.log(`${row.age_group}\t\t\t${percentage}%`);
    });

    console.log('='.repeat(50));
    console.log(`Total Users: ${total}\n`);

    return result.rows;
  } catch (error) {
    console.error('Error calculating age distribution:', error);
    throw error;
  }
}

module.exports = { calculateAgeDistribution };