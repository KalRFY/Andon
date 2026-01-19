const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const getLine = async (req, res, next) => {
  try {
    
    const [lines, metadata] = await sequelize.query('SELECT fid, fline FROM tb_line WHERE fid BETWEEN 1 AND 7 ORDER BY fid ASC');
    res.status(httpStatus.OK).json(lines);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLine,
};