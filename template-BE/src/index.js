const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const sequelize = require('./config/mysql');

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

    const server = app.listen(
      {
        port: config.port,
        host: config.host,
      },
      () => {
        logger.info(`Server is running on ${config.host}:${config.port} in ${config.env} mode`);
      }
    );

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
