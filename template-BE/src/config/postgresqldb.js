const { Sequelize } = require('sequelize');

const postgresqlSequelize = new Sequelize('tpm_system', 'postgres', 'postgres', {
  host: 'mt-system.id',
  port: 5311,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = postgresqlSequelize;
