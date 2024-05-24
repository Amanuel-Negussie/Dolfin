// index.js
require("dotenv").config();
const express = require("express");
const sql = require('mssql');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectToDatabase, queryDatabase } = require("./db");

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
    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
    response.json(createTokenResponse.data);
  } catch (error) {
    console.error("Error creating link token:", error);
    response.status(500).send("failure");
  }
});

app.post("/exchange_public_token", async function (request, response) {
  const publicToken = request.body.public_token;
  try {
    const plaidResponse = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
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

    const transactions = plaidResponse.data.transactions;

// Save transactions to the database
for (const transaction of transactions) {
  // Check if the category is a valid string
  const category = typeof transaction.category === 'string' ? transaction.category : '';

  // Check if the logo_url is a valid string or empty
  const logoUrl = typeof transaction.logo_url === 'string' ? transaction.logo_url : '';

  const accountIdResult = await queryDatabase(
    `SELECT id FROM Accounts WHERE account_id = @account_id`,
    [{ name: 'account_id', type: sql.NVarChar, value: transaction.account_id }]
  );
  const accountId = accountIdResult.recordset[0].id;

  await queryDatabase(
    `INSERT INTO Transactions (account_id, transaction_id, amount, date, name, category, logo_url) 
     VALUES (@account_id, @transaction_id, @amount, @date, @name, @category, @logo_url)`,
    [
      { name: 'account_id', type: sql.Int, value: accountId },
      { name: 'transaction_id', type: sql.NVarChar, value: transaction.transaction_id },
      { name: 'amount', type: sql.Float, value: transaction.amount },
      { name: 'date', type: sql.Date, value: transaction.date },
      { name: 'name', type: sql.NVarChar, value: transaction.name },
      { name: 'category', type: sql.NVarChar, value: category }, // Use the validated category value
      { name: 'logo_url', type: sql.NVarChar, value: logoUrl } // Use the validated logo_url value
    ]
  );
}

    response.json(plaidResponse.data);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    response.status(500).send("failed");
  }
});


app.post("/user/data", async function (request, response) {
  const accessToken = request.body.access_token;
  try {
    // Fetch user information using identityGet
    const userInfoResponse = await plaidClient.identityGet({ access_token: accessToken });
    const userInfo = userInfoResponse.data;

    // Extract user information
    const userName = userInfo.accounts[0].owners[0].names[0];
    const userEmail = ""; // Add logic to fetch user email if available

    // Save user data to the database
    const userResult = await queryDatabase(
      `INSERT INTO Users (name, email) OUTPUT INSERTED.id VALUES (@name, @email)`,
      [
        { name: 'name', type: sql.NVarChar, value: userName },
        { name: 'email', type: sql.NVarChar, value: userEmail }
      ]
    );

    const userId = userResult.recordset[0].id;

    // Save accounts data
    for (const account of userInfo.accounts) {
      await queryDatabase(
        `INSERT INTO Accounts (user_id, account_id, official_name, persistent_account_id) VALUES (@user_id, @account_id, @official_name, @persistent_account_id)`,
        [
          { name: 'user_id', type: sql.Int, value: userId },
          { name: 'account_id', type: sql.NVarChar, value: account.account_id },
          { name: 'official_name', type: sql.NVarChar, value: account.official_name },
          { name: 'persistent_account_id', type: sql.NVarChar, value: account.persistent_account_id }
        ]
      );
    }

    response.json(userInfo);
  } catch (error) {
    console.error("Error fetching user data:", error);
    response.status(500).send("failed");
  }
});


app.post("/user/identity", async function (request, response) {
  const accessToken = request.body.access_token;
  try {
    const userInfoResponse = await plaidClient.identityGet({ access_token: accessToken });
    const userInfo = userInfoResponse.data;
    response.json(userInfo);
  } catch (error) {
    console.error("Error fetching user data:", error);
    response.status(500).send("failed");
  }
});

// Connect to SQL Server and start the server
connectToDatabase().then(() => {
  app.listen(8000, () => {
    console.log("Server has started");
  });
});
