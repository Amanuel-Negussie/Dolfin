/**
 * @file Defines all routes for the Users route.
 */

const express = require('express');
const { retrieveUserByUsername } = require('../db/queries');
const { asyncWrapper } = require('../middleware');
const { sanitizeUsers } = require('../util');

const router = express.Router();

/**
 * Retrieves user information for a single user.
 *
 * @param {string} auth0Id the Auth0 ID of the user.
 * @returns {Object[]} an array containing a single user.
 */
router.post(
  '/',
  asyncWrapper(async (req, res) => {
    const { auth0Id } = req.body;
    const user = await retrieveUserByUsername(auth0Id);
    if (user != null) {
      console.log(`User ${user.username}`)
      res.json(sanitizeUsers(user));
    } else {
      console.log('User not found')
      res.json(null);
    }
  })
);

module.exports = router;