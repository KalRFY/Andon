const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'blablabla';

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const generateLoginToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '5d' });
};

module.exports = {
  generateLoginToken,
  encryptPassword,
  comparePassword,
};
