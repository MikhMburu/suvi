const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const compile = require("./compileHBS");

module.exports = async (obj) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await compile("svinv", obj);

    await page.setContent(content);
    await page.emulateMediaType("print");
    await page.pdf({
      path: `mypdf.pdf`,
      format: "A4",
      printBackground: true,
    });

    console.log("Done....");
    await browser.close();
    //handlebars.compile("invoice");
    //process.exit();
  } catch (err) {
    console.log("PDF error... \n", err);
  }
};
