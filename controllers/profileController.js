const { getPuppeteerPage } = require('../utils/puppeteerUtils');
const { scrapeProfileData } = require('../utils/profileUtils');

async function profileController(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });
  let browser;
  try {
    const result = await getPuppeteerPage(url);
    browser = result.browser;
    const html = await result.page.content();
    if (html.includes("Sorry, we can't find that page.")) {
      await browser.close();
      return res.status(404).json({ error: 'Profile not found or invalid URL' });
    }
    const profileData = await scrapeProfileData(result.page);
    await browser.close();
    if (!profileData || Object.values(profileData).every(v => v === null || v === '' || v === undefined)) {
      return res.status(404).json({ error: 'Profile not found or invalid URL' });
    }
    res.json(profileData);
  } catch (err) {
    if (browser) {
      try { await browser.close(); } catch (closeErr) { /* ignore */ }
    }
    console.error('Profile API error:', err);
    res.status(500).json({ error: 'Failed to fetch profile', details: err.message || String(err) });
  }
}

module.exports = { profileController };
