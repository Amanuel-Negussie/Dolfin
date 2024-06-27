const db = require('../');
const sql = require('mssql');

/**
 * Creates a single user.
 *
 * @param {string} username the username of the user.
 * @returns {Object} the new user.
 */
const createUser = async username => {
  const query = `
    INSERT INTO users_table (username)
    OUTPUT INSERTED.*
    VALUES (@param1);
  `;
  const params = [{ name: 'param1', type: sql.NVarChar, value: username }];
  const { recordset } = await db.queryDatabase(query, params);
  return recordset[0];
};

/**
 * Removes users and related items, accounts and transactions.
 *
 * @param {string} userId the ID of the user to be deleted.
 */
const deleteUsers = async userId => {
  const query = `
    DELETE FROM users_table WHERE id = @param1;
  `;
  const params = [{ name: 'param1', type: sql.Int, value: userId }];
  await db.queryDatabase(query, params);
};

/**
 * Retrieves a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object} a user.
 */
const retrieveUserById = async userId => {
  const query = `
    SELECT * FROM users_table WHERE id = @param1;
  `;
  const params = [{ name: 'param1', type: sql.Int, value: userId }];
  const { recordset } = await db.queryDatabase(query, params);
  return recordset[0];
};

/**
 * Retrieves a single user.
 *
 * @param {string} username the username to search for.
 * @returns {Object} a single user.
 */
const retrieveUserByUsername = async username => {
  const query = `
    SELECT * FROM users_table WHERE username = @param1;
  `;
  const params = [{ name: 'param1', type: sql.NVarChar, value: username }];
  const { recordset: users } = await db.queryDatabase(query, params);
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
  const { recordset: users } = await db.queryDatabase(query);
  return users;
};

module.exports = {
  createUser,
  deleteUsers,
  retrieveUserById,
  retrieveUserByUsername,
  retrieveUsers,
};
