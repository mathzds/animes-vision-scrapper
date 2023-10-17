const express = require("express");
const router = express.Router();
const { fetchEpisodes } = require("../../services/episodes/episodesService");

router.get("/api/episodes", async (req, res) => {
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

module.exports = router;
