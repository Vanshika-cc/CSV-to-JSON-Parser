const fs = require('fs');
const readline = require('readline');

/**
 * Set nested property in object using dot notation
 * Example: setNestedProperty(obj, 'address.city', 'Mumbai')
 * Result: obj.address.city = 'Mumbai'
 */
function setNestedProperty(obj, path, value) {
  const keys = path.trim().split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

/**
 * Parse CSV line handling commas inside quotes
 */
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

/**
 * Parse CSV file and convert to JSON objects
 */
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    let headers = [];
    let isFirstLine = true;

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      if (!line.trim()) return; // Skip empty lines

      if (isFirstLine) {
        // Parse headers
        headers = parseCSVLine(line);
        isFirstLine = false;
      } else {
        // Parse data row
        const values = parseCSVLine(line);
        const obj = {};

        headers.forEach((header, index) => {
          const value = values[index] || '';
          
          // Convert age to integer if it's the age field
          if (header.trim() === 'age') {
            setNestedProperty(obj, header, parseInt(value) || 0);
          } else {
            setNestedProperty(obj, header, value);
          }
        });

        results.push(obj);
      }
    });

    rl.on('close', () => {
      resolve(results);
    });

    rl.on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = { parseCSV };