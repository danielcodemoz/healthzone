const router = require('express').Router();
const { runQuery, getOne, getAll } = require('../database/connection');
const auth = require('../middleware/auth');
router.use(auth);

router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 30;
  res.json(getAll('SELECT * FROM heart_rate_logs WHERE user_id = ? ORDER BY recorded_at DESC LIMIT ?', [req.userId, limit]));
});

router.get('/stats', (req, res) => {
  const history = getAll("SELECT date(recorded_at) as date, AVG(bpm) as avg_bpm, MIN(bpm) as min_bpm, MAX(bpm) as max_bpm FROM heart_rate_logs WHERE user_id = ? AND recorded_at >= date('now', '-30 days') GROUP BY date(recorded_at) ORDER BY date", [req.userId]);
  const latest = getOne('SELECT bpm FROM heart_rate_logs WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 1', [req.userId]);
  res.json({ history, latest: latest?.bpm || null });
});

router.post('/', (req, res) => {
  const { bpm, note } = req.body;
  if (!bpm || bpm < 30 || bpm > 250) return res.status(400).json({ error: 'BPM must be between 30 and 250' });
  const result = runQuery('INSERT INTO heart_rate_logs (user_id, bpm, note) VALUES (?, ?, ?)', [req.userId, bpm, note || null]);
  res.status(201).json({ id: result.lastInsertRowid, bpm, note, recorded_at: new Date().toISOString() });
});

router.put('/:id', (req, res) => {
  const { bpm, note } = req.body;
  if (bpm && (bpm < 30 || bpm > 250)) return res.status(400).json({ error: 'BPM must be between 30 and 250' });
  runQuery('UPDATE heart_rate_logs SET bpm=COALESCE(?,bpm), note=COALESCE(?,note) WHERE id=? AND user_id=?',
    [bpm || null, note || null, parseInt(req.params.id), req.userId]);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  runQuery('DELETE FROM heart_rate_logs WHERE id=? AND user_id=?', [parseInt(req.params.id), req.userId]);
  res.json({ success: true });
});

module.exports = router;
