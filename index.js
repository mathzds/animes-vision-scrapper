const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors"); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); 

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
};

async function fetchEpisodes(baseUrl, pageNumber) {
  const pageUrl = `${baseUrl}?page=${pageNumber}`;
  try {
    console.log(`Buscando página ${pageNumber}: ${pageUrl}`);
    const response = await axios.get(pageUrl, { headers });
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
        return { pageNumber, data: [] };
      } else {
        return { pageNumber, data: itemLinks };
      }
    } else {
      console.error(`Erro ao buscar página ${pageNumber}: Status ${response.status}`);
      return { pageNumber, error: `Error: ${response.status}` };
    }
  } catch (error) {
    console.error(`Erro ao buscar página ${pageNumber}: ${error.message}`);
    return { pageNumber, error: `Error: ${error.message}` };
  }
}

app.get("/api/episodes", async (req, res) => {
  const baseUrl = req.query.url;
  const maxPages = req.query.maxPages || 32;

  if (!baseUrl) {
    res.status(400).json({ error: "Missing 'url' parameter" });
    return;
  }

  const promises = [];
  for (let pageNumber = 1; pageNumber <= maxPages; pageNumber++) {
    promises.push(fetchEpisodes(baseUrl, pageNumber));
  }

  try {
    const results = await Promise.all(promises);
    const allEpisodes = results.reduce((acc, result) => {
      if (result.error) {
        throw new Error(result.error);
      }
      return acc.concat(result.data);
    }, []);
    res.json(allEpisodes);
  } catch (error) {
    console.error(`Erro interno do servidor: ${error.message}`);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
