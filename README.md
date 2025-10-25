# CSV to PostgreSQL Converter

A simple Node.js application that reads CSV files, converts them to JSON, and stores the data in a PostgreSQL database. Designed for easy data processing and analysis.

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
- **CSV Parsing:** csv-parser  
- **DB Connection:** pg (Node.js PostgreSQL client)

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)  
- PostgreSQL (v12+ recommended)  
- npm or yarn  

### Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/csv-to-postgresql.git
cd csv-to-postgresql
