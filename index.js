// Import libraries
const express = require("express");
const cors = require("cors");
// Import files
const db = require("./config/db");
const users = require("./routes/api/users");
const tenant = require("./routes/api/tenants");
// const read_tenants = require("./config/sql-functions");
// Define variables
const app = express();
const port = process.env.PORT || 5000;
// Define middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", users);
app.use("/api/tenants", tenant);
// Define functions
db.connect(() => {
  console.log("suvimis database connected..");
});
// Define routes
app.get("/", async (req, res) => {
  // res.send("Welcome to SUVIMIS MySQL version");
  // const sqlQuery = "select * from relationships"
  try {
    const result = await db.promise().query(read_tenants);
    res.json(result[0]);
  } catch (err) {
    console.log(err);
  }
});
// Listen on port 5000
app.listen(port, () => {
  console.log(`MIS running on port ${port}`);
});
