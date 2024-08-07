/**
 * @file Defines the route for link token creation.
 */

const { asyncWrapper } = require('../middleware');

const express = require('express');
const plaid = require('../plaid');
const fetch = require('node-fetch');
const { retrieveItemById, retrieveUserByAuth0Id } = require('../db/queries');
const {
  PLAID_SANDBOX_REDIRECT_URI,
  PLAID_PRODUCTION_REDIRECT_URI,
  PLAID_ENV,
} = process.env;

const redirect_uri =
  PLAID_ENV == 'sandbox'
    ? PLAID_SANDBOX_REDIRECT_URI
    : PLAID_PRODUCTION_REDIRECT_URI;
const router = express.Router();

router.post(
  '/',
  asyncWrapper(async (req, res) => {
    try {
      const { itemId } = req.body;
      const { sub: auth0Id } = req.auth.payload;
      const { id: userId } = await retrieveUserByAuth0Id(auth0Id);
      let accessToken = null;
      let products = ["auth", "transactions", "liabilities"]; // must include transactions in order to receive transactions webhooks
      if (itemId != null) {
        // for the link update mode, include access token and an empty products array
        const itemIdResponse = await retrieveItemById(itemId);
        accessToken = itemIdResponse.plaid_access_token;
        products = [];
      }
      // const response = await fetch('http://ngrok:4040/api/tunnels');
      // const { tunnels } = await response.json();
      // const httpsTunnel = tunnels.find(t => t.proto === 'https');
      const linkTokenParams = {
        user: {
          // This should correspond to a unique id for the current user.
          client_user_id: "id " + userId,
        },
        client_name: 'Dolfin',
        products,
        country_codes: ['CA'],
        language: 'en',
        //webhook: httpsTunnel.public_url + '/services/webhook',
        access_token: accessToken,
        link_customization_name: 'dolfin',
        
        account_filters: {

          depository: {
      
            account_subtypes: ['checking', 'savings']
      
          },
      
          credit: {
      
            account_subtypes: ['credit card']
      
          }
        }
      };
      // If user has entered a redirect uri in the .env file
      if (redirect_uri.indexOf('http') === 0) {
        linkTokenParams.redirect_uri = redirect_uri;
      }
      const createResponse = await plaid.linkTokenCreate(linkTokenParams);
      res.json(createResponse.data);
    } catch (err) {
      console.log('error while fetching client token', err.response.data);
      return res.json(err.response.data);
    }
  })
);

module.exports = router;