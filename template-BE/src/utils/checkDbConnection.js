const { Sequelize } = require('sequelize');
const config = require('../config/config');

async function checkConnection() {
  const sequelize = new Sequelize(
    config.qdc_pg_db.database,
    config.qdc_pg_db.username,
    config.qdc_pg_db.password,
    {
      host: config.qdc_pg_db.host,
      dialect: 'postgres',
      port: config.qdc_pg_db.port,
      logging: false,
    }
  );

  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database:', error);
  } finally {
    await sequelize.close();
  }
}

checkConnection();
