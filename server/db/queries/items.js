const { connectToDatabase, queryDatabase } = require("../db");
const sql = require('mssql');

/**
 * Creates a single item.
 *
 * @param {string} plaidInstitutionId the Plaid institution ID of the item.
 * @param {string} plaidAccessToken the Plaid access token of the item.
 * @param {string} plaidItemId the Plaid ID of the item.
 * @param {number} userId the ID of the user.
 * @returns {Object} the new item.
 */
const createItem = async (
  plaidInstitutionId,
  plaidAccessToken,
  plaidItemId,
  userId
) => {
  // this method only gets called on successfully linking an item.
  // We know the status is good.
  const status = 'good';
  const query = `
      INSERT INTO items_table
        (user_id, plaid_access_token, plaid_item_id, plaid_institution_id, status)
      OUTPUT INSERTED.*
      VALUES
        (@param1, @param2, @param3, @param4, @param5);
    `;
  const params = [
    { name: 'param1', type: sql.Int, value: userId },
    { name: 'param2', type: sql.NVarChar, value: plaidAccessToken },
    { name: 'param3', type: sql.NVarChar, value: plaidItemId },
    { name: 'param4', type: sql.NVarChar, value: plaidInstitutionId },
    { name: 'param5', type: sql.NVarChar, value: status },
  ];
  const { recordset } = await queryDatabase(query, params);
  return recordset[0];
};

/**
 * Retrieves a single item.
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object} an item.
 */
const retrieveItemById = async itemId => {
  const query = 'SELECT * FROM items_table WHERE id = @param1';
  const params = [{ name: 'param1', type: sql.Int, value: itemId }];
  const { recordset } = await queryDatabase(query, params);
  return recordset[0];
};

/**
 * Retrieves a single item.
 *
 * @param {string} accessToken the Plaid access token of the item.
 * @returns {Object} the item.
 */
const retrieveItemByPlaidAccessToken = async accessToken => {
  const query = 'SELECT * FROM items_table WHERE plaid_access_token = @param1';
  const params = [{ name: 'param1', type: sql.NVarChar, value: accessToken }];
  const { recordset: existingItems } = await queryDatabase(query, params);
  return existingItems[0];
};

/**
 * Retrieves a single item.
 *
 * @param {string} plaidInstitutionId the Plaid institution ID of the item.
 * @param {number} userId the ID of the user.
 * @returns {Object} an item.
 */
const retrieveItemByPlaidInstitutionId = async (plaidInstitutionId, userId) => {
  const query = 'SELECT * FROM items_table WHERE plaid_institution_id = @param1 AND user_id = @param2';
  const params = [
    { name: 'param1', type: sql.NVarChar, value: plaidInstitutionId },
    { name: 'param2', type: sql.Int, value: userId },
  ];
  const { recordset: existingItems } = await queryDatabase(query, params);
  return existingItems[0];
};

/**
 * Retrieves a single item.
 *
 * @param {string} plaidItemId the Plaid ID of the item.
 * @returns {Object} an item.
 */
const retrieveItemByPlaidItemId = async plaidItemId => {
  const query = 'SELECT * FROM items_table WHERE plaid_item_id = @param1';
  const params = [{ name: 'param1', type: sql.NVarChar, value: plaidItemId }];
  const { recordset } = await queryDatabase(query, params);
  return recordset[0];
};

/**
 * Retrieves all items for a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of items.
 */
const retrieveItemsByUser = async userId => {
  const query = 'SELECT * FROM items_table WHERE user_id = @param1';
  const params = [{ name: 'param1', type: sql.Int, value: userId }];
  const { recordset: items } = await queryDatabase(query, params);
  return items;
};

/**
 * Updates the status for a single item.
 *
 * @param {string} itemId the Plaid item ID of the item.
 * @param {string} status the status of the item.
 */
const updateItemStatus = async (itemId, status) => {
  const query = 'UPDATE items_table SET status = @param1 WHERE id = @param2';
  const params = [
    { name: 'param1', type: sql.NVarChar, value: status },
    { name: 'param2', type: sql.Int, value: itemId },
  ];
  await queryDatabase(query, params);
};

/**
 * Updates the transaction cursor for a single item.
 *
 * @param {string} plaidItemId the Plaid item ID of the item.
 * @param {string} transactionsCursor latest observed transactions cursor on this item.
 */
const updateItemTransactionsCursor = async (plaidItemId, transactionsCursor) => {
  const query = 'UPDATE items_table SET transactions_cursor = @param1 WHERE plaid_item_id = @param2';
  const params = [
    { name: 'param1', type: sql.NVarChar, value: transactionsCursor },
    { name: 'param2', type: sql.NVarChar, value: plaidItemId },
  ];
  await queryDatabase(query, params);
};

/**
 * Removes a single item. The database will also remove related accounts and transactions.
 *
 * @param {string} itemId the id of the item.
 */
const deleteItem = async itemId => {
  const query = 'DELETE FROM items_table WHERE id = @param1';
  const params = [{ name: 'param1', type: sql.Int, value: itemId }];
  await queryDatabase(query, params);
};

module.exports = {
  createItem,
  deleteItem,
  retrieveItemById,
  retrieveItemByPlaidAccessToken,
  retrieveItemByPlaidInstitutionId,
  retrieveItemByPlaidItemId,
  retrieveItemsByUser,
  updateItemStatus,
  updateItemTransactionsCursor,
};
