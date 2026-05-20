const router = require('express').Router();
const { runQuery, getAll } = require('../database/connection');
const auth = require('../middleware/auth');
router.use(auth);

// --- Allergies ---
router.get('/allergies', (req, res) => res.json(getAll('SELECT * FROM allergies WHERE user_id = ?', [req.userId])));
router.post('/allergies', (req, res) => {
  const { name, severity, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const r = runQuery('INSERT INTO allergies (user_id, name, severity, notes) VALUES (?,?,?,?)', [req.userId, name, severity || 'moderate', notes||null]);
  res.status(201).json({ id: r.lastInsertRowid, ...req.body });
});
router.put('/allergies/:id', (req, res) => {
  const { name, severity, notes } = req.body;
  runQuery('UPDATE allergies SET name=COALESCE(?,name), severity=COALESCE(?,severity), notes=COALESCE(?,notes) WHERE id=? AND user_id=?',
    [name||null, severity||null, notes||null, parseInt(req.params.id), req.userId]);
  res.json({ success: true });
});
router.delete('/allergies/:id', (req, res) => { runQuery('DELETE FROM allergies WHERE id=? AND user_id=?', [parseInt(req.params.id), req.userId]); res.json({ success: true }); });

// --- Conditions ---
router.get('/conditions', (req, res) => res.json(getAll('SELECT * FROM medical_conditions WHERE user_id = ?', [req.userId])));
router.post('/conditions', (req, res) => {
  const { name, diagnosed_date, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const r = runQuery('INSERT INTO medical_conditions (user_id, name, diagnosed_date, notes) VALUES (?,?,?,?)', [req.userId, name, diagnosed_date||null, notes||null]);
  res.status(201).json({ id: r.lastInsertRowid, ...req.body });
});
router.put('/conditions/:id', (req, res) => {
  const { name, diagnosed_date, notes } = req.body;
  runQuery('UPDATE medical_conditions SET name=COALESCE(?,name), diagnosed_date=COALESCE(?,diagnosed_date), notes=COALESCE(?,notes) WHERE id=? AND user_id=?',
    [name||null, diagnosed_date||null, notes||null, parseInt(req.params.id), req.userId]);
  res.json({ success: true });
});
router.delete('/conditions/:id', (req, res) => { runQuery('DELETE FROM medical_conditions WHERE id=? AND user_id=?', [parseInt(req.params.id), req.userId]); res.json({ success: true }); });

// --- Emergency Contacts ---
router.get('/emergency-contacts', (req, res) => res.json(getAll('SELECT * FROM emergency_contacts WHERE user_id = ? ORDER BY is_primary DESC', [req.userId])));
router.post('/emergency-contacts', (req, res) => {
  const { name, phone, relationship, is_primary } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
  const r = runQuery('INSERT INTO emergency_contacts (user_id, name, phone, relationship, is_primary) VALUES (?,?,?,?,?)', [req.userId, name, phone, relationship||null, is_primary ? 1 : 0]);
  res.status(201).json({ id: r.lastInsertRowid, ...req.body });
});
router.put('/emergency-contacts/:id', (req, res) => {
  const { name, phone, relationship, is_primary } = req.body;
  runQuery('UPDATE emergency_contacts SET name=COALESCE(?,name), phone=COALESCE(?,phone), relationship=COALESCE(?,relationship), is_primary=COALESCE(?,is_primary) WHERE id=? AND user_id=?',
    [name||null, phone||null, relationship||null, is_primary !== undefined ? (is_primary ? 1 : 0) : null, parseInt(req.params.id), req.userId]);
  res.json({ success: true });
});
router.delete('/emergency-contacts/:id', (req, res) => { runQuery('DELETE FROM emergency_contacts WHERE id=? AND user_id=?', [parseInt(req.params.id), req.userId]); res.json({ success: true }); });

module.exports = router;
