const db = require('..');
const sql = require('mssql');

/**
 * Creates a link event.
 *
 * @param {Object} event the link event.
 * @param {string} event.userId the ID of the user.
 * @param {string} event.type displayed as 'success' or 'exit' based on the callback.
 * @param {string} event.link_session_id the session ID created when connecting with link.
 * @param {string} event.request_id the request ID created only on error when connecting with link.
 * @param {string} event.error_type a broad categorization of the error.
 * @param {string} event.error_code a specific code that is a subset of the error_type.
 * @param {string} event.status the status of the link event.
 */
const createLinkEvent = async ({
  type,
  userId,
  link_session_id: linkSessionId,
  request_id: requestId,
  error_type: errorType,
  error_code: errorCode,
  status,
}) => {
  const query = `
      INSERT INTO link_events_table
        (
          type,
          user_id,
          link_session_id,
          request_id,
          error_type,
          error_code,
          status
        )
      VALUES (@param1, @param2, @param3, @param4, @param5, @param6, @param7);
    `;
  const params = [
    { name: 'param1', type: sql.NVarChar, value: type },
    { name: 'param2', type: sql.NVarChar, value: userId },
    { name: 'param3', type: sql.NVarChar, value: linkSessionId },
    { name: 'param4', type: sql.NVarChar, value: requestId },
    { name: 'param5', type: sql.NVarChar, value: errorType },
    { name: 'param6', type: sql.NVarChar, value: errorCode },
    { name: 'param7', type: sql.NVarChar, value: status },
  ];
  await db.queryDatabase(query, params);
};

module.exports = {
  createLinkEvent,
};
