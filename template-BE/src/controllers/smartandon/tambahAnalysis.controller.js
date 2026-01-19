const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const getTambahAnalysis = async (req, res, next) => {
  try {
    const [tambahAnalysis, metadata] = await sequelize.query(`
      SELECT
        id,
        id_problem,
        json_string,
        analisys_category
      FROM o_analisys
      WHERE id_problem IS NOT NULL
      ORDER BY id_problem ASC
    `);
    res.status(httpStatus.OK).json(tambahAnalysis);
  } catch (error) {
    next(error);
  }
  
};

module.exports = {
  getTambahAnalysis,
};
