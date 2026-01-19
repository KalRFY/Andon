const { sequelize } = require('../models');
const mariadbSequelize = require('../config/mariadb');
const schedule = require('node-schedule');

class OEESyncService {
  constructor() {
    this.isRunning = false;
  }

  async syncOEEData() {
    if (this.isRunning) {
      console.log('OEE sync already running, skipping...');
      return;
    }

    this.isRunning = true;
    try {
      // Check MariaDB connection before proceeding
      await mariadbSequelize.authenticate();
      console.log('MariaDB connection successful, proceeding with OEE data sync...');

      console.log('Starting OEE data sync from MariaDB to tb_prod2...');

      // Fetch all PROD data from MariaDB (using same pattern as working controller functions)
      const prodData = await mariadbSequelize.query(`
        SELECT
          CLIENT_HDL,
          DEV_NAME,
          GROUP_NAME,
          TAG_NAME,
          REG_VALUE,
          TR_TIME,
          CONNECT_STAT,
          ADDRESS
        FROM t_reg_status_lp
        WHERE GROUP_NAME LIKE '%PROD%'
        ORDER BY DEV_NAME ASC, TAG_NAME ASC
      `, { type: mariadbSequelize.QueryTypes.SELECT });

      // Clear existing data in tb_prod2
      await sequelize.query(`DELETE FROM tb_prod2`);

      // Insert new data based on the actual tb_prod2 structure
      const insertValues = [];
      const replacements = {};

      prodData.forEach((row, idx) => {
        const line = row.DEV_NAME;
        const item = row.TAG_NAME;
        const value = parseFloat(row.REG_VALUE) || 0;
        const tmUpdate = row.TR_TIME;

        insertValues.push(`(:fid${idx}, :fline${idx}, :fitem${idx}, :fvalue${idx}, :ftm_update${idx})`);
        replacements[`fid${idx}`] = idx + 1;
        replacements[`fline${idx}`] = line;
        replacements[`fitem${idx}`] = item;
        replacements[`fvalue${idx}`] = value;
        replacements[`ftm_update${idx}`] = tmUpdate;
      });

      if (insertValues.length > 0) {
        const insertQuery = `
          INSERT INTO tb_prod2 (fid, fline, fitem, fvalue, ftm_update)
          VALUES ${insertValues.join(', ')}
        `;
        await sequelize.query(insertQuery, { replacements });
      }

      console.log(`OEE data sync completed successfully. Synced ${prodData.length} records.`);
    } catch (error) {
      if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeConnectionRefusedError') {
        console.error('MariaDB connection failed, skipping OEE sync:', error.message);
      } else {
        console.error('Error during OEE data sync:', error);
      }
    } finally {
      this.isRunning = false;
    }
  }

  startScheduledSync() {
    // Schedule to run every 30 seconds
    schedule.scheduleJob('*/30 * * * * *', async () => {
      console.log(`[${new Date().toISOString()}] Starting scheduled OEE data sync...`);
      await this.syncOEEData();
      console.log(`[${new Date().toISOString()}] Scheduled OEE data sync completed.`);
    });
    console.log('OEE sync scheduled to run every 30 seconds.');
  }

  stopScheduledSync() {
    schedule.gracefulShutdown();
    console.log('OEE sync scheduling stopped.');
  }
}

module.exports = new OEESyncService();
