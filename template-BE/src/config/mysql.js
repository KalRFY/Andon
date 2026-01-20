const Sequelize = require('sequelize');
const { db } = require('./config');

const sequelize = new Sequelize(db.database, db.username, db.password, db);

module.exports = sequelize;
