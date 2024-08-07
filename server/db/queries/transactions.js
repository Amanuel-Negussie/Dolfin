const { retrieveAccountByPlaidAccountId } = require('./accounts');
const { connectToDatabase, queryDatabase } = require("../db");
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
      personal_finance_category: {
        primary: category,  // Map to primary
        detailed: subcategory  // Map to detailed
      },
      transaction_type: transactionType,
      name: transactionName,
      amount,
      iso_currency_code: isoCurrencyCode,
      unofficial_currency_code: unofficialCurrencyCode,
      date: transactionDate,
      pending,
      account_owner: accountOwner,
      logo_url: logo_url,
    } = transaction;


    // Apply the conditional formatting to the amount
    const formattedAmount = amount >= 0 ? -amount : Math.abs(amount);
    // console.log('amount: ', amount);
    // console.log('formatted: ', formattedAmount);
    //console.log('logo_url: ', transaction.logo_url);
    // Retrieve the account ID
    const account = await retrieveAccountByPlaidAccountId(plaidAccountId);
    
    // Check if account was found
    if (!account) {
      throw new Error(`Account not found for plaidAccountId: ${plaidAccountId}`);
    }

    const { id: accountId } = account;
    try {
      // SQL query for MERGE
      const query = `
        MERGE transactions_table AS target
        USING (VALUES (@param1, @param2, @param3, @param4, @param5, @param6, @param7, @param8, @param9, @param10, @param11, @param12, @param13, @param14)) AS source 
          (account_id, plaid_transaction_id, plaid_category_id, category, subcategory, type, name, amount, iso_currency_code, unofficial_currency_code, date, pending, account_owner, logo_url)
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
            account_owner = source.account_owner,
            logo_url = source.logo_url
        WHEN NOT MATCHED THEN
          INSERT (account_id, plaid_transaction_id, plaid_category_id, category, subcategory, type, name, amount, iso_currency_code, unofficial_currency_code, date, pending, account_owner, logo_url)
          VALUES (source.account_id, source.plaid_transaction_id, source.plaid_category_id, source.category, source.subcategory, source.type, source.name, source.amount, source.iso_currency_code, source.unofficial_currency_code, source.date, source.pending, source.account_owner, source.logo_url);
      `;

      // Parameters for the query
      const params = [
        { name: 'param1', type: sql.Int, value: accountId },
        { name: 'param2', type: sql.NVarChar, value: plaidTransactionId },
        { name: 'param3', type: sql.NVarChar, value: plaidCategoryId },
        { name: 'param4', type: sql.NVarChar, value: category || '' },  // Ensure it's a valid string
        { name: 'param5', type: sql.NVarChar, value: subcategory || '' },  // Ensure it's a valid string
        { name: 'param6', type: sql.NVarChar, value: transactionType || '' },  // Ensure it's a valid string
        { name: 'param7', type: sql.NVarChar, value: transactionName || '' },  // Ensure it's a valid string
        { name: 'param8', type: sql.Decimal(28, 10), value: formattedAmount },  // Use sql.Decimal for numeric values
        { name: 'param9', type: sql.NVarChar, value: isoCurrencyCode || '' },  // Ensure it's a valid string
        { name: 'param10', type: sql.NVarChar, value: unofficialCurrencyCode || '' },  // Ensure it's a valid string
        { name: 'param11', type: sql.Date, value: transactionDate },
        { name: 'param12', type: sql.Bit, value: pending },
        { name: 'param13', type: sql.NVarChar, value: accountOwner || '' },  // Ensure it's a valid string
        { name: 'param14', type: sql.NVarChar, value: logo_url || '' }  // Ensure it's a valid string
      ];

      await queryDatabase(query, params);
      // Identify and update recurring transactions
      //const recurringTransactions = identifyRecurringTransactions(transactions);
      //await updateRecurringTransactions(recurringTransactions);
    } catch (err) {
      console.error(err);
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
const retrieveTransactionsByAccountId = async accountId => {
  try{
  const query = 'SELECT * FROM transactions_table WHERE account_id = @param1 ORDER BY date DESC';
  const params = [{ name: 'param1', type: sql.Int, value: accountId }];
  const { recordset: transactions } = await queryDatabase(query, params);
  return transactions;
  } catch (err) {
    console.error("Error in retrieiveTransactionsByAccountId:", err);
    throw err;
  }
};

/**
 * Retrieves all transactions for a single item.
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionsByItemId = async itemId => {
  const query = 'SELECT * FROM transactions WHERE item_id = @param1 ORDER BY date DESC';
  const params = [{ name: 'param1', type: sql.Int, value: itemId }];
  const { recordset: transactions } = await queryDatabase(query, params);
  return transactions;
};






/**
 * Retrieves all transactions for a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionsByUserId = async userId => {
  const query = 'SELECT * FROM transactions WHERE user_id = @param1 ORDER BY date DESC';
  const params = [{ name: 'param1', type: sql.Int, value: userId }];
  const { recordset: transactions } = await queryDatabase(query, params);
  return transactions;
};

/**
 * Retrieves all transactions for a single user.
 *
 * @param {string} auth0Id the Auth0 ID of the user.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionsByAuth0Id = async auth0Id => {
  const query = 'SELECT * FROM transactions WHERE user_id = (SELECT id FROM users_table WHERE auth0_id = @param1) ORDER BY date DESC';
  const params = [{ name: 'param1', type: sql.NVarChar, value: auth0Id }];
  const { recordset: transactions } = await queryDatabase(query, params);
  return transactions;
};

/**
 * Retrieves all transactions for a single user.
 *
 * @param {string} auth0Id the Auth0 ID of the user.
 * @returns {Object[]} an array of transactions.
 */
const retrieveTransactionTrendsByAuth0Id = async auth0Id => {
  const query = `
    SELECT 
      CAST(date AS DATE) AS date,
      SUM(amount) * -1 AS amount
    FROM 
      transactions
    WHERE 
      user_id = (SELECT id FROM users_table WHERE auth0_id = @param1)
      AND date >= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 1, 0)
      AND date < DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) + 1, 0)
      AND amount <= 0
    GROUP BY 
      CAST(date AS DATE)
    ORDER BY 
      date;
  `;
  const params = [{ name: 'param1', type: sql.NVarChar, value: auth0Id }];
  const { recordset: transactions } = await queryDatabase(query, params);
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
    await queryDatabase(query, params);
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
  retrieveTransactionsByAuth0Id,
  retrieveTransactionTrendsByAuth0Id,
  deleteTransactions,
  updateRecurringTransactions,
  retrieveRecurringTransactionsByUserId,
};