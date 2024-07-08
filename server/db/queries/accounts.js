const { retrieveItemByPlaidItemId } = require('./items');
const { connectToDatabase, queryDatabase } = require("../db");
/**
 * Creates multiple accounts related to a single item.
 *
 * @param {string} plaidItemId the Plaid ID of the item.
 * @param {Object[]} accounts an array of accounts.
 * @returns {Object[]} an array of new accounts.
 */
const createAccounts = async (plaidItemId, accounts) => {
  const { id: itemId } = await retrieveItemByPlaidItemId(plaidItemId);
  const pendingQueries = accounts.map(async account => {
    const {
      account_id: aid,
      name,
      mask,
      official_name: officialName,
      balances: {
        available: availableBalance,
        current: currentBalance,
        iso_currency_code: isoCurrencyCode,
        unofficial_currency_code: unofficialCurrencyCode,
      },
      subtype,
      type,
    } = account;
    const query = `
      MERGE accounts_table AS target
      USING (SELECT @param1 AS item_id, @param2 AS plaid_account_id, @param3 AS name, @param4 AS mask, @param5 AS official_name, @param6 AS current_balance, @param7 AS available_balance, @param8 AS iso_currency_code, @param9 AS unofficial_currency_code, @param10 AS type, @param11 AS subtype) AS source
      ON (target.plaid_account_id = source.plaid_account_id)
      WHEN MATCHED THEN
        UPDATE SET
          current_balance = source.current_balance,
          available_balance = source.available_balance
      WHEN NOT MATCHED THEN
        INSERT (item_id, plaid_account_id, name, mask, official_name, current_balance, available_balance, iso_currency_code, unofficial_currency_code, type, subtype)
        VALUES (source.item_id, source.plaid_account_id, source.name, source.mask, source.official_name, source.current_balance, source.available_balance, source.iso_currency_code, source.unofficial_currency_code, source.type, source.subtype)
      OUTPUT inserted.*;
    `;
    const params = [
      { name: 'param1', type: sql.Int, value: itemId },
      { name: 'param2', type: sql.NVarChar, value: aid },
      { name: 'param3', type: sql.NVarChar, value: name },
      { name: 'param4', type: sql.NVarChar, value: mask },
      { name: 'param5', type: sql.NVarChar, value: officialName },
      { name: 'param6', type: sql.Float, value: currentBalance },
      { name: 'param7', type: sql.Float, value: availableBalance },
      { name: 'param8', type: sql.NVarChar, value: isoCurrencyCode },
      { name: 'param9', type: sql.NVarChar, value: unofficialCurrencyCode },
      { name: 'param10', type: sql.NVarChar, value: type },
      { name: 'param11', type: sql.NVarChar, value: subtype },
    ];
    const { recordset } = await queryDatabase(query, params);
    return recordset[0];
  });
  return await Promise.all(pendingQueries);
};

/**
 * Retrieves the account associated with a Plaid account ID.
 *
 * @param {string} plaidAccountId the Plaid ID of the account.
 * @returns {Object} a single account.
 */
const retrieveAccountByPlaidAccountId = async plaidAccountId => {
  const query = 'SELECT * FROM accounts WHERE plaid_account_id = @param1';
  const params = [{ name: 'param1', type: sql.NVarChar, value: plaidAccountId }];
  const { recordset } = await queryDatabase(query, params);
  return recordset[0];
};

/**
 * Retrieves the accounts for a single item.
 *
 * @param {number} itemId the ID of the item.
 * @returns {Object[]} an array of accounts.
 */
const retrieveAccountsByItemId = async itemId => {
  const query = 'SELECT * FROM accounts WHERE item_id = @param1 ORDER BY id';
  const params = [{ name: 'param1', type: sql.Int, value: itemId }];
  const { recordset: accounts } = await queryDatabase(query, params);
  return accounts;
};

/**
 * Retrieves all accounts for a single user.
 *
 * @param {number} userId the ID of the user.
 *
 * @returns {Object[]} an array of accounts.
 */
const retrieveAccountsByUserId = async userId => {
  const query = 'SELECT * FROM accounts WHERE user_id = @param1 ORDER BY id';
  const params = [{ name: 'param1', type: sql.Int, value: userId }];
  const { recordset: accounts } = await queryDatabase(query, params);
  return accounts;
};

module.exports = {
  createAccounts,
  retrieveAccountByPlaidAccountId,
  retrieveAccountsByItemId,
  retrieveAccountsByUserId,
};
