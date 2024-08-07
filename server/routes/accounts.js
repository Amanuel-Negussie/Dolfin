/**
 * @file Defines all routes for the Accounts route.
 */

const express = require('express');
const { retrieveTransactionsByAccountId } = require('../db/queries');
const { asyncWrapper } = require('../middleware');
const { sanitizeTransactions } = require('../util');
const { deleteAccount } = require('../db/queries/accounts');

const router = express.Router();

/**
 * Fetches all transactions for a single account.
 *
 * @param {number} accountId the ID of the account.
 * @return {Object{[]}} an array of transactions
 */
router.get(
  '/:accountId/transactions',
  asyncWrapper(async (req, res) => {
    const { accountId } = req.params;
    const transactions = await retrieveTransactionsByAccountId(accountId);
    res.json(sanitizeTransactions(transactions));
  })
);

/**
 * Deletes a single account and transactions.
 * @param {string} accountId the ID of the item.
 * @returns status of 204 if successful
 */
router.delete(
  '/:accountId',
  asyncWrapper(async (req, res) => {
    const { accountId } = req.params;
    /* eslint-disable camelcase */
    await deleteAccount(accountId);

    res.sendStatus(204);
  })
);

module.exports = router;