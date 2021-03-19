// Import libraries
const express = require("express");
const passport = require("passport");
// Import files and functions
const db = require("../../config/db");
const { read_tenants } = require("../../config/sql-functions");
require("../../config/passport")(passport);
// Define variables and functions
const router = express.Router();
// Define routes
// ----------------
//
// @route:   POST: /api/tenants
// @desc:    List all current tenants
// @access:  public
router.get("/", async (req, res) => {
  try {
    const result = await db.promise().query(read_tenants);
    res.json(result[0]);
  } catch (err) {
    console.log(err);
  }
});

//
// @route:   POST: /api/users/register
// @desc:    Return one tenant by id
// @access:  private
//
// @route:   POST: /api/users/register
// @desc:    Checkin tenant
// @access:  private
//
// @route:   POST: /api/users/register
// @desc:    Edit tenant
// @access:  private
//
// @route:   POST: /api/users/register
// @desc:    Checkout tenant
// @access:  private
//
// Export router
module.exports = router;
