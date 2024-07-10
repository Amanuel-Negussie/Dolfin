const { connectToDatabase, queryDatabase } = require("../db");
const sql = require('mssql');

/**
 * Creates a single Plaid api event log entry.
 *
 * @param {string} itemId the item id in the request.
 * @param {string} userId the user id in the request.
 * @param {string} plaidMethod the Plaid client method called.
 * @param {Array} clientMethodArgs the arguments passed to the Plaid client method.
 * @param {Object} response the Plaid api response object.
 */
const createPlaidApiEvent = async (
  itemId,
  userId,
  plaidMethod,
  clientMethodArgs,
  response
) => {
  const {
    error_code: errorCode,
    error_type: errorType,
    request_id: requestId,
  } = response;
  const query = `
      INSERT INTO plaid_api_events_table
        (
          item_id,
          user_id,
          plaid_method,
          arguments,
          request_id,
          error_type,
          error_code
        )
      VALUES
        (@param1, @param2, @param3, @param4, @param5, @param6, @param7);
    `;
  const params = [
    { name: 'param1', type: sql.NVarChar, value: itemId },
    { name: 'param2', type: sql.NVarChar, value: userId },
    { name: 'param3', type: sql.NVarChar, value: plaidMethod },
    { name: 'param4', type: sql.NVarChar, value: JSON.stringify(clientMethodArgs) },
    { name: 'param5', type: sql.NVarChar, value: requestId },
    { name: 'param6', type: sql.NVarChar, value: errorType },
    { name: 'param7', type: sql.NVarChar, value: errorCode },
  ];
  await queryDatabase(query, params);
};

module.exports = {
  createPlaidApiEvent,
};
