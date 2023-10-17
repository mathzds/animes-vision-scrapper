const axios = require('axios');
const cheerio = require('cheerio');

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
  "DNT": "1",
};

async function performSearch(searchTerm) {
    try {
        const searchUrl = `https://animes.vision/search?nome=${encodeURIComponent(searchTerm)}`;
        const response = await axios.get(searchUrl, { headers });
        const $ = cheerio.load(response.data);

        const results = $('div.flw-item').map((index, element) => {
            const title = $(element).find('a.dynamic-name').text();
            const link = $(element).find('a.film-poster-ahref').attr('href');
            const type = $(element).find('.fdi-item').first().text();
            const duration = $(element).find('.fdi-duration').text();
            const coverImage = $(element).find('img.film-poster-img').attr('data-src');
            const episodes = $(element).find('.tick-eps').text().trim();
            const language = $(element).find('.tick-dub').text().trim();

            return { title, link, type, duration, coverImage, episodes, language };
        }).get();

        return { results };
    } catch (error) {
        console.error(error);
        return { error: 'An error occurred while fetching the data.' };
    }
}

module.exports = { performSearch };
