const httpStatus = require('http-status');
const { sequelize } = require('../../models');
const mariadbSequelize = require('../../config/mariadb');

const getOEE = async (req, res, next) => {
  try {
    const oee = await mariadbSequelize.query(`
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
      WHERE GROUP_NAME LIKE '%PROD%' AND TAG_NAME LIKE '%OEE%'
      ORDER BY DEV_NAME ASC
    `, { type: mariadbSequelize.QueryTypes.SELECT });

    res.status(httpStatus.OK).json(oee);
  } catch (error) {
    next(error);
  }
};

const getOEEView = async (req, res, next) => {
  try {
    const [oeeView, metadata] = await mariadbSequelize.query(`
      SELECT
        ID,
        CLIENT_HDL,
        DEV_NAME,
        GROUP_NAME,
        TAG_NAME,
        REG_VALUE,
        TR_TIME,
        CONNECT_STAT,
        ADDRESS
      FROM t_reg_status_lp
      WHERE GROUP_NAME LIKE '%PROD%' AND TAG_NAME LIKE '%OEE%'
      ORDER BY DEV_NAME ASC
    `);

    res.status(httpStatus.OK).json(oeeView);
  } catch (error) {
    next(error);
  }
};

const getOEETarget = async (req, res, next) => {
  try {
    const oeeTarget = await mariadbSequelize.query(`
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
      WHERE GROUP_NAME LIKE '%PROD%' AND TAG_NAME LIKE '%TARGET%'
      ORDER BY DEV_NAME ASC
    `, { type: mariadbSequelize.QueryTypes.SELECT });
    res.status(httpStatus.OK).json(oeeTarget);
  } catch (error) {
    next(error);
  }
};

const getOEEActual = async (req, res, next) => {
  try {
    const oeeActual = await mariadbSequelize.query(`
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
      WHERE GROUP_NAME LIKE '%PROD%' AND TAG_NAME LIKE '%ACTUAL%'
      ORDER BY DEV_NAME ASC
    `, { type: mariadbSequelize.QueryTypes.SELECT });
    res.status(httpStatus.OK).json(oeeActual);
  } catch (error) {
    next(error);
  }
};

const getOEEPlan = async (req, res, next) => {
  try {
    const oeePlan = await mariadbSequelize.query(`
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
      WHERE GROUP_NAME LIKE '%PROD%' AND TAG_NAME LIKE '%PLAN%'
      ORDER BY DEV_NAME ASC
    `, { type: mariadbSequelize.QueryTypes.SELECT });
    res.status(httpStatus.OK).json(oeePlan);
  } catch (error) {
    next(error);
  }
};

const getOEESmartandon = async (req, res, next) => {
  try {
    const [oeeDataSmartandon, metadata] = await sequelize.query(`
      SELECT
        fid,
        fline,
        fitem,
        fvalue,
        ftm_update
      FROM tb_prod2
      WHERE fid IS NOT NULL
      ORDER BY fline ASC, fitem ASC
    `);
    res.status(httpStatus.OK).json(oeeDataSmartandon);
  } catch (error) {
    next(error);
  }
};

const syncOEEToTbProd = async (req, res, next) => {
  try {
    // Fetch all PROD data from MariaDB
    const [prodData, metadata] = await mariadbSequelize.query(`
      SELECT
        ID,
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
    `);

    await sequelize.query(`DELETE FROM tb_prod2`);

    const insertValues = [];
    const replacements = {};
    let index = 0;

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

    res.status(httpStatus.OK).json({
      message: 'OEE data synced successfully to tb_prod2',
      syncedRecords: prodData.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOEE,
  getOEEView,
  getOEETarget,
  getOEEActual,
  getOEEPlan,
  getOEESmartandon,
  syncOEEToTbProd,
};
