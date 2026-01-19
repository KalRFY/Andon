const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const seedDashboardData = require('./seeders/dashboardDataSeeder');
const { sequelize } = require('./models');

const startServer = async () => {
  try {
    // Test database connection first
    logger.info('Testing database connection...');
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');
    
    // Sync all models with the database, creating or altering tables as needed
    logger.info('Syncing database models...');
    await sequelize.sync({ alter: true });
    logger.info('Database models synced successfully.');
    
    await seedDashboardData();
    const server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info('Server closed');
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error) => {
      logger.error(error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received');
      if (server) {
        server.close();
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
  }
};

startServer();
