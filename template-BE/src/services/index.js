// const Sequelize = require('sequelize');
// const { qdc_db, platform_db } = require('../config/config');

const Sequelize = require('sequelize');
const { qdc_pg_db, platform_db } = require('../config/config');

// Old MySQL Sequelize instance (commented out for PostgreSQL switch)
// const qdc_sequelize = new Sequelize(qdc_db.database, qdc_db.username, qdc_db.password, qdc_db);

// New PostgreSQL Sequelize instance
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

//https://github.com/tagomoris/presto-client-node
const presto = require('presto-client');
const prestoClient = new presto.Client(
    {   user: platform_db.username,host :platform_db.host,port: platform_db.port,
        basic_auth: {user: platform_db.username, password: platform_db.password} });
//https://github.com/tagomoris/presto-client-node
// const presto = require('presto-client');
// // const platform_presto = null;
// const platform_presto = new presto.Client(
//     {   user: platform_db.username,host :platform_db.host,port:platform_db.port,
//         basic_auth: {user: platform_db.username, password: platform_db.password} });

// Export services using PostgreSQL Sequelize instance
module.exports.GaugeService = require('./qdc/Gauge.service')(pg_sequelize, Sequelize);
module.exports.CommonService = require('./qdc/Common.service')(pg_sequelize, Sequelize);
/*define other in here*/
