# CSV to PostgreSQL Converter

A Node.js Express application that parses CSV files with nested properties (dot notation) and stores them in PostgreSQL with age distribution analytics.

---

## Features

- Reads CSV files and converts rows to JSON.
- Inserts data into a PostgreSQL database.
- Handles nested JSON structures for addresses and additional info.
- Provides endpoints to process CSV and check server health.
- Generates age distribution summary for inserted records.

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  

---

## Getting Started

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Vanshika-cc/CSV-to-JSON-Parser
cd csv-to-postgresql
### Setup
```
2. Install dependencies:
```bash
npm install
```

3. Configure PostgreSQL connection:
 ```bash
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'csv_challenge',
  password: 'yourpassword', // replace with your password
  port: 5432,
});
```
4. A utility script is included to generate large test datasets(50,000 in this code):

```bash
node generateCSV.js
```
5. Run the server:
```bash
npm run dev
```
6. Access the endpoints:

- Health check: GET http://localhost:3000/health
- Process CSV: GET http://localhost:3000/process-csv
  
## CSV Format
The CSV has the following columns: name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender
The CSV file contains:
- First line contains column headers
- Nested properties use dot notation (e.g., `name.firstName`, `address.city`)
- Mandatory fields: `name.firstName`, `name.lastName`, `age`

**Example:**
```csv
name.firstName,name.lastName,age,address.line1,address.city,gender
John,Doe,25,123 Main St,New York,Male
```

- Address and additional info will be stored as nested JSON in the database.
  
## Database Schema
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    address JSONB NULL,
    additional_info JSONB NULL
);
```
## Data Mapping

| CSV Column | Database Column |
|------------|----------------|
| `name.firstName` + `name.lastName` | `name` (combined string) |
| `age` | `age` (integer) |
| `address.*` (all address fields) | `address` (JSONB) |
| All other fields | `additional_info` (JSONB) |



## Project Structure
```
csv-parser-challenge/
├── config/
│   └── database.js          # Database configuration
├── services/
│   └── userService.js       # Database operations
├── utils/
│   ├── csvParser.js         # Custom CSV parser
│   └── ageDistribution.js   # Age analytics
├── server.js                # Main application
├── users.csv                # Sample data
├── .env                     # Environment variables
└── package.json             # Dependencies
```
## JSON Output

After processing a CSV file, the data is converted and stored in PostgreSQL as nested JSON. 
### API Response
<img width="410" height="384" alt="Screenshot 2025-10-26 003641" src="https://github.com/user-attachments/assets/d236d1b5-95e1-4eee-a3c5-8d1a5694262b" />
<img width="839" height="846" alt="Screenshot 2025-10-26 014124" src="https://github.com/user-attachments/assets/f8753bd7-f8c0-4ad9-9d01-0f1106038061" />

## Users table in PostgreSQL showing all records with JSONB columns
<img width="1522" height="469" alt="Screenshot 2025-10-26 022958" src="https://github.com/user-attachments/assets/3990be6b-9e0e-4b05-802e-648f48beb1b9" />
<img width="777" height="271" alt="image" src="https://github.com/user-attachments/assets/98b0666f-75c6-47a6-81e4-11bc4315a94c" />
Expanded view of address JSONB object showing nested structure


## Age Distribution Report
<img width="613" height="308" alt="image" src="https://github.com/user-attachments/assets/f9cb1c4c-c374-406e-9fb2-eae3785efa9a" />

Verification the data in PostgreSQL using pgAdmin:
```sql
SELECT 
  CASE 
    WHEN age < 20 THEN '< 20'
    WHEN age >= 20 AND age <= 40 THEN '20 to 40'
    WHEN age > 40 AND age <= 60 THEN '40 to 60'
    ELSE '> 60'
  END as age_group,
  COUNT(*) as count,
  ROUND((COUNT(*)::float / (SELECT COUNT(*) FROM users)) * 100) as percentage
FROM users
GROUP BY age_group
ORDER BY 
  CASE 
    WHEN age < 20 THEN 1
    WHEN age >= 20 AND age <= 40 THEN 2
    WHEN age > 40 AND age <= 60 THEN 3
    ELSE 4
  END;
```

**Query Result:**
<img width="488" height="328" alt="image" src="https://github.com/user-attachments/assets/a3f10229-7d8b-4cff-84fc-c132538042b4" />

## Testing

The application has been tested with:
- 50,000 user records
- Batch processing (1000 records per batch)
- Nested properties with dot notation
- Age distribution analytics

## Assumptions

- CSV files are UTF-8 encoded
- First line always contains headers
- Nested properties of the same object are placed adjacently
- Age values are valid integers

  ## Future Enhancements

- File upload via API
- Data validation middleware
- Multiple CSV file processing
- Export data to JSON/CSV
- Real-time progress tracking
- Unit tests

## Author

Vanshika Chachlani
