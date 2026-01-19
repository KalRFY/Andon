const httpStatus = require('http-status');
const { sequelize } = require('../../models');


const getMember = async (req, res, next) => {
  try {
    const [members, metadata] = await sequelize.query(`
      SELECT
        fid,
        fname,
        fnoreg,
        farea,
        fline,
        fshift,
        frole,
        fwa_no,
        approval,
        fmt_id,
        fimage,
        line_nm
      FROM tb_mt_member
      WHERE fid IS NOT NULL
      ORDER BY fid ASC
    `);
    res.status(httpStatus.OK).json(members);
  } catch (error) {
    next(error);
  }
};

const getRoles = async (req, res, next) => {
  try {
    const [roles, metadata] = await sequelize.query(`
      SELECT DISTINCT
        frole
      FROM tb_mt_member
      WHERE frole IS NOT NULL AND frole != ''
      ORDER BY frole ASC
    `);
    res.status(httpStatus.OK).json(roles);
  } catch (error) {
    next(error);
  }
};

const getMembersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const [members, metadata] = await sequelize.query(`
      SELECT
        fid,
        fname,
        fnoreg,
        farea,
        fline,
        fshift,
        frole,
        fwa_no,
        approval,
        fmt_id,
        fimage,
        line_nm
      FROM tb_mt_member
      WHERE frole = :role AND fid IS NOT NULL
      ORDER BY fname ASC
    `, {
      replacements: { role }
    });
    res.status(httpStatus.OK).json(members);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMember,
  getRoles,
  getMembersByRole,
};