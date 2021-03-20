/*
This is a route administrators. It therefore deals with authentication of persons allowed to use this management information system
*/
// Import libraries
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
// Import files
const db = require("../../config/db");
const {
  register_user,
  return_user,
  delete_admin,
  return_full_user,
  get_admins,
} = require("../../config/sql-functions");
const { secretKey } = require("../../config/keys");
require("../../config/passport")(passport);
// Define variables and functions
const router = express.Router();
// Define routes

// -------------------------------
// ----Register new user
// @route:   POST: /api/users/register
// @desc:    Register a new user and give them privileges
// @access:  private
/* Variables: Admins
    -_id
    -username
    -pswd
    -designation
*/
router.post("/register", async (req, res) => {
  const newUser = {
    id: req.body.id,
    username: req.body.username,
    pswd: req.body.pswd,
    designation: req.body.designation,
  };
  //  Hash Password
  try {
    bcrypt.genSalt(15, (err, salt) => {
      bcrypt.hash(newUser.pswd, salt, async (err, hash) => {
        if (err) throw err;
        newUser.pswd = hash;
        const result = await db.promise().query(register_user(newUser));

        await res.json({ success: "New User registered", result });
      });
    });
  } catch (err) {
    res.status(400).json({ badrequest: "Sorry, something went wrong.." });
    console.log(err);
  }
});
// -------------------------------
// ----Log In user
// @route:   POST: /api/users/login
// @desc:    Log in user
// @access:  public
/* Variables: Admins
    -username
    -pswd
*/
router.post("/login", async (req, res) => {
  const errors = {};
  // const { username, pswd } = req.body;
  // Check whether username exists
  // try {
  const user = await db.promise().query(return_user(req.body.username));
  // res.json(user[0][0]);
  if (user[0][0] === undefined) {
    errors.username = "Username not found";
    return res.status(404).json(errors);
  } else {
    const { username, pswd, first_name, surname, designation } = user[0][0];
    bcrypt
      .compare(req.body.pswd, pswd)
      .then((isMatch) => {
        if (isMatch) {
          let fullName = `${first_name} ${surname}`;
          const payload = { username, fullName, designation };
          // res.json(payload);
          jwt.sign(payload, secretKey, { expiresIn: 86400 }, (err, token) => {
            if (err) {
              throw err;
            } else {
              res.json({
                success: true,
                token: `Bearer ${token}`,
              });
            }
          });
        } else {
          errors.pswd = "Wrong password.. Try again";
          res.status(400).json(errors);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

// -------------------------------
// Edit user
// @route:   POST: /api/users/:username
// @desc:    Edit details about the user. Several queries to be executed
// @access:  private
/* Variables: Admins
    -_id (person)
    -firstName (person)
    -surname (person)
    -user_email (email) []
    -phoneno (phone) []
    -username (admins)
    -pswd (admins)
    -nat_id (person)
*/
router.post("/:username", async (req, res) => {
  // TODO: Create the logic for the route
  res.send(`Retrieving username ${req.params.username}..`);
});

// -------------------------------
// List all Users
// @route:   GET: /api/user
// @desc:    Displays all users in the system
// @access:  private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await db.promise().query(get_admins);
      res.json(result[0]);
    } catch (err) {
      res.status(404).json({ msg: "No Admins found. Register new ones" });
    }
  }
);

// -------------------------------
// Get my page
// @route:   GET: /api/user/:username
// @desc:    Displays all users in the system
// @access:  private
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const me = await db.promise().query(return_full_user(req.user._id));
      res.json(me[0]);
    } catch (err) {
      res.status(400).send("Oops. Something went wrong. Check the console");
      console.log(err);
    }
  }
);

// Delete a user
// @route:   DELETE: /api/users/:id
// @desc:    Deletes a user from the MIS
// @access:  private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    //res.send(`Deleting ${req.params.id} from the system`);
    try {
      const result = await db.promise().query(delete_admin(req.params.id));
      res.json({ msg: "User successfully defeated" });
    } catch (err) {
      res.status(400).json({ msg: "Unable to delete record." });
    }
  }
);

// Export routes
module.exports = router;
