const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const LINES = [
    "LPDC",
    "HPDC",
    "CAM SHAFT",
    "CYLINDER HEAD",
    "CYLINDER BLOCK",
    "CRANK SHAFT",
    "ASSY LINE",
  ];

const defaultController = async (req, res) => {
  return res.status(httpStatus.OK).json({
    message: 'Welcome to the Realtime Pareto Controller',
    status: httpStatus.OK,
  });
};

const getAvCategoryController = async (req, res, next) => {
  
  try {
    const avCategory = [
        { value: "MESIN", label: "MESIN" },
        { value: "DIES", label: "DIES" },
        { value: "TOOL", label: "TOOL" },
        { value: "COOLANT", label: "COOLANT" },
        { value: "PRODUKSI", label: "PIC PRODUKSI" },
        { value: "PROBLEM TPM", label: "PROBLEM TPM" },
        { value: "PROBLEM PREDICTIVE", label: "PROBLEM PREDICTIVE" },
    ];
    return res.status(httpStatus.OK).json({
        message: 'AV Categories fetched successfully',
        status: httpStatus.OK,
        data: avCategory,
    });
  } catch (err) {
    next(err);
  }
};

const getRealtimeParetoController = async (req, res, next) => {
  try {
    const { 
      avCategory,
      group,
      order,
      startDate,
      endDate
    } = req.query;

    if (!group || !order || !startDate || !endDate) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'Missing required parameters: group, order, startDate, endDate',
        status: httpStatus.BAD_REQUEST,
      });
    }

    let baseWhereClause = `fstart_time BETWEEN '${startDate}' AND '${endDate}'`;
    if (avCategory) {
      const cleanAvCategory = avCategory.replace(/fav_categoty\s*=\s*'/, '').replace(/\s*AND'$/, '');
      if (cleanAvCategory) {
        baseWhereClause += ` AND fav_categoty = '${cleanAvCategory}'`;
      }
    }
    const allResults = [];

    const lineQueries = LINES.map(async (line) => {
      const whereClause = `${baseWhereClause} AND fline = '${line}'`;
      const q = `SELECT 
      ${group} AS metric, 
      ${order} AS fdur,
      MAX(foperator) AS operator,
      MAX(fstart_time) AS fstart_time
      FROM v_current_error_2 WHERE ${whereClause} GROUP BY ${group} ORDER BY fdur DESC`;

      try {
        const lineResults = await sequelize.query(q, {
          type: sequelize.QueryTypes.SELECT,
        });
        return { line, results: lineResults };
      } catch (lineError) {
        console.error(`Error querying line ${line}:`, lineError);
        return { line, results: [] };
      }
    });

    const queryResults = await Promise.all(lineQueries);
    queryResults.forEach(({ line, results }) => {
      allResults.push({
        title: line,
        panelId: `PANEL ${line.replace(/\s+/g, '').toUpperCase()}`,
        minQuantity: 0,
        problems: results
      })
    });

    return res.status(httpStatus.OK).json({
      message: 'Realtime Pareto data fetched successfully',
      status: httpStatus.OK,
      data: allResults,
    });
  } catch(err) {
    console.error('Error in getRealtimeParetoController:', err);
    return next(err);
  }
}

module.exports = {
    defaultController,
    getAvCategoryController,
    getRealtimeParetoController
};
