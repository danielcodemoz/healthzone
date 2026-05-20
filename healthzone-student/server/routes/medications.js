const router = require('express').Router();
const { runQuery, getAll } = require('../database/connection');
const auth = require('../middleware/auth');
router.use(auth);

router.get('/', (req, res) => res.json(getAll('SELECT * FROM medications WHERE user_id = ? ORDER BY created_at DESC', [req.userId])));

router.post('/', (req, res) => {
  const { name, dosage, frequency, time, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'Medication name is required' });
  const r = runQuery('INSERT INTO medications (user_id, name, dosage, frequency, time, notes) VALUES (?,?,?,?,?,?)', [req.userId, name, dosage||null, frequency||null, time||null, notes||null]);
  res.status(201).json({ id: r.lastInsertRowid, ...req.body });
});

router.put('/:id', (req, res) => {
  const { name, dosage, frequency, time, notes, active } = req.body;
  runQuery('UPDATE medications SET name=COALESCE(?,name), dosage=COALESCE(?,dosage), frequency=COALESCE(?,frequency), time=COALESCE(?,time), notes=COALESCE(?,notes), active=COALESCE(?,active) WHERE id=? AND user_id=?',
    [name||null, dosage||null, frequency||null, time||null, notes||null, active??null, parseInt(req.params.id), req.userId]);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  runQuery('DELETE FROM medications WHERE id=? AND user_id=?', [parseInt(req.params.id), req.userId]);
  res.json({ success: true });
});

module.exports = router;
