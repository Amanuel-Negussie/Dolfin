const { retrieveAccountByPlaidAccountId } = require('./accounts');
const db = require('../');
const sql = require('mssql');

/**
 * Creates or updates multiple transactions.
 *
 * @param {Object[]} transactions an array of transactions.
 */
const createOrUpdateTransactions = async transactions => {
  const pendingQueries = transactions.map(async transaction => {
    const {
      account_id: plaidAccountId,
      transaction_id: plaidTransactionId,
      category_id: plaidCategoryId,
      category: categories,
      transaction_type: transactionType,
      name: transactionName,
      amount,
      iso_currency_code: isoCurrencyCode,
      unofficial_currency_code: unofficialCurrencyCode,
      date: transactionDate,
      pending,
      account_owner: accountOwner,
    } = transaction;
    const { id: accountId } = await retrieveAccountByPlaidAccountId(
      plaidAccountId
    );
    const [category, subcategory] = categories;
    try {
      const query = `
        MERGE transactions_table AS target
        USING (VALUES (@param1, @param2, @param3, @param4, @param5, @param6, @param7, @param8, @param9, @param10, @param11, @param12, @param13)) AS source 
          (account_id, plaid_transaction_id, plaid_category_id, category, subcategory, type, name, amount, iso_currency_code, unofficial_currency_code, date, pending, account_owner)
        ON (target.plaid_transaction_id = source.plaid_transaction_id)
        WHEN MATCHED THEN 
          UPDATE SET 
            plaid_category_id = source.plaid_category_id,
            category = source.category,
            subcategory = source.subcategory,
            type = source.type,
            name = source.name,
            amount = source.amount,
            iso_currency_code = source.iso_currency_code,
            unofficial_currency_code = source.unofficial_currency_code,
            date = source.date,
            pending = source.pending,
            account_owner = source.account_owner
        WHEN NOT MATCHED THEN
          INSERT (account_id, plaid_transaction_id, plaid_category_id, category, subcategory, type, name, amount, iso_currency_code, unofficial_currency_code, date, pending, account_owner)
          VALUES (source.account_id, source.plaid_transaction_id, source.plaid_category_id, source.category, source.subcategory, source.type, source.name, source.amount, source.iso_currency_code, source.unofficial_currency_code, source.date, source.pending, source.account_owner);
      `;
      const params = [
        { name: 'param1', type: sql.Int, value: accountId },
        { name: 'param2', type: sql.NVarChar, value: plaidTransactionId },
        { name: 'param3', type: sql.NVarChar, value: plaidCategoryId },
        { name: 'param4', type: sql.NVarChar, value: category },
        { name: 'param5', type: sql.NVarChar, value: subcategory },
        { name: 'param6', type: sql.NVarChar, value: transactionType },
        { name: 'param7', type: sql.NVarChar, value: transactionName },
        { name: 'param8', type: sql.Float, value: amount },
        { name: 'param9', type: sql.NVarChar, value: isoCurrencyCode },
        { name: 'param10', type: sql.NVarChar, value: unofficialCurrencyCode },
        { name: 'param11', type: sql.Date, value: transactionDate },
        { name: 'param12', type: sql.Bit, value: pending },
        { name: 'param13', type: sql.NVarChar, value: accountOwner },
      ];
      await db.queryDatabase(query, params);
    } catch (err) {
      console.error(err);
    }
  });
  await Promise.all(pendingQueries);
};

/**
 * Retrieves all transactions for a single account.
 *
 * @param {number} accountId the ID of the account.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionsByAccountId = async accountId => {
  const query = 'SELECT * FROM transactions_table WHERE account_id = @param1 ORDER BY date DESC';
  const params = [{ name: 'param1', type: sql.Int, value: accountId }];
  const { recordset: transactions } = await db.queryDatabase(query, params);
  return transactions;
};

/**
 * Retrieves all transactions for a single item.
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionsByItemId = async itemId => {
  const query = 'SELECT * FROM transactions_table WHERE item_id = @param1 ORDER BY date DESC';
  const params = [{ name: 'param1', type: sql.Int, value: itemId }];
  const { recordset: transactions } = await db.queryDatabase(query, params);
  return transactions;
};

/**
 * Retrieves all transactions for a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionsByUserId = async userId => {
  const query = 'SELECT * FROM transactions_table WHERE user_id = @param1 ORDER BY date DESC';
  const params = [{ name: 'param1', type: sql.Int, value: userId }];
  const { recordset: transactions } = await db.queryDatabase(query, params);
  return transactions;
};

/**
 * Removes one or more transactions.
 *
 * @param {string[]} plaidTransactionIds the Plaid IDs of the transactions.
 */
const deleteTransactions = async plaidTransactionIds => {
  const pendingQueries = plaidTransactionIds.map(async transactionId => {
    const query = 'DELETE FROM transactions_table WHERE plaid_transaction_id = @param1';
    const params = [{ name: 'param1', type: sql.NVarChar, value: transactionId }];
    await db.queryDatabase(query, params);
  });
  await Promise.all(pendingQueries);
};

module.exports = {
  createOrUpdateTransactions,
  retrieveTransactionsByAccountId,
  retrieveTransactionsByItemId,
  retrieveTransactionsByUserId,
  deleteTransactions,
};
