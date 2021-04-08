const moment = require("moment");

const last_month = moment().startOf("month").format("Do MMMM, YYYY");
const dateTo = moment()
  .subtract(1, "months")
  .endOf("month")
  .format("Do MMMM, YYYY");
const dateFrom = moment()
  .subtract(1, "months")
  .startOf("month")
  .format("Do MMMM, YYYY");

console.log(moment("2021-03-15").isAfter("2021-03-01"));

const aDate = moment("2020-01-01", "YYYY-MM-DD").format("Do MMMM, YYYY");
console.log(last_month);
console.log(dateFrom, " to ", dateTo);
console.log(aDate);
