
const express = require('express');
const { performSearch } = require('../../services/search/searchService'); 

const router = express.Router();

router.get('/api/search', async (req, res) => {
  try {
    const searchTerm = req.query.nome;

    if (!searchTerm) {
      res.status(400).json({ error: 'Missing search term' });
      return;
    }

    const searchResults = await performSearch(searchTerm);
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
