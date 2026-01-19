const httpStatus = require('http-status');
const path = require('path');
const moment = require('moment-timezone');
const { sequelize } = require('../../models');

const getTemporaryAction = async (req, res, next) => {
  try {
    const { startDate, endDate, problemName, line, machine, status } = req.query;

    console.log('Received query params:', { startDate, endDate, problemName, line, machine, status });

    let whereClause = 'WHERE fid IS NOT NULL';

    if (startDate) {
      whereClause += ` AND fdate >= '${startDate}'`;
    }
    if (endDate) {
      whereClause += ` AND fdate <= '${endDate}'`;
    }
    if (problemName) {
      whereClause += ` AND (fproblem LIKE '%${problemName}%' OR fchanges_item LIKE '%${problemName}%' OR fnote LIKE '%${problemName}%')`;
    }
    if (line) {
      whereClause += ` AND fline = '${line}'`;
    }
    if (machine) {
      whereClause += ` AND fmc = '${machine}'`;
    }
    if (status !== undefined && status !== null && status !== '') {
      whereClause += ` AND fstatus = '${status}'`;
    }

    console.log('Generated WHERE clause:', whereClause);

    const [temporay, metadata] = await sequelize.query(`
      SELECT
        fid,
        fdate,
        fline,
        fmc,
        fproblem,
        fchanges_item,
        fpart_type,
        fpic,
        fwork_no,
        fnote,
        fstatus
      FROM tb_henkaten
      ${whereClause}
      ORDER BY fid ASC
    `);

    console.log('Query result count:', temporay.length);
    console.log('First few results:', temporay.slice(0, 3));

    res.status(httpStatus.OK).json(temporay);
  } catch (error) {
    console.error('Error in getTemporaryAction:', error);
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
  getTemporaryAction,
  createTemporaryAction,
  updateTemporaryAction,
  deleteTemporaryAction,
};
