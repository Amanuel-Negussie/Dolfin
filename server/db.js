const sql = require("mssql");
const path = require('path'); 
const fs = require('fs');

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  trustServerCertificate: true,
  trustedConnection: false,
  enableArithAbort: false,
  port: parseInt(process.env.SQL_PORT, 10),
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    enableArithAbort: true,
  },
};

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log("Connected to SQL Server");
  } catch (err) {
    console.error("Error connecting to SQL Server:", err);
  }
}

async function updateDatabase() {
  const initDbFilePath = path.join(__dirname, 'init.sql');

  try {
    // Read the file with the correct encoding (UTF-16LE or UTF-16BE)
    const sqlScripts = fs.readFileSync(initDbFilePath, 'utf16le');

    // Split scripts by "GO", and filter out empty lines
    const scriptArray = sqlScripts.split(/\bGO\b/).map(line => line.trim()).filter(line => line);

    for (let script of scriptArray) {
      if (script) {
        await sql.query(script);
        console.log(`Executed SQL script: ${script}`);
      }
    }

    console.log('Database update complete');
  } catch (err) {
    console.error('Error updating database:', err);
    throw err;
  }
}
async function queryDatabase(query, params) {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request();
    params.forEach(param => {
      result.input(param.name, param.type, param.value);
    });
    return await result.query(query);
  } catch (err) {
    console.error("Error querying database:", err);
    throw err;
  }
}

module.exports = {
  connectToDatabase,
  updateDatabase,
  queryDatabase,
};