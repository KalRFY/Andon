const httpStatus = require('http-status');
const { sequelize } = require('../../models');


const getMachine = async (req, res, next) => {
  try {
    let filters = {};
    if (req.query.search) {
      try {
        filters = JSON.parse(req.query.search);
        console.log('[BE Debug] EditDataSmartandon received filters:', filters);
      } catch (e) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Invalid search parameter' });
      }
    }

    let whereClause = 'fid IS NOT NULL AND (is_deleted IS NULL OR is_deleted = 0)';
    const replacements = {};

    if (filters.line) {
      whereClause += ' AND fline = :line';
      replacements.line = filters.line;
      console.log('[BE Debug] EditDataSmartandon filtering by line:', filters.line);
    }

    if (filters.maker) {
      whereClause += ' AND fmaker = :maker';
      replacements.maker = filters.maker;
      console.log('[BE Debug] EditDataSmartandon filtering by maker:', filters.maker);
    }

    if (filters.description) {
      whereClause += ' AND fop_desc LIKE :description';
      replacements.description = `%${filters.description}%`;
      console.log('[BE Debug] EditDataSmartandon filtering by description:', filters.description);
    }

    console.log('[BE Debug] EditDataSmartandon final whereClause:', whereClause);
    console.log('[BE Debug] EditDataSmartandon replacements:', replacements);

    const [machines, metadata] = await sequelize.query(`
      SELECT fid, line_id, fline, fmc_name, fmaker, idx_pos, fsn, fweight, fdate, fop_desc, fcell, fpost,
             isNotifTl, isNotifGl, isNotifSh, isNotifDph, isNotifDdh, created_by, created_at, updated_by, updated_at,
             is_deleted, foperation_no, ftype
      FROM tb_mc
      WHERE ${whereClause}
      ORDER BY fid ASC
    `, { replacements });

    console.log('[BE Debug] EditDataSmartandon query returned machines:', machines.length);
    res.status(httpStatus.OK).json(machines);
  } catch (error) {
    next(error);
  }

};

const getCurrentTime = () => {
  const date = new Date();
  // Format as YYYY-MM-DD HH:mm:ss
  const pad = (n) => n < 10 ? '0' + n : n;
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const createMachine = async (req, res, next) => {
  try {
    const machineData = req.body;
    console.log('BE: Received machine data for creation:', machineData);

    // Check if machineData is null or undefined
    if (!machineData || Object.keys(machineData).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Machine data is required and cannot be null'
      });
    }

    // Validate required fields
    if (!machineData.fmc_name || machineData.fmc_name.trim() === '') {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Machine name is required'
      });
    }

    // Additional null check for machine name
    if (machineData.fmc_name === null || machineData.fmc_name === undefined) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Machine name cannot be null'
      });
    }

    // Check for duplicate machine name
    const [existingMachine] = await sequelize.query(`
      SELECT fid FROM tb_mc WHERE fmc_name = :fmc_name
    `, {
      replacements: { fmc_name: machineData.fmc_name.trim() }
    });

    if (existingMachine.length > 0) {
      return res.status(httpStatus.CONFLICT).json({
        success: false,
        message: 'Machine name already exists'
      });
    }

    // Get the next fid
    const [maxFidResult] = await sequelize.query(`
      SELECT MAX(fid) as maxFid FROM tb_mc
    `);

    const nextFid = (maxFidResult[0].maxFid || 0) + 1;

    // Set fline from lineId if provided
    if (machineData.lineId && !machineData.fline) {
      // You might need to fetch the line name from line_id, but for now assume it's provided
      machineData.fline = machineData.fline || '';
    }
    console.log('BE: lineId received:', machineData.lineId, 'fline received:', machineData.fline);

    // Build dynamic INSERT query - only include fields that have data
    const currentTime = getCurrentTime();
    const insertColumns = ['fid', 'created_by', 'created_at', 'updated_by', 'updated_at', 'is_deleted'];
    const insertValues = [':fid', ':created_by', ':created_at', ':updated_by', ':updated_at', ':is_deleted'];
    const replacements = {
      fid: nextFid,
      created_by: 'SYSTEM',
      created_at: currentTime,
      updated_by: 'SYSTEM',
      updated_at: currentTime,
      is_deleted: 0
    };

    // Required field - machine name
    if (machineData.fmc_name !== null && machineData.fmc_name !== undefined && machineData.fmc_name.trim() !== '') {
      insertColumns.push('fmc_name');
      insertValues.push(':fmc_name');
      replacements.fmc_name = machineData.fmc_name.trim();
    }

    // Optional fields - only add if they have data
    if (machineData.fmaker !== null && machineData.fmaker !== undefined && machineData.fmaker !== '') {
      insertColumns.push('fmaker');
      insertValues.push(':fmaker');
      replacements.fmaker = machineData.fmaker;
    }

    if (machineData.fline !== null && machineData.fline !== undefined && machineData.fline !== '') {
      insertColumns.push('fline');
      insertValues.push(':fline');
      replacements.fline = machineData.fline;
    }

    if (machineData.lineId !== null && machineData.lineId !== undefined && machineData.lineId !== '') {
      insertColumns.push('line_id');
      insertValues.push(':line_id');
      replacements.line_id = machineData.lineId;
    }

    if (machineData.fsn !== null && machineData.fsn !== undefined && machineData.fsn !== '') {
      insertColumns.push('fsn');
      insertValues.push(':fsn');
      replacements.fsn = machineData.fsn;
    }

    if (machineData.fweight !== null && machineData.fweight !== undefined && machineData.fweight !== '') {
      insertColumns.push('fweight');
      insertValues.push(':fweight');
      replacements.fweight = machineData.fweight;
    }

    if (machineData.ftype !== null && machineData.ftype !== undefined && machineData.ftype !== '') {
      insertColumns.push('ftype');
      insertValues.push(':ftype');
      replacements.ftype = machineData.ftype;
    }

    if (machineData.foperation_no !== null && machineData.foperation_no !== undefined && machineData.foperation_no !== '') {
      insertColumns.push('foperation_no');
      insertValues.push(':foperation_no');
      replacements.foperation_no = machineData.foperation_no;
    }

    if (machineData.fop_desc !== null && machineData.fop_desc !== undefined && machineData.fop_desc !== '') {
      insertColumns.push('fop_desc');
      insertValues.push(':fop_desc');
      replacements.fop_desc = machineData.fop_desc;
    }

    // Ensure at least machine name is provided
    if (!replacements.fmc_name) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Machine name is required and cannot be null or empty'
      });
    }

    // Build the INSERT query dynamically
    const insertQuery = `
      INSERT INTO tb_mc (
        ${insertColumns.join(', ')}
      ) VALUES (
        ${insertValues.join(', ')}
      )
    `;

    console.log('BE: Inserting line_id:', replacements.line_id, 'fline:', replacements.fline);
    await sequelize.query(insertQuery, { replacements });
    console.log('BE: Machine created successfully with fid:', nextFid);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: 'Machine created successfully',
      data: { fid: nextFid }
    });
  } catch (error) {
    next(error);
  }
};

const updateMachine = async (req, res, next) => {
  try {
    const { fid } = req.params;
    const updateData = req.body;

    // First, check if the machine exists
    const [existingMachine] = await sequelize.query(`
      SELECT fid FROM tb_mc WHERE fid = :fid
    `, {
      replacements: { fid }
    });

    if (existingMachine.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Machine not found'
      });
    }

    // If exists, proceed with update - build dynamic SET clause
    const setFields = [];
    const replacements = { fid };

    if (updateData.fmc_name !== undefined && updateData.fmc_name !== null && updateData.fmc_name !== '') {
      setFields.push('fmc_name = :fmc_name');
      replacements.fmc_name = updateData.fmc_name;
    }
    if (updateData.fmaker !== undefined && updateData.fmaker !== null && updateData.fmaker !== '') {
      setFields.push('fmaker = :fmaker');
      replacements.fmaker = updateData.fmaker;
    }
    if (updateData.lineId !== undefined && updateData.lineId !== null && updateData.lineId !== '') {
      setFields.push('line_id = :line_id');
      replacements.line_id = updateData.lineId;
    }
    if (updateData.fline !== undefined && updateData.fline !== null && updateData.fline !== '') {
      setFields.push('fline = :fline');
      replacements.fline = updateData.fline;
    }
    if (updateData.fsn !== undefined && updateData.fsn !== null && updateData.fsn !== '') {
      setFields.push('fsn = :fsn');
      replacements.fsn = updateData.fsn;
    }
    if (updateData.fweight !== undefined && updateData.fweight !== null && updateData.fweight !== '') {
      setFields.push('fweight = :fweight');
      replacements.fweight = updateData.fweight;
    }
    if (updateData.ftype !== undefined && updateData.ftype !== null && updateData.ftype !== '') {
      setFields.push('ftype = :ftype');
      replacements.ftype = updateData.ftype;
    }
    if (updateData.foperation_no !== undefined && updateData.foperation_no !== null && updateData.foperation_no !== '') {
      setFields.push('foperation_no = :foperation_no');
      replacements.foperation_no = updateData.foperation_no;
    }
    if (updateData.fop_desc !== undefined && updateData.fop_desc !== null && updateData.fop_desc !== '') {
      setFields.push('fop_desc = :fop_desc');
      replacements.fop_desc = updateData.fop_desc;
    }

    // Always update these fields
    setFields.push('updated_by = :updated_by');
    setFields.push('updated_at = CONVERT_TZ(NOW(), \'UTC\', \'+07:00\')');
    replacements.updated_by = req.user?.id || 'system';

    const updateQuery = `
      UPDATE tb_mc
      SET ${setFields.join(', ')}
      WHERE fid = :fid
    `;

    const [result] = await sequelize.query(updateQuery, { replacements });

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Machine updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

const deleteMachine = async (req, res, next) => {
  try {
    const { fid } = req.params;

    // First, check if the machine exists
    const [existingMachine] = await sequelize.query(`
      SELECT fid FROM tb_mc WHERE fid = :fid
    `, {
      replacements: { fid }
    });

    if (existingMachine.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Machine not found'
      });
    }

    // Hard delete the machine record
    const deleteQuery = `
      DELETE FROM tb_mc WHERE fid = :fid
    `;

    await sequelize.query(deleteQuery, {
      replacements: { fid }
    });

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Machine deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMachine,
  createMachine,
  updateMachine,
  deleteMachine,
};