const axios = require("axios");
const cheerio = require("cheerio");

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
  "DNT": "1",
};

async function fetchEpisodes(baseUrl) {
  try {
    const response = await axios.get(baseUrl, { headers });
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);

      const itemLinks = [];
      $(".screen-item-thumbnail").each((index, element) => {
        const href = $(element).attr("href");
        const title = $(element)
          .siblings(".screen-item-info")
          .find("h3.sii-title")
          .text();
        const imgSrc = $(element).find("img.sit-img").attr("src");

        if (href && href.includes("episodio")) {
          itemLinks.push({ href, title, imgSrc });
        }
      });

      if (itemLinks.length === 0) {
        return { data: [] };
      } else {
        return { data: itemLinks };
      }
    } else {
      return { error: `Error: ${response.status}` };
    }
  } catch (error) {
    return { error: `Error: ${error.message}` };
  }
}

module.exports = { fetchEpisodes };
