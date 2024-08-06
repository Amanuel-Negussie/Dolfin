const { retrieveItemByPlaidItemId } = require('./items');
const { connectToDatabase, queryDatabase } = require("../db");
const sql = require('mssql');
/**
 * Creates multiple accounts related to a single item.
 *
 * @param {string} plaidItemId the Plaid ID of the item.
 * @param {Object[]} accounts an array of accounts.
 * @returns {Object[]} an array of new accounts.
 */
const createAccounts = async (plaidItemId, accounts) => {
  const { id: itemId, plaid_institution_id: plaidInstitutionId, user_id: userId } = await retrieveItemByPlaidItemId(plaidItemId);
   // Log retrieved item details
   console.log('Retrieved Item Details:', { itemId, plaidInstitutionId, userId });

  const pendingQueries = accounts.map(async account => {
    const {
      account_id: plaidAccountId,
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
    // Log account details
    console.log('Processing Account:', {
      plaidAccountId,
      name,
      mask,
      officialName,
      availableBalance,
      currentBalance,
      isoCurrencyCode,
      unofficialCurrencyCode,
      subtype,
      type,
    });
    const query = `
     
        IF NOT EXISTS (
            SELECT 1 
            FROM accounts_table 
            WHERE name = @name 
              AND item_id IN (
                SELECT id 
                FROM items_table 
                WHERE plaid_institution_id = @plaidInstitutionId 
                  AND user_id = @userId
              )
        )
        BEGIN
            -- Perform the MERGE operation if the record does not exist
            MERGE accounts_table AS target
            USING (SELECT 
                      @itemId AS item_id, 
                      @plaidAccountId AS plaid_account_id, 
                      @name AS name, 
                      @mask AS mask, 
                      @officialName AS official_name, 
                      @currentBalance AS current_balance, 
                      @availableBalance AS available_balance, 
                      @isoCurrencyCode AS iso_currency_code, 
                      @unofficialCurrencyCode AS unofficial_currency_code, 
                      @type AS type, 
                      @subtype AS subtype
                  ) AS source
            ON (target.plaid_account_id = source.plaid_account_id)
            WHEN MATCHED THEN
              UPDATE SET
                current_balance = source.current_balance,
                available_balance = source.available_balance
            WHEN NOT MATCHED THEN
              INSERT (item_id, plaid_account_id, name, mask, official_name, current_balance, available_balance, iso_currency_code, unofficial_currency_code, type, subtype)
              VALUES (source.item_id, source.plaid_account_id, source.name, source.mask, source.official_name, source.current_balance, source.available_balance, source.iso_currency_code, source.unofficial_currency_code, source.type, source.subtype)
            OUTPUT inserted.*;
        END

    `;

    const params = [
      { name: 'itemId', type: sql.Int, value: itemId },
      { name: 'plaidAccountId', type: sql.NVarChar, value: plaidAccountId },
      { name: 'name', type: sql.NVarChar, value: name },
      { name: 'mask', type: sql.NVarChar, value: mask },
      { name: 'officialName', type: sql.NVarChar, value: officialName },
      { name: 'currentBalance', type: sql.Float, value: currentBalance },
      { name: 'availableBalance', type: sql.Float, value: availableBalance },
      { name: 'isoCurrencyCode', type: sql.NVarChar, value: isoCurrencyCode },
      { name: 'unofficialCurrencyCode', type: sql.NVarChar, value: unofficialCurrencyCode },
      { name: 'type', type: sql.NVarChar, value: type },
      { name: 'subtype', type: sql.NVarChar, value: subtype },
      { name: 'plaidInstitutionId', type: sql.NVarChar, value: plaidInstitutionId },
      { name: 'userId', type: sql.Int, value: userId },
    ];

    const { recordset } = await queryDatabase(query, params);
  
    return recordset? recordset[0]: null;
  });

  try {
    // Wait for all queries to complete and filter out null values
    const results = await Promise.all(pendingQueries);
    const filteredResults = results.filter(result => result !== null);
    
    // Return filtered results if not empty, else return null
    return filteredResults.length > 0 ? filteredResults : null;
  } catch (error) {
    console.error('Error creating accounts:', error);
    throw error;
  }
};


/**
 * Retrieves the account associated with a Plaid account ID.
 *
 * @param {string} plaidAccountId the Plaid ID of the account.
 * @returns {Object} a single account.
 */
const retrieveAccountByPlaidAccountId = async plaidAccountId => {
  console.log(plaidAccountId);
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
