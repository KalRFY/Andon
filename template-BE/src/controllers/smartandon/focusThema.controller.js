const httpStatus = require('http-status');
const path = require('path');
const moment = require('moment-timezone');
const { sequelize } = require('../../models');

const getFocusThema = async (req, res, next) => {
  try {
    const { startDate, endDate, problemName, line, machine, status } = req.query;

    console.log('Received query params:', { startDate, endDate, problemName, line, machine, status });

    let whereClause = 'WHERE id_m_member IS NOT NULL';

    if (startDate) {
      whereClause += ` AND problem_start_time >= '${startDate}'`;
    }
    if (endDate) {
      whereClause += ` AND problem_end_time <= '${endDate}'`;
    }
    if (problemName) {
      whereClause += ` AND problem_name LIKE '%${problemName}%'`;
    }
    if (line) {
      whereClause += ` AND problem_line = '${line}'`;
    }
    if (machine) {
      whereClause += ` AND problem_machine = '${machine}'`;
    }
    if (status !== undefined && status !== null && status !== '') {
      whereClause += ` AND problem_shift = '${status}'`;
    }

    console.log('Generated WHERE clause:', whereClause);

    const [focusThemaData, metadata] = await sequelize.query(`
      SELECT
        fid,
        id_m_member,
        member_name,
        member_shift,
        member_role,
        member_phone,
        member_img,
        id_m_problem,
        problem_line,
        problem_machine,
        problem_name,
        problem_start_time,
        problem_end_time,
        problem_shift,
        fdur,
        created_at
      FROM v_ft_member
      ${whereClause}
      ORDER BY fid ASC
    `);

    console.log('Query result count:', focusThemaData.length);
    console.log('First few results:', focusThemaData.slice(0, 3));

    res.status(httpStatus.OK).json(focusThemaData);
  } catch (error) {
    console.error('Error in getFocusThema:', error);
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


const updateTemporaryAction = async (req, res, next) => {
  try {
    const { fid } = req.params;
    const { fchanges_item, fline, fmc, fpic, fdate, fnote, fstatus } = req.body;

    console.log('Updating temporary action with fid:', fid);
    console.log('Received body:', { fchanges_item, fline, fmc, fpic, fdate, fnote, fstatus });

    // Build dynamic SET clause
    const setParts = [];
    const values = [];

    if (fchanges_item !== undefined && fchanges_item !== null && fchanges_item !== '') {
      setParts.push('fchanges_item = ?');
      values.push(fchanges_item);
    }

    if (fline !== undefined && fline !== null && fline !== '') {
      setParts.push('fline = ?');
      values.push(fline);
    }

    if (fmc !== undefined && fmc !== null && fmc !== '') {
      setParts.push('fmc = ?');
      values.push(fmc);
    }

    if (fpic !== undefined && fpic !== null && fpic !== '') {
      setParts.push('fpic = ?');
      values.push(fpic);
    }

    if (fdate !== undefined && fdate !== null && fdate !== '') {
      // Convert to WIB timezone using moment
      const fdateWIB = moment.tz(fdate, 'Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
      setParts.push('fdate = ?');
      values.push(fdateWIB);
    }

    if (fnote !== undefined && fnote !== null && fnote !== '') {
      setParts.push('fnote = ?');
      values.push(fnote);
    }

    if (fstatus !== undefined && fstatus !== null && fstatus !== '') {
      setParts.push('fstatus = ?');
      values.push(fstatus);
    }

    if (setParts.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'No valid data provided for update' });
    }

    const updateQuery = `
      UPDATE tb_henkaten
      SET ${setParts.join(', ')}
      WHERE fid = ?
    `;

    values.push(fid);

    const [result] = await sequelize.query(updateQuery, {
      replacements: values,
      type: sequelize.QueryTypes.UPDATE
    });

    if (result === 0) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Temporary action not found' });
    }

    console.log('Update result:', result);

    res.status(httpStatus.OK).json({ message: 'Temporary action updated successfully' });
  } catch (error) {
    console.error('Error in updateTemporaryAction:', error);
    next(error);
  }
};

const deleteTemporaryAction = async (req, res, next) => {
  try {
    const { fid } = req.params;
    console.log('Deleting temporary action with fid:', fid);

    const deleteQuery = `
      DELETE FROM tb_henkaten
      WHERE fid = :fid
    `;
    const [result] = await sequelize.query(deleteQuery, {
      replacements: { fid },
    });

    if (result.affectedRows === 0) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Temporary action not found' });
    }

    res.status(httpStatus.OK).json({ message: 'Temporary action deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTemporaryAction:', error);
    next(error);
  }
};

module.exports = {
  getFocusThema,
  createTemporaryAction,
  updateTemporaryAction,
  deleteTemporaryAction,
};
