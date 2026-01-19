const httpStatus = require('http-status');
const { sequelize } = require('../../models');
const postgresqlSequelize = require('../../config/postgresqldb');

const getSpareparts = async (req, res, next) => {
  try {
    const [spareparts] = await postgresqlSequelize.query(`
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

    console.log("Sparepart count:", spareparts.length);
    res.status(httpStatus.OK).json({
      success: true,
      data: spareparts,
      count: spareparts.length
    });
  } catch (error) {
    next(error);
  }
};

const getLastSparepartId = async (req, res, next) => {
  try {
    const query = `SELECT MAX(sparepart_id) as max_id FROM tb_m_spareparts`;
    const [result] = await postgresqlSequelize.query(query);
    const maxId = result[0].max_id || 0;
    res.status(httpStatus.OK).json({
      success: true,
      data: maxId
    });
  } catch (error) {
    next(error);
  }
};

const createSparepart = async (req, res, next) => {
  try {
    const { sparepart_nm, material_number, price, vendor } = req.body;

    console.log('Received data for createSparepart:', { sparepart_nm, material_number, price, vendor });

    // Validation: Check required fields
    if (!sparepart_nm || sparepart_nm.trim() === '' ||
        !material_number || material_number.trim() === '' ||
        price === undefined || price === null ||
        !vendor || vendor.trim() === '') {
      console.log('Validation failed: Missing or empty required fields');
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'sparepart_nm, material_number, price, and vendor are required and cannot be empty'
      });
    }

    const query = `
      INSERT INTO tb_m_spareparts (sparepart_nm, material_number, price, vendor, created_by, changed_by, created_dt, changed_dt)
      VALUES (:sparepart_nm, :material_number, :price, :vendor, 'upload', 'upload', date_trunc('second', NOW() + INTERVAL '7 hours')::timestamp, date_trunc('second', NOW() + INTERVAL '7 hours')::timestamp)
      RETURNING sparepart_id
    `;
    const replacements = { sparepart_nm, material_number, price, vendor };

    console.log('Executing query:', query);
    console.log('With replacements:', replacements);

    const result = await postgresqlSequelize.query(query, { replacements });
    const insertedId = result[0][0].sparepart_id;

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Sparepart created successfully',
      sparepart_id: insertedId
    });
  } catch (error) {
    console.error('Error in createSparepart:', error);
    next(error);
  }
};

module.exports = {
  getSpareparts,
  getLastSparepartId,
  createSparepart,
};
