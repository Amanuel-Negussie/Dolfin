/**
 * @file Defines all routes for the Users route.
 */

const express = require('express');
const Boom = require('@hapi/boom');
const {
  retrieveUsers,
  retrieveUserByUsername,
  retrieveAccountsByAuth0Id,
  createUser,
  deleteUsers,
  retrieveItemsByAuth0Id,
  retrieveTransactionsByUserId,
  retrieveTransactionAssetsByUserId,
  retrieveTransactionLiabilitiesByUserId,
  retrieveTransactionsByAuth0Id,
  retrieveUserByAuth0Id,
  retrieveTransactionTrendsByAuth0Id,
  retrieveRecurringTransactionsByUserId,
} = require('../db/queries');
const { asyncWrapper } = require('../middleware');
const {
  sanitizeAccounts,
  sanitizeItems,
  sanitizeUsers,
  sanitizeTransactions,
  sanitizeTransactionAssets,
  sanitizeTransactionLiabilities,
} = require('../util');


const router = express.Router();

const plaid = require('../plaid');

/**
 * Retrieves all users.
 *
 * @returns {Object[]} an array of users.
 */
router.get(
  '/',
  asyncWrapper(async (req, res) => {
    const users = await retrieveUsers();
    res.json(sanitizeUsers(users));
  })
);

/**
 * Creates a new user (unless the Auth0 ID is already taken).
 *
 * @param {string} username the username of the new user.
 * @param {string} auth0Id the Auth0 ID of the new user.
 * @returns {Object[]} an array containing the new user.
 */
/**
 * Creates a new user (unless the Auth0 ID is already taken).
 *
 * @param {string} username the username of the new user.
 * @param {string} auth0Id the Auth0 ID of the new user.
 * @returns {Object[]} an array containing the new user.
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    const { username, auth0Id } = req.body;
    
    try {
        console.log('Checking if user exists:', auth0Id);
        const userExists = await retrieveUserByUsername(auth0Id);
        // prevent duplicates
        if (userExists) {
            throw new Boom('User with this Auth0 ID already exists', { statusCode: 409 });
        }

        console.log('Creating new user:', username);
        const newUser = await createUser(username, auth0Id);
        console.log('New user created:', newUser);
        res.json(sanitizeUsers(newUser));
    } catch (error) {
        console.error('Error during user creation:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  })
);
/**
 * Retrieves user information for a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array containing a single user.
 */
router.get(
  '/:userId',
  asyncWrapper(async (req, res) => {
    const { sub: auth0Id } = req.auth.payload;
    const user = await retrieveUserByAuth0Id(auth0Id);
    res.json(sanitizeUsers(user));
  })
);

/**
 * Retrieves all items associated with a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of items.
 */
router.get(
  '/:userId/items',
  asyncWrapper(async (req, res) => {
    const { userId } = req.params;
    const { sub: auth0Id } = req.auth.payload;
    const items = await retrieveItemsByAuth0Id(auth0Id);
    res.json(sanitizeItems(items));
  })
);

/**
 * Retrieves all accounts associated with a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of accounts.
 */
router.get(
  '/:userId/accounts',
  asyncWrapper(async (req, res) => {
    const { sub: auth0Id } = req.auth.payload;
    const accounts = await retrieveAccountsByAuth0Id(auth0Id);
    res.json(sanitizeAccounts(accounts));
  })
);

/**
 * Retrieves all transactions associated with a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of transactions
 */
router.get(
  '/:userId/transactions',
  asyncWrapper(async (req, res) => {
    const { sub: auth0Id } = req.auth.payload;
    const transactions = await retrieveTransactionsByAuth0Id(auth0Id);
    res.json(sanitizeTransactions(transactions));
  })
);


// transaction assets
router.get(
  '/:userId/transaction-assets',
  asyncWrapper(async (req, res) => {
    const { userId } = req.params;
    const transactions = await retrieveTransactionAssetsByUserId(userId);
    
    res.json(sanitizeTransactionAssets(transactions));
  })
);

// transaction liabilities
router.get(
  '/:userId/transaction-liabilities',
  asyncWrapper(async (req, res) => {
    const { userId } = req.params;
    const transactions = await retrieveTransactionLiabilitiesByUserId(userId);
    res.json(sanitizeTransactionLiabilities(transactions));
  })
);


/**
 * Retrieves all transactions associated with a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of transactions
 */
router.get(
  '/transactions/trends',
  asyncWrapper(async (req, res) => {
    const { sub: auth0Id } = req.auth.payload;
    const transactions = await retrieveTransactionTrendsByAuth0Id(auth0Id);
    res.json(transactions);
  })
);

/**
 * Deletes a user and its related items
 *
 * @param {number} userId the ID of the user.
 */
router.delete(
  '/:userId',
  asyncWrapper(async (req, res) => {
    const { userId } = req.params;

    // removes all items from Plaid services associated with the user. Once removed, the access_token
    // associated with an Item is no longer valid and cannot be used to
    // access any data that was associated with the Item.

    // @TODO wrap promise in a try catch block once proper error handling introduced
    const items = await retrieveItemsByUser(userId);
    await Promise.all(
      items.map(({ plaid_access_token: token }) =>
        plaid.itemRemove({ access_token: token })
      )
    );

    // delete from the db
    await deleteUsers(userId);
    res.sendStatus(204);
  })
);

/**
 * Retrieves all recurring transactions associated with a single user.
 *
 * @param {string} userId the ID of the user.
 * @returns {Object[]} an array of recurring transactions
 */
router.get(
  '/:userId/recurring-transactions',
  asyncWrapper(async (req, res) => {
    const { userId } = req.params;
    console.log("Recurring Transactions Yo");
    const recurringTransactions = await retrieveRecurringTransactionsByUserId(userId);
    res.json(sanitizeTransactions(recurringTransactions));
  })
);

module.exports = router;