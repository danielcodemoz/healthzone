const router = require('express').Router();
const { runQuery, getOne } = require('../database/connection');
const auth = require('../middleware/auth');
router.use(auth);

router.get('/', (req, res) => {
  const settings = getOne('SELECT * FROM user_settings WHERE user_id = ?', [req.userId]);
  res.json(settings || { theme: 'light', notifications_enabled: 1, water_goal: 2000, reminder_interval: 60 });
});

router.put('/', (req, res) => {
  const { theme, notifications_enabled, water_goal, reminder_interval } = req.body;
  const existing = getOne('SELECT id FROM user_settings WHERE user_id = ?', [req.userId]);
  if (existing) {
    runQuery('UPDATE user_settings SET theme=COALESCE(?,theme), notifications_enabled=COALESCE(?,notifications_enabled), water_goal=COALESCE(?,water_goal), reminder_interval=COALESCE(?,reminder_interval) WHERE user_id=?',
      [theme||null, notifications_enabled??null, water_goal||null, reminder_interval||null, req.userId]);
  } else {
    runQuery('INSERT INTO user_settings (user_id, theme, notifications_enabled, water_goal, reminder_interval) VALUES (?,?,?,?,?)',
      [req.userId, theme || 'light', notifications_enabled ?? 1, water_goal || 2000, reminder_interval || 60]);
  }
  res.json({ success: true });
});

module.exports = router;
