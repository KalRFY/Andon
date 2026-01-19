const { Sequelize } = require('sequelize');

const mariadbSequelize = new Sequelize('db_myopc_client', 'administrator', 'Toyota123456', {
  host: '10.70.20.253',
  port: 3306,
  dialect: 'mariadb',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = mariadbSequelize;
