const db = require('../');
const sql = require('mssql');

/**
 * Creates a single property.
 *
 * @param {number} userId the ID of the user.
 * @param {string} description the description of the asset.
 * @param {number} value the value of the asset.
 * @returns {Object} the new property.
 */
const createAsset = async (userId, description, value) => {
  const query = `
    INSERT INTO assets_table
      (user_id, description, value)
    OUTPUT INSERTED.*
    VALUES
      (@param1, @param2, @param3);
  `;
  const params = [
    { name: 'param1', type: sql.Int, value: userId },
    { name: 'param2', type: sql.NVarChar, value: description },
    { name: 'param3', type: sql.Float, value: value },
  ];
  const { recordset } = await db.queryDatabase(query, params);
  return recordset[0];
};

/**
 * Retrieves all assets for a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object[]} an array of assets.
 */
const retrieveAssetsByUser = async userId => {
  const query = 'SELECT * FROM assets_table WHERE user_id = @param1';
  const params = [{ name: 'param1', type: sql.Int, value: userId }];
  const { recordset: assets } = await db.queryDatabase(query, params);
  return assets;
};

/**
 * Removes asset by asset id.
 *
 * @param {number} assetId the ID of the asset to be deleted.
 */
const deleteAssetByAssetId = async assetId => {
  const query = 'DELETE FROM assets_table WHERE id = @param1';
  const params = [{ name: 'param1', type: sql.Int, value: assetId }];
  await db.queryDatabase(query, params);
};

module.exports = {
  createAsset,
  retrieveAssetsByUser,
  deleteAssetByAssetId,
};
