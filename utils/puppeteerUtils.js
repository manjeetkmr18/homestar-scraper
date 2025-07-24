const { launchBrowser, configurePage } = require('./browserUtils');

async function getPuppeteerPage(url) {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await configurePage(page);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return { page, browser };
}

module.exports = { getPuppeteerPage };
