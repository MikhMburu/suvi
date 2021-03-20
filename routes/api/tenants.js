// Import libraries
const express = require("express");
const passport = require("passport");
const moment = require("moment");
// Import files and functions
const db = require("../../config/db");
const isEmpty = require("../../utilities/isEmpty");
const {
  read_tenants,
  get_one_tenant,
  new_tenant,
  phoneNumbers,
  tenant_emails,
  checkout,
} = require("../../config/sql-functions");
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
// @route:   GET: /api/tenants/:tenant_id
// @desc:    Return one tenant by id
// @access:  private
router.get(
  "/:tenant_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = req.params.tenant_id;
    const errors = {};
    try {
      const tenant = await db.promise().query(get_one_tenant(id));
      if (isEmpty(tenant[0])) {
        errors.tenant = "No tenant found with that id";
        return res.status(404).json(errors);
      }
      res.json(tenant[0][0]);
    } catch (err) {
      res.status(400).json({
        msg: "An internal server error occured. Please check the console..",
        error: err,
      });
      console.log(err);
    }
  }
);
//
// @route:   POST: /api/tenants/checkin
// @desc:    Checkin tenant
// @access:  private
router.post(
  "/checkin",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    /*
  Several tables will be updated.
    -persons =>existing
    -phone []
    -email []
    -tenancy
  
    The tenant has to exist in the person table to be added as a tenant. This is to reduce the number of sql functions to be made.
    */
    //  Destructure the request object
    //const {tenant, hseno, checkin, rent} = req.body;
    let newPerson = {
      id: req.body.tenant,
      hseno: req.body.hseno,
      checkin: req.body.checkin,
      rent: req.body.rent,
    };
    let tenantNumbers = {
      tenant: req.body.tenant,
      phoneno: req.body.phoneno,
    };
    let tenantEmails = {
      tenant: req.body.tenant,
      email: req.body.email,
    };

    try {
      await db.promise().query(new_tenant(newPerson));
      if (req.body.phoneno) {
        await db.promise().query(phoneNumbers(tenantNumbers));
      }
      if (req.body.email) {
        await db.promise().query(tenant_emails(tenantEmails));
      }
      res.json({ msg: "Tenant successfully added." });
    } catch (err) {
      res.status(400).json({ msg: "Internal server error", err });
    }
  }
);
//
// @route:   POST: /api/users/register
// @desc:    Edit tenant
// @access:  private
//
// @route:   POST: /api/users/checkout/:tenant
// @desc:    Checkout tenant
// @access:  private
router.post(
  "/checkout/:tenant",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { tenant } = req.params;
    try {
      await db.promise().query(checkout(tenant));
      res.json({ msg: "Tenant successfully checked out" });
    } catch (err) {
      res
        .status(400)
        .json({ msg: "Internal server error. Please check the console.." });
    }
  }
);
//
// Export router
module.exports = router;
