const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'healthzone-jwt-secret-2024';

function generateToken(userId) {
  return jwt.sign({ userId }, SECRET, { expiresIn: '7d' });
}
function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { generateToken, verifyToken };
