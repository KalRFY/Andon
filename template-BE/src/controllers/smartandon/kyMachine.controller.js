const httpStatus = require('http-status');
const { sequelize } = require('../../models');
const logger = require('../../config/logger');

exports.getLines = async (req, res, next) => {
  try {
    const [lines] = await sequelize.query(`
      SELECT DISTINCT line_id, fline AS line_name
      FROM tb_mc
      WHERE (is_deleted = 0 OR is_deleted IS NULL)
      ORDER BY fline ASC
    `);

    res.status(httpStatus.OK).json({
      msg: 'Success to get Lines',
      data: lines,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

exports.getMachines = async (req, res, next) => {
  try {
    const { line } = req.query;

    const [machines] = await sequelize.query(
      `
      SELECT fid, line_id, fline, fmc_name, fmaker, fsn, fweight, fdate, fop_desc,
             created_by, created_at, updated_by, updated_at, foperation_no, ftype
      FROM tb_mc
      WHERE (is_deleted = 0 OR is_deleted IS NULL)
      ${line ? `AND UPPER(fline) = UPPER(:line)` : ''}
      ORDER BY fid ASC
    `,
      { replacements: { line } }
    );

    res.status(httpStatus.OK).json({
      msg: 'Success to get Machines',
      data: machines,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

exports.getKYMachineData = async (req, res, next) => {
  try {
    const { fline } = req.query;

    const [rows] = await sequelize.query(
      `
      SELECT m.fid AS machine_id, m.fline AS line_nm, m.fmc_name AS machine_nm,
             k.id, k.details, k.created_by, k.created_dt, k.stop6_category, k.ilustration
      FROM tb_mc m
      LEFT JOIN tb_ky k ON k.machine_id = m.fid
      WHERE (m.is_deleted = 0 OR m.is_deleted IS NULL)
      ${fline && fline !== '-1' ? `AND UPPER(m.fline) = UPPER(:fline)` : ''}
      ORDER BY m.fid, k.created_dt DESC
    `,
      { replacements: { fline } }
    );

    const grouped = {};
    for (const row of rows) {
      if (!grouped[row.machine_id]) {
        grouped[row.machine_id] = {
          machine_id: row.machine_id,
          line_nm: row.line_nm,
          machine_nm: row.machine_nm,
          ky_data: [],
        };
      }
      if (row.id) {
        grouped[row.machine_id].ky_data.push({
          id: row.id,
          details: row.details,
          created_by: row.created_by,
          created_dt: row.created_dt,
          stop6_category: row.stop6_category,
          ilustration: row.ilustration,
        });
      }
    }

    const result = Object.values(grouped).map((m) => ({
      ...m,
      ky_total: m.ky_data.length,
    }));

    res.status(httpStatus.OK).json({
      status: 200,
      message: 'success to get machines ky',
      data: [result],
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

exports.getColorDash = async (req, res, next) => {
  try {
    res.status(httpStatus.OK).json({
      msg: 'Success to get color dashboard',
      data: [
        { status: 'A', color: '#E74C3C' },
        { status: 'B', color: '#F1C40F' },
        { status: 'C', color: '#2ECC71' },
        { status: 'Other', color: '#3498DB' },
      ],
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

exports.addKY = async (req, res, next) => {
  try {
    const { machine_id, details, created_by, stop6_category } = req.body;
    const ilustration = req.file ? req.file.path : null;

    await sequelize.query(
      `
      INSERT INTO tb_ky (machine_id, details, created_by, created_dt, stop6_category, ilustration)
      VALUES (:machine_id, :details, :created_by, NOW(), :stop6_category, :ilustration)
    `,
      { replacements: { machine_id, details, created_by, stop6_category, ilustration } }
    );

    res.status(200).json({ msg: 'Success to add KY' });
  } catch (error) {
    next(error);
  }
};

exports.editKY = async (req, res, next) => {
  try {
    const { id, details, stop6_category } = req.body;
    const ilustration = req.file ? req.file.path : null;

    await sequelize.query(
      `
      UPDATE tb_ky
      SET details = :details, stop6_category = :stop6_category,
          ilustration = COALESCE(:ilustration, ilustration)
      WHERE id = :id
    `,
      { replacements: { id, details, stop6_category, ilustration } }
    );

    res.status(200).json({ msg: 'Success to edit KY' });
  } catch (error) {
    next(error);
  }
};

exports.deleteKY = async (req, res, next) => {
  try {
    const { id } = req.params;
    await sequelize.query(`DELETE FROM tb_ky WHERE id = :id`, { replacements: { id } });
    res.status(200).json({ msg: 'Success to delete KY' });
  } catch (error) {
    next(error);
  }
};
