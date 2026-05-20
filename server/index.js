const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { initDatabase } = require('./database/init');
const { seedDatabase } = require('./database/seed');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/water', require('./routes/water'));
app.use('/api/heart-rate', require('./routes/heartRate'));
app.use('/api/medications', require('./routes/medications'));
app.use('/api/medical', require('./routes/medical'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/tips', require('./routes/tips'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/settings', require('./routes/settings'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

const distPath = path.join(__dirname, '..', 'client', 'dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use(errorHandler);

// Initialize and start
async function start() {
  await initDatabase();
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`\n  HealthZone API running on http://localhost:${PORT}\n`);
  });
}

start().catch(console.error);
