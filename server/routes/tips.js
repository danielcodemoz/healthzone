const router = require('express').Router();
const { getAll } = require('../database/connection');

router.get('/', (req, res) => {
  const category = req.query.category;
  const limit = parseInt(req.query.limit) || 5;
  let rows;
  if (category) {
    rows = getAll('SELECT * FROM health_tips WHERE category = ? ORDER BY RANDOM() LIMIT ?', [category, limit]);
  } else {
    rows = getAll('SELECT * FROM health_tips ORDER BY RANDOM() LIMIT ?', [limit]);
  }
  res.json(rows);
});

module.exports = router;
