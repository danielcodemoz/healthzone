const router = require('express').Router();
const { runQuery, getAll } = require('../database/connection');
const auth = require('../middleware/auth');
router.use(auth);

router.get('/', (req, res) => res.json(getAll('SELECT * FROM appointments WHERE user_id = ? ORDER BY date ASC', [req.userId])));

router.post('/', (req, res) => {
  const { doctor_name, specialty, date, time, notes } = req.body;
  if (!doctor_name || !date) return res.status(400).json({ error: 'Doctor name and date required' });
  const r = runQuery('INSERT INTO appointments (user_id, doctor_name, specialty, date, time, notes) VALUES (?,?,?,?,?,?)', [req.userId, doctor_name, specialty||null, date, time||null, notes||null]);
  res.status(201).json({ id: r.lastInsertRowid, ...req.body, status: 'upcoming' });
});

router.put('/:id', (req, res) => {
  const { status, notes } = req.body;
  runQuery('UPDATE appointments SET status=COALESCE(?,status), notes=COALESCE(?,notes) WHERE id=? AND user_id=?', [status||null, notes||null, parseInt(req.params.id), req.userId]);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  runQuery('DELETE FROM appointments WHERE id=? AND user_id=?', [parseInt(req.params.id), req.userId]);
  res.json({ success: true });
});

module.exports = router;
