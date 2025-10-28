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

## Users table in PostgreSQL showing all records with JSONB columns
<img width="1522" height="469" alt="Screenshot 2025-10-26 022958" src="https://github.com/user-attachments/assets/3990be6b-9e0e-4b05-802e-648f48beb1b9" />


## Age Distribution Report
<img width="613" height="308" alt="image" src="https://github.com/user-attachments/assets/f9cb1c4c-c374-406e-9fb2-eae3785efa9a" />

