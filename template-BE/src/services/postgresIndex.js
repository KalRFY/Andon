const Sequelize = require('sequelize');
const { qdc_pg_db } = require('../config/config');

const pg_sequelize = new Sequelize(
  qdc_pg_db.database,
  qdc_pg_db.username,
  qdc_pg_db.password,
  {
    host: qdc_pg_db.host,
    dialect: qdc_pg_db.dialect,
    port: qdc_pg_db.port,
    pool: qdc_pg_db.pool,
    logging: false,
  }
);

module.exports = pg_sequelize;
