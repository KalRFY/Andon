/* eslint-disable camelcase */
const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const getSpareparts = async (req, res, next) => {
  try {
    const [spareparts] = await sequelize.query(`
      SELECT
        material_number,
        sparepart_nm,
        uom,
        mrp,
        rop,
        rov,
        lead_time,
        sparepart_id,
        uuid,
        created_by,
        (changed_dt::timestamp) + INTERVAL '7 hours' as changed_dt,
        changed_by,
        (created_dt::timestamp) + INTERVAL '7 hours' as created_dt,
        stock,
        price,
        vendor,
        status,
        replacement_material_number
      FROM tb_m_spareparts
      WHERE sparepart_id IS NOT NULL
      ORDER BY sparepart_id ASC
    `);

    res.status(httpStatus.OK).json({
      success: true,
      data: spareparts,
      count: spareparts.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSpareparts,
};
