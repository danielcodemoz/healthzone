const { getDb, runQuery, getOne, saveDb } = require('./connection');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  await getDb();
  const row = getOne('SELECT COUNT(*) as count FROM users');
  if (row && row.count > 0) return;

  const hash = bcrypt.hashSync('demo123', 10);
  const r = runQuery(
    'INSERT INTO users (name, username, password_hash, dob, height, weight, blood_type, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ['Alex Johnson', 'demo', hash, '1995-06-15', 175, 72, 'O+', 1]
  );
  const uid = r.lastInsertRowid;

  runQuery('INSERT INTO user_settings (user_id, theme, water_goal) VALUES (?, ?, ?)', [uid, 'light', 2000]);

  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const glasses = Math.floor(Math.random() * 5) + 3;
    for (let j = 0; j < glasses; j++) {
      runQuery('INSERT INTO water_intake (user_id, amount, date) VALUES (?, ?, ?)', [uid, 250, ds]);
    }
  }

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const bpm = Math.floor(Math.random() * 30) + 62;
    runQuery('INSERT INTO heart_rate_logs (user_id, bpm, recorded_at) VALUES (?, ?, ?)', [uid, bpm, d.toISOString()]);
  }

  const meds = [
    ['Vitamin D', '1000 IU', 'Daily', '08:00', 'Take with breakfast'],
    ['Omega-3', '1000mg', 'Daily', '08:00', 'Fish oil supplement'],
    ['Melatonin', '3mg', 'As needed', '22:00', 'Sleep support'],
  ];
  for (const [name, dosage, freq, time, notes] of meds) {
    runQuery('INSERT INTO medications (user_id, name, dosage, frequency, time, notes) VALUES (?,?,?,?,?,?)', [uid, name, dosage, freq, time, notes]);
  }

  runQuery('INSERT INTO allergies (user_id, name, severity, notes) VALUES (?,?,?,?)', [uid, 'Penicillin', 'severe', 'Causes anaphylaxis']);
  runQuery('INSERT INTO allergies (user_id, name, severity, notes) VALUES (?,?,?,?)', [uid, 'Peanuts', 'moderate', 'Causes hives']);
  runQuery('INSERT INTO medical_conditions (user_id, name, diagnosed_date, notes) VALUES (?,?,?,?)', [uid, 'Asthma', '2010-03-15', 'Mild, controlled with inhaler']);
  runQuery('INSERT INTO emergency_contacts (user_id, name, phone, relationship, is_primary) VALUES (?,?,?,?,?)', [uid, 'Sarah Johnson', '+1-555-0101', 'Spouse', 1]);
  runQuery('INSERT INTO emergency_contacts (user_id, name, phone, relationship, is_primary) VALUES (?,?,?,?,?)', [uid, 'Dr. Smith', '+1-555-0102', 'Primary Doctor', 0]);

  const nw = new Date(today); nw.setDate(nw.getDate() + 7);
  const nm = new Date(today); nm.setDate(nm.getDate() + 30);
  runQuery('INSERT INTO appointments (user_id, doctor_name, specialty, date, time, status) VALUES (?,?,?,?,?,?)', [uid, 'Dr. Emily Chen', 'General Practitioner', nw.toISOString().split('T')[0], '10:00', 'upcoming']);
  runQuery('INSERT INTO appointments (user_id, doctor_name, specialty, date, time, status) VALUES (?,?,?,?,?,?)', [uid, 'Dr. Michael Ross', 'Cardiologist', nm.toISOString().split('T')[0], '14:30', 'upcoming']);

  const tips = [
    ['hydration', 'Stay Hydrated', 'Drink at least 8 glasses of water daily to maintain energy levels and brain function.', 'droplets'],
    ['exercise', 'Move Every Hour', 'Take a 5-minute walk every hour. Regular movement reduces heart disease risk.', 'activity'],
    ['nutrition', 'Eat the Rainbow', 'Include colorful fruits and vegetables for diverse nutrients and antioxidants.', 'apple'],
    ['sleep', 'Sleep Hygiene', 'Maintain a consistent sleep schedule, even on weekends.', 'moon'],
    ['mental', 'Practice Mindfulness', 'Spend 10 minutes daily on meditation or deep breathing.', 'brain'],
    ['hydration', 'Morning Water', 'Start your day with warm water and lemon to kickstart metabolism.', 'sunrise'],
    ['exercise', 'Stretch Daily', 'Dedicate 10 minutes to stretching each morning for flexibility.', 'stretch-horizontal'],
    ['nutrition', 'Protein Balance', 'Include protein in every meal for muscle support and satiety.', 'beef'],
    ['sleep', 'Digital Sunset', 'Avoid screens 30 minutes before bed to protect melatonin production.', 'monitor-off'],
    ['mental', 'Gratitude Journal', 'Write three things you are grateful for daily to boost mood.', 'heart'],
  ];
  for (const [cat, title, content, icon] of tips) {
    runQuery('INSERT INTO health_tips (category, title, content, icon) VALUES (?,?,?,?)', [cat, title, content, icon]);
  }

  saveDb();
  console.log('✓ Database seeded (demo account: demo / demo123, admin)');
}

module.exports = { seedDatabase };
