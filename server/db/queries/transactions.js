const { retrieveAccountByPlaidAccountId } = require("./accounts");
const { connectToDatabase, queryDatabase } = require("../db");
const sql = require("mssql");

/**
 * Creates or updates multiple transactions.
 *
 * @param {Object[]} transactions an array of transactions.
 */
const createOrUpdateTransactions = async (transactions) => {
  const pendingQueries = transactions.map(async (transaction) => {
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
        { name: "param1", type: sql.Int, value: accountId },
        { name: "param2", type: sql.NVarChar, value: plaidTransactionId },
        { name: "param3", type: sql.NVarChar, value: plaidCategoryId },
        { name: "param4", type: sql.NVarChar, value: category },
        { name: "param5", type: sql.NVarChar, value: subcategory },
        { name: "param6", type: sql.NVarChar, value: transactionType },
        { name: "param7", type: sql.NVarChar, value: transactionName },
        { name: "param8", type: sql.Float, value: amount },
        { name: "param9", type: sql.NVarChar, value: isoCurrencyCode },
        { name: "param10", type: sql.NVarChar, value: unofficialCurrencyCode },
        { name: "param11", type: sql.Date, value: transactionDate },
        { name: "param12", type: sql.Bit, value: pending },
        { name: "param13", type: sql.NVarChar, value: accountOwner },
      ];
      await queryDatabase(query, params);

      // Identify and update recurring transactions
      const recurringTransactions = identifyRecurringTransactions(transactions);
      await updateRecurringTransactions(recurringTransactions);
    } catch (err) {
      console.error("Error in createOrUpdateTransactions:", err);
      throw err;
    }
  });
  await Promise.all(pendingQueries);
};



/**
 * Updates the frequency and last transaction date for recurring transactions.
 *
 * @param {Object[]} recurringTransactions an array of recurring transactions.
 */
const updateRecurringTransactions = async (recurringTransactions) => {
  const pendingQueries = recurringTransactions.map(async (transaction) => {
    const query = `
      UPDATE transactions_table
      SET frequency = @param1,
          last_transaction_date = @param2
      WHERE account_id = @param3
        AND plaid_transaction_id = @param4
        AND name = @param5
        AND amount = @param6
    `;
    const params = [
      { name: "param1", type: sql.NVarChar, value: transaction.frequency },
      {
        name: "param2",
        type: sql.Date,
        value: transaction.last_transaction_date,
      },
      { name: "param3", type: sql.Int, value: transaction.account_id },
      {
        name: "param4",
        type: sql.NVarChar,
        value: transaction.plaid_transaction_id,
      },
      { name: "param5", type: sql.NVarChar, value: transaction.name },
      { name: "param6", type: sql.Decimal(28, 10), value: transaction.amount },
    ];
    await queryDatabase(query, params);
  });
  await Promise.all(pendingQueries);
};

/**
 * Retrieves all transactions for a single account.
 *
 * @param {number} accountId the ID of the account.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionsByAccountId = async (accountId) => {
  try {
    const query =
      "SELECT * FROM transactions_table WHERE account_id = @param1 ORDER BY date DESC";
    const params = [{ name: "param1", type: sql.Int, value: accountId }];
    const { recordset: transactions } = await queryDatabase(query, params);
    return transactions;
  } catch (err) {
    console.error("Error in retrieveTransactionsByAccountId:", err);
    throw err;
  }
};

/**
 * Retrieves all transactions for a single item.
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionsByItemId = async (itemId) => {
  try {
    const query =
      "SELECT * FROM transactions_table WHERE item_id = @param1 ORDER BY date DESC";
    const params = [{ name: "param1", type: sql.Int, value: itemId }];
    const { recordset: transactions } = await queryDatabase(query, params);
    return transactions;
  } catch (err) {
    console.error("Error in retrieveTransactionsByItemId:", err);
    throw err;
  }
};






/**
 * Retrieves all transactions for a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionsByUserId = async (userId) => {
  try {
    const query =
      "SELECT * FROM transactions WHERE user_id = @param1 ORDER BY date DESC";
    const params = [{ name: "param1", type: sql.Int, value: userId }];
    const { recordset: transactions } = await queryDatabase(query, params);
    return transactions;
  } catch (err) {
    console.error("Error in retrieveTransactionsByUserId:", err);
    throw err;
  }
};

/**
 * Removes one or more transactions.
 *
 * @param {string[]} plaidTransactionIds the Plaid IDs of the transactions.
 */
const deleteTransactions = async (plaidTransactionIds) => {
  const pendingQueries = plaidTransactionIds.map(async (transactionId) => {
    try {
      const query =
        "DELETE FROM transactions_table WHERE plaid_transaction_id = @param1";
      const params = [
        { name: "param1", type: sql.NVarChar, value: transactionId },
      ];
      await queryDatabase(query, params);
    } catch (err) {
      console.error("Error in deleteTransactions:", err);
      throw err;
    }
  });
  await Promise.all(pendingQueries);
};

const retrieveRecurringTransactionsByUserId = async (userId) => {
  try {
    const query = `
      SELECT * FROM transactions
      WHERE user_id = @param1 AND frequency IS NOT NULL
      ORDER BY date DESC
    `;
    const params = [{ name: "param1", type: sql.Int, value: userId }];
    const { recordset: transactions } = await queryDatabase(query, params);
    return transactions;
  } catch (err) {
    console.error("Error in retrieveRecurringTransactionsByUserId:", err);
    throw err;
  }
};


module.exports = {
  createOrUpdateTransactions,
  retrieveTransactionsByAccountId,
  retrieveTransactionsByItemId,
  retrieveTransactionsByUserId,
  deleteTransactions,
  updateRecurringTransactions,
  retrieveRecurringTransactionsByUserId,
};
