const express = require("express");
const router = express.Router();
const { scrapeHomepage } = require("../../services/home/homeService");

router.get("/home", async (req, res) => {
  try {
    const result = await scrapeHomepage();

    if (result.error) {
      throw new Error(result.error);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
