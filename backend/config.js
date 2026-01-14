// config.js - Shared configuration constants
require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret',
  PORT: process.env.PORT || 5000,
};