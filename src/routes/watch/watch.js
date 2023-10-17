const express = require('express');
const { extractAniscDetail } = require('../../services/watch/watchService'); 

const router = express.Router();

router.get('/api/video', async (req, res) => {
  try {
    const videoUrl = req.query.url;

    if (!videoUrl) {
      res.status(400).json({ error: 'Missing url term' });
      return;
    }

    const searchResults = await extractAniscDetail(videoUrl);
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
