const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 3000; 

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
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

        if (href && href.includes("episodio")) {
          itemLinks.push({ href, title });
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

app.get("/api/episodes", async (req, res) => {
  const baseUrl = req.query.url;

  if (!baseUrl) {
    res.status(400).json({ error: "Missing 'url' parameter" });
    return;
  }

  try {
    const result = await fetchEpisodes(baseUrl);
    
    if (result.error) {
      throw new Error(result.error);
    }

    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
