const { connectToDatabase, queryDatabase } = require("../db");
const sql = require("mssql");

/**
 * Creates a single user.
 *
 * @param {string} username the username of the user.
 * @param {string} auth0Id the Auth0 ID of the user.
 * @returns {Object} the new user.
 */
const createUser = async (username, auth0Id) => {
  const query = `
    INSERT INTO users_table (username, auth0_id)
    OUTPUT INSERTED.*
    VALUES (@param1, @param2);
  `;
  const params = [
    { name: "param1", type: sql.NVarChar, value: username },
    { name: "param2", type: sql.NVarChar, value: auth0Id },
  ];
  const { recordset } = await queryDatabase(query, params);
  return recordset[0];
};

/**
 * Removes users and related items, accounts and transactions.
 *
 * @param {string} userId the ID of the user to be deleted.
 */
const deleteUsers = async (userId) => {
  const query = `
    DELETE FROM users_table WHERE id = @param1;
  `;
  const params = [{ name: "param1", type: sql.Int, value: userId }];
  await queryDatabase(query, params);
};

/**
 * Retrieves a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object} a user.
 */
const retrieveUserById = async (userId) => {
  const query = `
    SELECT * FROM users_table WHERE id = @param1;
  `;
  const params = [{ name: "param1", type: sql.Int, value: userId }];
  const { recordset } = await queryDatabase(query, params);
  return recordset[0];
};

/**createUser
 * Retrieves a single user.
 *
 * @param {string} auth0Id the Auth0 ID of the user.
 * @returns {Object} a single user.
 */
const retrieveUserByUsername = async (auth0Id) => {
  const query = `
    SELECT * FROM users_table WHERE auth0_id = @param1;
  `;
  const params = [{ name: "param1", type: sql.NVarChar, value: auth0Id }];
  const { recordset: users } = await queryDatabase(query, params);
  return users[0];
};

/**
 * Retrieves all users.
 *
 * @returns {Object[]} an array of users.
 */
const retrieveUsers = async () => {
  const query = `
    SELECT * FROM users_table;
  `;
  const { recordset: users } = await queryDatabase(query);
  return users;
};

// For transaction assets
const retrieveTransactionAssetsByUserId = async (userId) => {
  const query = `
  
SELECT t.id, t.account_id, t.category, t.amount, t.created_at, a.type
FROM [DolfinDB].[dbo].[transactions_table] t
JOIN [DolfinDB].[dbo].[accounts_table] a ON t.account_id = a.id
JOIN [DolfinDB].[dbo].[items_table] i ON a.item_id = i.id
WHERE i.user_id = @param1
  AND a.type IN ('depository', 'investment')
  ORDER BY created_at DESC;
  `;
  const params = [{ name: "param1", type: sql.Int, value: userId }];
  const { recordset: transactions } = await queryDatabase(query, params);
  return transactions;
};

// For transaction liabilities
const retrieveTransactionLiabilitiesByUserId = async (userId) => {
  const query = `
    SELECT t.id, t.account_id, t.category, t.amount, t.created_at, a.type
    FROM [DolfinDB].[dbo].[transactions_table] t
    JOIN [DolfinDB].[dbo].[accounts_table] a ON t.account_id = a.id
    JOIN [DolfinDB].[dbo].[items_table] i ON a.item_id = i.id
    WHERE i.user_id = @param1
      AND a.type IN ('loan', 'credit')
      ORDER BY created_at DESC;

  `;
  const params = [{ name: "param1", type: sql.Int, value: userId }];
  const { recordset: transactions } = await queryDatabase(query, params);
  return transactions;
};

module.exports = {
  createUser,
  deleteUsers,
  retrieveUserById,
  retrieveUserByUsername,
  retrieveUsers,
  retrieveTransactionAssetsByUserId,
  retrieveTransactionLiabilitiesByUserId,
};
