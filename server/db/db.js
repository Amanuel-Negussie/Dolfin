// db.js
const sql = require("mssql");

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

async function queryDatabase(query, params) {
  try {
    const pool = await sql.connect(config);
    const request = pool.request();
    params.forEach((param, index) => {
      request.input(`param${index + 1}`, param.type, param.value);
    });
    return await request.query(query);
  } catch (err) {
    console.error("Error querying database:", err);
    throw err;
  }
}

module.exports = {
  connectToDatabase,
  queryDatabase,
};
