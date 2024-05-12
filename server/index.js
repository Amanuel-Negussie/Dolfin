// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

//  encryption necessary
const { encryptData } = require('./encryption');

// Import required modules
const { Pool } = require('pg');

// Create an Express application instance
const app = express();

// Create a new pool instance for PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: process.env.HOST_ADDRESS,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT, // default PostgreSQL port
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database at:', res.rows[0].now);
  }
});

// Define routes or other middleware here...

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




const {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
} = require("plaid");

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.CLIENT_ID,
      "PLAID-SECRET": process.env.SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);
app.use(cors());
app.use(bodyParser.json());

// Saving perpetual secret after encrypting it

app.post("/saving-secret", async function (request, response) {
  try {
    // Extract parameters from the request body
    const { user_id, perpetual_bank_secret_key, bank_account_name, bank_name } = request.body;

    // Encrypt the perpetual_bank_secret_key
    const secretKey = Buffer.from(process.env.SECRET_KEY, 'hex'); // Retrieve the secret key from environment variables
    const encryptedDataWithIV = encryptData(perpetual_bank_secret_key, secretKey);

    // Construct the SQL INSERT statement
    const insertQuery = `
      INSERT INTO bank_accounts (user_id, perpetual_bank_secret_key, bank_account_name, bank_name, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `;
    
    // Execute the INSERT statement
    await pool.query(insertQuery, [user_id, encryptedDataWithIV, bank_account_name, bank_name]);

    // Send a success response
    response.status(200).send("Secret saved successfully");
  } catch (error) {
    console.error("Error saving secret:", error);
    response.status(500).send("Failed to save secret");
  }
});





app.post("/create_link_token", async function (request, response) {
  try {
    const plaidRequest = {
      user: {
        client_user_id: "user",
      },
      client_name: "Plaid Test App",
      products: ["auth", "transactions"],
      language: "en",
      redirect_uri: "http://localhost:5173/",
      country_codes: ["US"],
    };
    const createTokenResponse = await plaidClient.linkTokenCreate(
      plaidRequest
    );
    response.json(createTokenResponse.data);
  } catch (error) {
    console.error("Error creating link token:", error);
    response.status(500).send("failure");
  }
});

app.post("/exchange_public_token", async function (request, response) {
  const publicToken = request.body.public_token;
  try {
    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    const accessToken = plaidResponse.data.access_token;
    response.json({ accessToken });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    response.status(500).send("failed");
  }
});

app.post("/transactions/sync", async function (request, response) {
  const accessToken = request.body.access_token;
  try {
    const plaidResponse = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: "2024-01-01",
      end_date: "2024-04-10", // Change this to appropriate date range
    });
    response.json(plaidResponse.data);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    response.status(500).send("failed");
  }
});

// server getting authoriziation information
app.post("/user/data", async function (request, response) {
  const accessToken = request.body.access_token;
  try {
    const userInfoResponse = await plaidClient.authGet({ // Example endpoint to fetch user information
      access_token: accessToken,
    });
    const userInfo = userInfoResponse.data; // Adjust this according to the Plaid API response
    response.json(userInfo);
  } catch (error) {
    console.error("Error fetching user data:", error);
    response.status(500).send("failed");
  }
});

// server getting 
app.post("/user/identity", async function (request, response) {
  const accessToken = request.body.access_token;
  try {
    const userInfoResponse = await plaidClient.identityGet({ // Example endpoint to fetch user information
      access_token: accessToken,
    });
    const userInfo = userInfoResponse.data; // Adjust this according to the Plaid API response
    response.json(userInfo);
  } catch (error) {
    console.error("Error fetching user data:", error);
    response.status(500).send("failed");
  }
});

app.listen(8000, () => {
  console.log("Server has started");
});
