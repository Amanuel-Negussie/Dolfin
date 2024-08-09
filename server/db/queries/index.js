/**
 * @file Exports the queries for interacting with the database.
 */

const {
    createAccounts,
    retrieveAccountByPlaidAccountId,
    retrieveAccountsByItemId,
    retrieveAccountsByAuth0Id,
  } = require('./accounts');
  const {
    createItem,
    deleteItem,
    retrieveItemById,
    retrieveItemByPlaidAccessToken,
    retrieveItemByPlaidInstitutionId,
    retrieveItemByPlaidItemId,
    retrieveItemsByAuth0Id,
    updateItemStatus,
    updateItemTransactionsCursor,
  } = require('./items');
  const { createPlaidApiEvent } = require('./plaidApiEvents');
  const {
    createOrUpdateTransactions,
    retrieveTransactionsByAccountId,
    retrieveTransactionsByItemId,
    retrieveTransactionsByUserId,
    retrieveTransactionsByAuth0Id,
    retrieveTransactionTrendsByAuth0Id,
    deleteTransactions,
    retrieveRecurringTransactionsByUserId,
  } = require('./transactions');
  const {
    createUser,
    deleteUsers,
    retrieveUsers,
    retrieveUserByAuth0Id,
    retrieveUserByUsername,
    retrieveTransactionAssetsByUserId,
    retrieveTransactionLiabilitiesByUserId,
    createIncomeBills,
    retrieveIncomeBillsByUserId,
    createBudgetCategory,
    retrieveBudgetCategoriesByUserId,
    updateIncomeBills,
    updateBudgetCategory,
  } = require('./users');
  const { createLinkEvent } = require('./linkEvents');
  
  const {
    createAsset,
    retrieveAssetsByUser,
    deleteAssetByAssetId,
  } = require('./assets');
  
  module.exports = {
    // accounts
    createAccounts,
    retrieveAccountByPlaidAccountId,
    retrieveAccountsByItemId,
    retrieveAccountsByAuth0Id,
    // items
    createItem,
    deleteItem,
    retrieveItemById,
    retrieveItemByPlaidAccessToken,
    retrieveItemByPlaidInstitutionId,
    retrieveItemByPlaidItemId,
    retrieveItemsByAuth0Id,
    updateItemStatus,
    // plaid api events
    createPlaidApiEvent,
    // transactions
    retrieveTransactionsByAccountId,
    retrieveTransactionsByItemId,
    retrieveTransactionsByUserId,
    retrieveTransactionsByAuth0Id,
    retrieveTransactionTrendsByAuth0Id,
    deleteTransactions,
    createOrUpdateTransactions,
    updateItemTransactionsCursor,
    retrieveTransactionAssetsByUserId,
    retrieveTransactionLiabilitiesByUserId,
    retrieveRecurringTransactionsByUserId,
    // users
    createUser,
    deleteUsers,
    retrieveUserByAuth0Id,
    retrieveUserByUsername,
    retrieveUsers,
    createIncomeBills,
    retrieveIncomeBillsByUserId,
    createBudgetCategory,
    retrieveBudgetCategoriesByUserId,
    updateIncomeBills,
    updateBudgetCategory,
    // assets
    createAsset,
    retrieveAssetsByUser,
    deleteAssetByAssetId,
    // link events
    createLinkEvent,
  };