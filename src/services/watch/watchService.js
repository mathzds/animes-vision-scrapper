const puppeteer = require('puppeteer');

async function extractAniscDetail(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const customHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
  };

  await page.setExtraHTTPHeaders(customHeaders);

  const capturedRequests = new Set();

  page.on('request', (request) => {
    capturedRequests.add(request.url());
  });

  await page.goto(url, { timeout: 30000 });

  await browser.close();

  const filteredUrls = Array.from(capturedRequests).filter(url => url.includes('https://cdn-2.tanoshi.digital'));

  return filteredUrls;
}

module.exports = {
  extractAniscDetail,
};
