
const { getPuppeteerPage } = require("../utils/puppeteerUtils");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { extractReviewsFromPage } = require("../utils/extractReviewsFromPage");
const { writeReviewsToTempFile, readAndCleanupTempFile } = require("../utils/reviewsTempStorage");

async function reviewsScraperController(req, res) {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });
  let browser;
  const tempDir = os.tmpdir();
  const tempFile = path.join(tempDir, `reviews_${crypto.randomBytes(8).toString('hex')}.json`);
  try {
    const result = await getPuppeteerPage(url);
    browser = result.browser;
    const page = result.page;
    let allReviews = [];
    let currentPage = 1;
    let keepScraping = true;
    let profileUrl = url;
    let totalPages = 0;
    if (!profileUrl.includes('/reviews')) {
      profileUrl = `${profileUrl}/reviews`;
    }
    writeReviewsToTempFile(tempFile, []);
    while (keepScraping) {
      let pageUrl = currentPage === 1 ? profileUrl : `${profileUrl}?page=${currentPage}`;
      await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const reviews = await page.evaluate(extractReviewsFromPage);
      if (reviews.length > 0) {
        allReviews = allReviews.concat(reviews);
        writeReviewsToTempFile(tempFile, allReviews);
        currentPage++;
        totalPages++;
      } else {
        keepScraping = false;
      }
    }
    await browser.close();
    const reviewsJson = readAndCleanupTempFile(tempFile, allReviews);
    if (!reviewsJson || reviewsJson.length === 0) {
      return res.status(404).json({ error: 'Reviews not found or invalid URL' });
    }
    res.json({
      totalReviews: reviewsJson.length,
      totalPages,
      reviews: reviewsJson,
    });
  } catch (err) {
    if (browser) {
      try { await browser.close(); } catch (closeErr) { /* ignore */ }
    }
    console.error('Reviews Scraper API error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews', details: err.message || String(err) });
  }
}

module.exports = { reviewsScraperController };
