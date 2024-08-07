const { connectToDatabase, queryDatabase } = require("../db");
const sql = require('mssql');

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
    { name: 'param1', type: sql.NVarChar, value: username },
    { name: 'param2', type: sql.NVarChar, value: auth0Id }
  ];
  const { recordset } = await queryDatabase(query, params);
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
  await queryDatabase(query, params);
};

/**
 * Retrieves a single user.
 *
 * @param {string} auth0Id the Auth0 ID of the user.
 * @returns {Object} a user.
 */
const retrieveUserByAuth0Id = async auth0Id => {
  const query = `
    SELECT * FROM users_table WHERE auth0_id = @param1;
  `;
  const params = [{ name: 'param1', type: sql.NVarChar, value: auth0Id }];
  const { recordset } = await queryDatabase(query, params);
  return recordset[0];
};

/**createUser
 * Retrieves a single user.
 *
 * @param {string} auth0Id the Auth0 ID of the user.
 * @returns {Object} a single user.
 */
const retrieveUserByUsername = async auth0Id => {
  const query = `
    SELECT * FROM users_table WHERE auth0_id = @param1;
  `;
  const params = [{ name: 'param1', type: sql.NVarChar, value: auth0Id }];
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

module.exports = {
  createUser,
  deleteUsers,
  retrieveUserByAuth0Id,
  retrieveUserByUsername,
  retrieveUsers,
};
