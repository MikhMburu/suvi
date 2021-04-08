const fs = require("fs-extra");
const path = require("path");
const hbs = require("handlebars");

module.exports = async (template, data) => {
  const me = { name: "Michael N", house: 2 };
  const filePath = path.join(process.cwd(), `views/${template}.handlebars`);
  const html = await fs.readFile(filePath, "utf-8");

  return hbs.compile(html)(data);
};
// compile("invoice", me);
