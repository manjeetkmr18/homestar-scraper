const puppeteer = require('puppeteer');

// Check for JSON mode at the module level
const isJsonOnly = process.argv.includes('--json');

async function launchBrowser() {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu',
                '--js-flags=--max-old-space-size=2048',
                '--memory-pressure-off'
            ],
            timeout: 60000
        });
        return browser;
    } catch (error) {
        throw error;
    }
}

async function configurePage(page) {
    try {
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        );
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'navigate'
        });
        await page.setViewport({ width: 1280, height: 800 });
    } catch (error) {
        throw error;
    }
}

module.exports = { launchBrowser, configurePage };
