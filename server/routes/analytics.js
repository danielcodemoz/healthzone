const router = require('express').Router();
const { getOne, getAll } = require('../database/connection');
const auth = require('../middleware/auth');
router.use(auth);

router.get('/overview', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const waterToday = getOne('SELECT COALESCE(SUM(amount),0) as total FROM water_intake WHERE user_id=? AND date=?', [req.userId, today]);
  const waterGoal = getOne('SELECT water_goal FROM user_settings WHERE user_id=?', [req.userId]);
  const latestHR = getOne('SELECT bpm FROM heart_rate_logs WHERE user_id=? ORDER BY recorded_at DESC LIMIT 1', [req.userId]);
  const medsCount = getOne('SELECT COUNT(*) as count FROM medications WHERE user_id=? AND active=1', [req.userId]);
  const user = getOne('SELECT height, weight FROM users WHERE id=?', [req.userId]);

  let bmi = null;
  if (user?.height && user?.weight) bmi = +(user.weight / ((user.height / 100) ** 2)).toFixed(1);

  let streak = 0;
  const goal = waterGoal?.water_goal || 2000;
  const d = new Date();
  while (streak < 365) {
    const ds = d.toISOString().split('T')[0];
    const intake = getOne('SELECT COALESCE(SUM(amount),0) as total FROM water_intake WHERE user_id=? AND date=?', [req.userId, ds]);
    if (intake && intake.total >= goal * 0.7) { streak++; d.setDate(d.getDate() - 1); } else break;
  }

  const score = Math.min(100, Math.round(((waterToday?.total || 0) / goal) * 40 + (latestHR ? 30 : 0) + (bmi && bmi >= 18.5 && bmi <= 25 ? 30 : 15)));

  res.json({
    water: { total: waterToday?.total || 0, goal },
    heartRate: latestHR?.bpm || null,
    bmi, activeMeds: medsCount?.count || 0, streak, healthScore: score
  });
});

router.get('/weekly', (req, res) => {
  const water = getAll("SELECT date, SUM(amount) as total FROM water_intake WHERE user_id=? AND date >= date('now','-7 days') GROUP BY date ORDER BY date", [req.userId]);
  const hr = getAll("SELECT date(recorded_at) as date, ROUND(AVG(bpm)) as avg_bpm FROM heart_rate_logs WHERE user_id=? AND recorded_at >= date('now','-7 days') GROUP BY date(recorded_at) ORDER BY date", [req.userId]);
  res.json({ water, heartRate: hr });
});

module.exports = router;
