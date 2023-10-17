// Dependências
// Ala, usa commonjs kkkkkkkkkkkkkkk
const express = require("express");
const { port } = require("./config/config");
const app = express();
const router = express.Router();

const episodesService = require("./services/episodes/episodesService");
const homeService = require("./services/home/homeService");
const searchService = require("./services/search/searchService");
const watchService = require("./services/watch/watchService");

const errorHandler = (res, error) => {
  res.status(500).json({ error: error.message });
};
// Rota episodes
router.get("/episodes", async (req, res) => {
  const baseUrl = req.query.url;

  if (!baseUrl) {
    res.status(400).json({ error: "Missing 'url' parameter" });
    return;
  }

  try {
    const result = await episodesService.fetchEpisodes(baseUrl);

    if (result.error) {
      throw new Error(result.error);
    }

    res.json(result.data);
  } catch (error) {
    errorHandler(res, error);
  }
});
// Rota home
router.get("/home", async (req, res) => {
  try {
    const result = await homeService.scrapeHomepage();

    if (result.error) {
      throw result.error;
    }

    res.json(result);
  } catch (error) {
    errorHandler(res, error);
  }
});
// Rota search
router.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.nome;

    if (!searchTerm) {
      res.status(400).json({ error: "Missing search term" });
      return;
    }

    const searchResults = await searchService.performSearch(searchTerm);
    res.json(searchResults);
  } catch (error) {
    errorHandler(res, error);
  }
});
// Rota vídeo
router.get("/video", async (req, res) => {
  try {
    const videoUrl = req.query.url;

    if (!videoUrl) {
      res.status(400).json({ error: "Missing url term" });
      return;
    }

    const videoDetails = await watchService.extractAniscDetail(videoUrl);
    res.json(videoDetails);
  } catch (error) {
    errorHandler(res, error);
  }
});
// App
app.use("/api", router);
// Hostear
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
