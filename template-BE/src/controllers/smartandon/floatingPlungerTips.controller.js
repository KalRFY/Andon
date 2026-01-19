const httpStatus = require('http-status');
const path = require('path');
const moment = require('moment-timezone');
const { sequelize } = require('../../models');

const getFloatingPlungerTips = async (req, res, next) => {
  try {
    const { startDate, endDate, problemName, machine } = req.query;

    console.log('Received query params:', { startDate, endDate, problemName, machine });

    let whereClause = '';

    if (startDate || endDate) {
      if (startDate && endDate && startDate === endDate) {
        whereClause += ` AND DATE(check_date) = '${startDate}'`;
      } else {
        if (startDate) {
          whereClause += ` AND DATE(check_date) >= '${startDate}'`;
        }
        if (endDate) {
          whereClause += ` AND DATE(check_date) <= '${endDate}'`;
        }
      }
    }
    if (problemName) {
      whereClause += ` AND notes LIKE '%${problemName}%'`;
    }
    if (machine) {
      whereClause += ` AND machine_nm = '${machine}'`;
    }

    // Remove leading 'AND' if whereClause is not empty
    if (whereClause.startsWith(' AND')) {
      whereClause = 'WHERE' + whereClause.substring(4);
    }

    console.log('Generated WHERE clause:', whereClause);

    const [floatingTipsData, metadata] = await sequelize.query(`
      SELECT
        id,
        machine_nm,
        check_date,
        tip_counter,
        sleeve_counter,
        spruebush_counter,
        upper_gap_tip,
        upper_depth_tip,
        lower_gap_tip,
        lower_depth_tip,
        notes
      FROM tb_r_floating_tip
      ${whereClause}
      ORDER BY id ASC
    `);

    console.log('Query result count:', floatingTipsData.length);
    console.log('First few results:', floatingTipsData.slice(0, 3));
    console.log('Raw check_date values from database:', floatingTipsData.map(item => ({ id: item.id, check_date: item.check_date })));

    res.status(httpStatus.OK).json(floatingTipsData);
  } catch (error) {
    console.error('Error in getFloatingPlungerTips:', error);
    next(error);
  }
};

const createTemporaryAction = async (req, res, next) => {
  try {
    const { fchanges_item, fline, fmc, fpic, fdate, fnote, fstatus } = req.body;

    console.log('Received body:', { fchanges_item, fline, fmc, fpic, fdate, fnote, fstatus });

    // Build dynamic columns and values
    const columns = [];
    const values = [];
    const placeholders = [];

    if (fchanges_item !== undefined && fchanges_item !== null && fchanges_item !== '') {
      columns.push('fchanges_item');
      values.push(fchanges_item);
      placeholders.push('?');
    }

    if (fline !== undefined && fline !== null && fline !== '') {
      columns.push('fline');
      values.push(fline);
      placeholders.push('?');
    }

    if (fmc !== undefined && fmc !== null && fmc !== '') {
      columns.push('fmc');
      values.push(fmc);
      placeholders.push('?');
    }

    if (fpic !== undefined && fpic !== null && fpic !== '') {
      columns.push('fpic');
      values.push(fpic);
      placeholders.push('?');
    }

    if (fdate !== undefined && fdate !== null && fdate !== '') {
      // Convert to WIB timezone using moment
      const fdateWIB = moment.tz(fdate, 'Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
      columns.push('fdate');
      values.push(fdateWIB);
      placeholders.push('?');
    }

    if (fnote !== undefined && fnote !== null && fnote !== '') {
      columns.push('fnote');
      values.push(fnote);
      placeholders.push('?');
    }

    if (fstatus !== undefined && fstatus !== null && fstatus !== '') {
      columns.push('fstatus');
      values.push(fstatus);
      placeholders.push('?');
    }

    // Always include fproblem with empty string
    columns.push('fproblem');
    values.push('');
    placeholders.push('?');

    if (columns.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'No valid data provided for insertion' });
    }

    const insertQuery = `
      INSERT INTO tb_henkaten (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;

    const [result] = await sequelize.query(insertQuery, {
      replacements: values,
      type: sequelize.QueryTypes.INSERT
    });

    console.log('Insert result:', result);

    res.status(httpStatus.CREATED).json({ message: 'Temporary action created successfully', id: result });
  } catch (error) {
    console.error('Error in createTemporaryAction:', error);
    next(error);
  }
};

const getFloatingPlungerTipsMachines = async (req, res, next) => {
  try {
    const [machines, metadata] = await sequelize.query(`
      SELECT DISTINCT machine_nm
      FROM tb_r_floating_tip
      ORDER BY machine_nm ASC
    `);

    const machineList = machines.map(machine => machine.machine_nm);

    console.log('Unique machines:', machineList);

    res.status(httpStatus.OK).json(machineList);
  } catch (error) {
    console.error('Error in getFloatingPlungerTipsMachines:', error);
    next(error);
  }
};

const getFloatingPlungerTips0101 = async (req, res, next) => {
  try {
    const { startDate, endDate, problemName } = req.query;

    console.log('Received query params for ikdm-0101:', { startDate, endDate, problemName });

    let whereClause = "WHERE machine_nm = 'ikdm-0101'";

    if (startDate || endDate) {
      if (startDate && endDate && startDate === endDate) {
        whereClause += ` AND DATE(check_date) = '${startDate}'`;
      } else {
        if (startDate) {
          whereClause += ` AND DATE(check_date) >= '${startDate}'`;
        }
        if (endDate) {
          whereClause += ` AND DATE(check_date) <= '${endDate}'`;
        }
      }
    }
    if (problemName) {
      whereClause += ` AND notes LIKE '%${problemName}%'`;
    }

    console.log('Generated WHERE clause for ikdm-0101:', whereClause);

    const [floatingTipsData, metadata] = await sequelize.query(`
      SELECT
        id,
        machine_nm,
        check_date,
        tip_counter,
        sleeve_counter,
        spruebush_counter,
        upper_gap_tip,
        upper_depth_tip,
        lower_gap_tip,
        lower_depth_tip,
        notes
      FROM tb_r_floating_tip
      ${whereClause}
      ORDER BY id ASC
    `);

    console.log('Query result count for ikdm-0101:', floatingTipsData.length);
    console.log('First few results for ikdm-0101:', floatingTipsData.slice(0, 3));
    console.log('Raw check_date values from database for ikdm-0101:', floatingTipsData.map(item => ({ id: item.id, check_date: item.check_date })));

    res.status(httpStatus.OK).json(floatingTipsData);
  } catch (error) {
    console.error('Error in getFloatingPlungerTips0101:', error);
    next(error);
  }
};

const getFloatingPlungerTips0102 = async (req, res, next) => {
  try {
    const { startDate, endDate, problemName } = req.query;

    console.log('Received query params for ikdm-0102:', { startDate, endDate, problemName });

    let whereClause = "WHERE machine_nm = 'ikdm-0102'";

    if (startDate || endDate) {
      if (startDate && endDate && startDate === endDate) {
        whereClause += ` AND DATE(check_date) = '${startDate}'`;
      } else {
        if (startDate) {
          whereClause += ` AND DATE(check_date) >= '${startDate}'`;
        }
        if (endDate) {
          whereClause += ` AND DATE(check_date) <= '${endDate}'`;
        }
      }
    }
    if (problemName) {
      whereClause += ` AND notes LIKE '%${problemName}%'`;
    }

    console.log('Generated WHERE clause for ikdm-0102:', whereClause);

    const [floatingTipsData, metadata] = await sequelize.query(`
      SELECT
        id,
        machine_nm,
        check_date,
        tip_counter,
        sleeve_counter,
        spruebush_counter,
        upper_gap_tip,
        upper_depth_tip,
        lower_gap_tip,
        lower_depth_tip,
        notes
      FROM tb_r_floating_tip
      ${whereClause}
      ORDER BY id ASC
    `);

    console.log('Query result count for ikdm-0102:', floatingTipsData.length);
    console.log('First few results for ikdm-0102:', floatingTipsData.slice(0, 3));
    console.log('Raw check_date values from database for ikdm-0102:', floatingTipsData.map(item => ({ id: item.id, check_date: item.check_date })));

    res.status(httpStatus.OK).json(floatingTipsData);
  } catch (error) {
    console.error('Error in getFloatingPlungerTips0102:', error);
    next(error);
  }
};

const createFloatingPlungerTip = async (req, res, next) => {
  try {
    const {
      machine_nm,
      check_date,
      tip_counter,
      sleeve_counter,
      spruebush_counter,
      upper_gap_tip,
      upper_depth_tip,
      lower_gap_tip,
      lower_depth_tip,
      notes
    } = req.body;

    console.log('Received body for createFloatingPlungerTip:', req.body);
    console.log('Original check_date received:', check_date);

    // Build dynamic columns and values
    const columns = [];
    const values = [];
    const placeholders = [];

    if (machine_nm !== undefined && machine_nm !== null && machine_nm !== '') {
      columns.push('machine_nm');
      values.push(machine_nm);
      placeholders.push('?');
    }

    if (check_date !== undefined && check_date !== null && check_date !== '') {
      // Convert check_date to WIB timezone using moment
      const checkDateWIB = moment(check_date).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
      console.log('Converted check_date to WIB:', checkDateWIB);
      columns.push('check_date');
      values.push(checkDateWIB);
      placeholders.push('?');
    }

    if (tip_counter !== undefined && tip_counter !== null && tip_counter !== '') {
      columns.push('tip_counter');
      values.push(tip_counter);
      placeholders.push('?');
    }

    if (sleeve_counter !== undefined && sleeve_counter !== null && sleeve_counter !== '') {
      columns.push('sleeve_counter');
      values.push(sleeve_counter);
      placeholders.push('?');
    }

    if (spruebush_counter !== undefined && spruebush_counter !== null && spruebush_counter !== '') {
      columns.push('spruebush_counter');
      values.push(spruebush_counter);
      placeholders.push('?');
    }

    if (upper_gap_tip !== undefined && upper_gap_tip !== null && upper_gap_tip !== '') {
      columns.push('upper_gap_tip');
      values.push(upper_gap_tip);
      placeholders.push('?');
    }

    if (upper_depth_tip !== undefined && upper_depth_tip !== null && upper_depth_tip !== '') {
      columns.push('upper_depth_tip');
      values.push(upper_depth_tip);
      placeholders.push('?');
    }

    if (lower_gap_tip !== undefined && lower_gap_tip !== null && lower_gap_tip !== '') {
      columns.push('lower_gap_tip');
      values.push(lower_gap_tip);
      placeholders.push('?');
    }

    if (lower_depth_tip !== undefined && lower_depth_tip !== null && lower_depth_tip !== '') {
      columns.push('lower_depth_tip');
      values.push(lower_depth_tip);
      placeholders.push('?');
    }

    if (notes !== undefined && notes !== null) {
      columns.push('notes');
      values.push(notes);
      placeholders.push('?');
    }

    if (columns.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'No valid data provided for insertion' });
    }

    const insertQuery = `
      INSERT INTO tb_r_floating_tip (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
    `;

    const [result] = await sequelize.query(insertQuery, {
      replacements: values,
      type: sequelize.QueryTypes.INSERT
    });

    console.log('Insert result:', result);

    res.status(httpStatus.CREATED).json({ message: 'Floating plunger tip created successfully', id: result });
  } catch (error) {
    console.error('Error in createFloatingPlungerTip:', error);
    next(error);
  }
};

const updateFloatingPlungerTip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      machine_nm,
      check_date,
      tip_counter,
      sleeve_counter,
      spruebush_counter,
      upper_gap_tip,
      upper_depth_tip,
      lower_gap_tip,
      lower_depth_tip,
      notes
    } = req.body;

    console.log('Updating floating plunger tip with ID:', id, 'Data:', req.body);
    console.log('Original check_date received for update:', req.body.check_date);

    // Validate required fields
    if (!machine_nm || !check_date) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'machine_nm and check_date are required' });
    }

    // Build dynamic SET clause
    const setParts = [];
    const values = [];

    if (machine_nm !== undefined && machine_nm !== null && machine_nm !== '') {
      setParts.push('machine_nm = ?');
      values.push(machine_nm);
    }

    if (check_date !== undefined && check_date !== null && check_date !== '') {
      // Convert check_date to WIB timezone using moment
      const checkDateWIB = moment(check_date).tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
      console.log('Converted check_date to WIB for update:', checkDateWIB);
      setParts.push('check_date = ?');
      values.push(checkDateWIB);
    }

    if (tip_counter !== undefined && tip_counter !== null && tip_counter !== '') {
      setParts.push('tip_counter = ?');
      values.push(tip_counter);
    }

    if (sleeve_counter !== undefined && sleeve_counter !== null && sleeve_counter !== '') {
      setParts.push('sleeve_counter = ?');
      values.push(sleeve_counter);
    }

    if (spruebush_counter !== undefined && spruebush_counter !== null && spruebush_counter !== '') {
      setParts.push('spruebush_counter = ?');
      values.push(spruebush_counter);
    }

    if (upper_gap_tip !== undefined && upper_gap_tip !== null && upper_gap_tip !== '') {
      setParts.push('upper_gap_tip = ?');
      values.push(upper_gap_tip);
    }

    if (upper_depth_tip !== undefined && upper_depth_tip !== null && upper_depth_tip !== '') {
      setParts.push('upper_depth_tip = ?');
      values.push(upper_depth_tip);
    }

    if (lower_gap_tip !== undefined && lower_gap_tip !== null && lower_gap_tip !== '') {
      setParts.push('lower_gap_tip = ?');
      values.push(lower_gap_tip);
    }

    if (lower_depth_tip !== undefined && lower_depth_tip !== null && lower_depth_tip !== '') {
      setParts.push('lower_depth_tip = ?');
      values.push(lower_depth_tip);
    }

    if (notes !== undefined && notes !== null) {
      setParts.push('notes = ?');
      values.push(notes);
    }

    if (setParts.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'No valid data provided for update' });
    }

    const updateQuery = `
      UPDATE tb_r_floating_tip
      SET ${setParts.join(', ')}
      WHERE id = ?
    `;

    values.push(id);

    const [result] = await sequelize.query(updateQuery, {
      replacements: values,
      type: sequelize.QueryTypes.UPDATE
    });

    if (result === 0) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Floating plunger tip not found' });
    }

    res.status(httpStatus.OK).json({ message: 'Floating plunger tip updated successfully' });
  } catch (error) {
    console.error('Error in updateFloatingPlungerTip:', error);
    next(error);
  }
};

const deleteFloatingPlungerTip = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('Deleting floating plunger tip with ID:', id);

    const deleteQuery = `
      DELETE FROM tb_r_floating_tip
      WHERE id = :id
    `;
    const [result] = await sequelize.query(deleteQuery, {
      replacements: { id },
    });

    if (result.affectedRows === 0) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Floating plunger tip not found' });
    }

    res.status(httpStatus.OK).json({ message: 'Floating plunger tip deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFloatingPlungerTip:', error);
    next(error);
  }
};

module.exports = {
  getFloatingPlungerTips,
  getFloatingPlungerTipsMachines,
  getFloatingPlungerTips0101,
  getFloatingPlungerTips0102,
  createFloatingPlungerTip,
  updateFloatingPlungerTip,
  deleteFloatingPlungerTip,
};
