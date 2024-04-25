// index.js
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

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

app.listen(8000, () => {
  console.log("Server has started");
});
