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
  read_meters,
  return_mr,
  return_consumption,
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
    const [rows, fields] = await db.query(read_tenants);
    console.log(rows);
    console.log(fields);
    res.json(rows);
  } catch (err) {
    res.status(400).send("Error in query. Check console");
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
      const [rows, fields] = await db.execute(get_one_tenant(id));
      res.json(rows);
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
      await db.query(new_tenant(newPerson));
      if (req.body.phoneno) {
        await db.query(phoneNumbers(tenantNumbers));
      }
      if (req.body.email) {
        await db.query(tenant_emails(tenantEmails));
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
// @route:   POST: /api/tenants/checkout/:tenant
// @desc:    Checkout tenant
// @access:  private
router.post(
  "/checkout/:tenant",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { tenant } = req.params;
    try {
      await db.query(checkout(tenant));
      res.json({ msg: "Tenant successfully checked out" });
    } catch (err) {
      res
        .status(400)
        .json({ msg: "Internal server error. Please check the console.." });
      console.log(err);
    }
  }
);
//
// @route:   POST: /api/tenants/readings/meter-reading
// @desc:    Meter Reading
// @access:  private
router.post(
  "/readings/meter-reading",
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    /*
    The object, req.body, will be an array of objects which will be mapped into the table meter_reading with the values: -tenancy_id*
            -mtr_reading
    -date_of_reading (auto) will be autogenerated here then sent to the database
    */
    try {
      const reply = await db.query(read_meters(req.body));

      if (reply[0].affectedRows === req.body.length) {
        res.json({
          success: true,
          msg: `Success! ${reply[0].affectedRows} rows added.`,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({
        error: "An internal server error occured. Please check console.",
      });
    }
  }
);
// @route:   GET: /api/tenants/readings/meter-reading
// @desc:    Return meter readings
// @access:  private
router.get(
  "/readings/meter-reading",
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const LastMonth = moment()
      .subtract(2, "months")
      .endOf("month")
      .format("YYYY-MM-DD");
    try {
      const [rows, fields] = await db.query(return_consumption, [LastMonth]);
      const readings = rows.filter(
        (row) =>
          moment(row.date_of_reading).format("YYYY-MM-DD") ===
          moment().format("YYYY-MM-DD")
      );
      res.json(readings);
    } catch (err) {
      res
        .status(400)
        .json({ msg: "Error with sql query. Please check console" });
      console.log(err);
    }
  }
);

// Export router
module.exports = router;
