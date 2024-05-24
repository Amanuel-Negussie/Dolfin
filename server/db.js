const sql = require('mssql');

// Configuration for your database
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true, // Use this if SQL Server uses a self-signed certificate
  },
};

// Function to execute a query
async function queryDatabase(query, parameters = []) {
  try {
    // Create a new connection
    let pool = await sql.connect(config);

    // Create a prepared statement
    let request = pool.request();
    parameters.forEach(param => {
      request.input(param.name, param.type, param.value);
    });

    // Execute the query
    let result = await request.query(query);

    // Close the connection
    await pool.close();

    return result;
  } catch (err) {
    console.error('SQL error', err);
    throw err;
  }
}

module.exports = {
  queryDatabase,
};
