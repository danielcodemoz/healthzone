const router = require('express').Router();
const { runQuery, getOne, getAll } = require('../database/connection');
const auth = require('../middleware/auth');
router.use(auth);

router.get('/', (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  const rows = getAll('SELECT * FROM water_intake WHERE user_id = ? AND date = ? ORDER BY created_at DESC', [req.userId, date]);
  const total = rows.reduce((s, r) => s + r.amount, 0);
  const settings = getOne('SELECT water_goal FROM user_settings WHERE user_id = ?', [req.userId]);
  res.json({ entries: rows, total, goal: settings?.water_goal || 2000 });
});

router.get('/stats', (req, res) => {
  const rows = getAll("SELECT date, SUM(amount) as total FROM water_intake WHERE user_id = ? AND date >= date('now', '-7 days') GROUP BY date ORDER BY date", [req.userId]);
  res.json(rows);
});

router.post('/', (req, res) => {
  const amount = req.body.amount || 250;
  const date = req.body.date || new Date().toISOString().split('T')[0];
  const result = runQuery('INSERT INTO water_intake (user_id, amount, date) VALUES (?, ?, ?)', [req.userId, amount, date]);
  res.status(201).json({ id: result.lastInsertRowid, amount, date });
});

router.delete('/:id', (req, res) => {
  runQuery('DELETE FROM water_intake WHERE id = ? AND user_id = ?', [parseInt(req.params.id), req.userId]);
  res.json({ success: true });
});

module.exports = router;
