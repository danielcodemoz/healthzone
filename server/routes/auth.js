const router = require('express').Router();
const { runQuery, getOne, getAll } = require('../database/connection');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const auth = require('../middleware/auth');

// Register - simple username + password
router.post('/register', (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) return res.status(400).json({ error: 'Name, username, and password are required' });
  if (password.length < 4) return res.status(400).json({ error: 'Password must be at least 4 characters' });
  if (username.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters' });
  const existing = getOne('SELECT id FROM users WHERE username = ?', [username.toLowerCase()]);
  if (existing) return res.status(409).json({ error: 'Username already taken' });
  const hash = bcrypt.hashSync(password, 10);
  const result = runQuery('INSERT INTO users (name, username, password_hash) VALUES (?, ?, ?)', [name, username.toLowerCase(), hash]);
  runQuery('INSERT INTO user_settings (user_id) VALUES (?)', [result.lastInsertRowid]);
  const token = generateToken(result.lastInsertRowid);
  const user = getOne('SELECT id, name, username, avatar, dob, height, weight, blood_type, is_admin, created_at FROM users WHERE id = ?', [result.lastInsertRowid]);
  res.status(201).json({ token, user });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const user = getOne('SELECT * FROM users WHERE username = ?', [username.toLowerCase()]);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'Invalid credentials' });
  const token = generateToken(user.id);
  const { password_hash, ...safe } = user;
  res.json({ token, user: safe });
});

// Get current user
router.get('/me', auth, (req, res) => {
  const user = getOne('SELECT id, name, username, avatar, dob, height, weight, blood_type, is_admin, created_at FROM users WHERE id = ?', [req.userId]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update profile
router.put('/update', auth, (req, res) => {
  const { name, dob, height, weight, blood_type, avatar } = req.body;
  runQuery('UPDATE users SET name=COALESCE(?,name), dob=COALESCE(?,dob), height=COALESCE(?,height), weight=COALESCE(?,weight), blood_type=COALESCE(?,blood_type), avatar=COALESCE(?,avatar) WHERE id=?',
    [name||null, dob||null, height||null, weight||null, blood_type||null, avatar||null, req.userId]);
  const user = getOne('SELECT id, name, username, avatar, dob, height, weight, blood_type, is_admin, created_at FROM users WHERE id = ?', [req.userId]);
  res.json(user);
});

// Admin: List all users
router.get('/users', auth, (req, res) => {
  const admin = getOne('SELECT is_admin FROM users WHERE id = ?', [req.userId]);
  if (!admin || !admin.is_admin) return res.status(403).json({ error: 'Admin access required' });
  const users = getAll('SELECT id, name, username, is_admin, created_at FROM users ORDER BY created_at DESC');
  res.json(users);
});

// Admin: Delete user
router.delete('/users/:id', auth, (req, res) => {
  const admin = getOne('SELECT is_admin FROM users WHERE id = ?', [req.userId]);
  if (!admin || !admin.is_admin) return res.status(403).json({ error: 'Admin access required' });
  const targetId = parseInt(req.params.id);
  if (targetId === req.userId) return res.status(400).json({ error: 'Cannot delete your own account' });
  // Delete all user data
  runQuery('DELETE FROM water_intake WHERE user_id = ?', [targetId]);
  runQuery('DELETE FROM heart_rate_logs WHERE user_id = ?', [targetId]);
  runQuery('DELETE FROM medications WHERE user_id = ?', [targetId]);
  runQuery('DELETE FROM allergies WHERE user_id = ?', [targetId]);
  runQuery('DELETE FROM medical_conditions WHERE user_id = ?', [targetId]);
  runQuery('DELETE FROM emergency_contacts WHERE user_id = ?', [targetId]);
  runQuery('DELETE FROM appointments WHERE user_id = ?', [targetId]);
  runQuery('DELETE FROM user_settings WHERE user_id = ?', [targetId]);
  runQuery('DELETE FROM users WHERE id = ?', [targetId]);
  res.json({ success: true });
});

module.exports = router;
