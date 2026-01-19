const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');

// Check if SQLite is needed or use a different approach
let sequelize;

try {
  // Try to use SQLite if package is installed
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../db.sqlite'),
    logging: false
  });
} catch (error) {
  // Fallback to a mock or memory database if SQLite is not available
  console.warn('SQLite package not installed. Using in-memory database or fallback solution.');
  
  // Using a fallback approach with in-memory storage
  sequelize = new Sequelize('sqlite::memory:', {
    logging: false
  });
}

module.exports = sequelize;
