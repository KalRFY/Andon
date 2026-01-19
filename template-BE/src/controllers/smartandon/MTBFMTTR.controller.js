const httpStatus = require('http-status');
const { sequelize } = require('../../models');
const LINES = ['LPDC', 'HPDC', 'CAM SHAFT', 'CYLINDER HEAD', 'CYLINDER BLOCK', 'CRANK SHAFT', 'ASSY LINE'];

const defaultController = async (req, res) => {
  return res.status(httpStatus.OK).json({
    message: 'Welcome to the MTBF MTTR Controller',
    status: httpStatus.OK,
  });
};

const getMTBFController = async (req, res, next) => {
  const { startDate, endDate, type } = req.query;
  try {
    if (!startDate || !endDate) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'startDate and endDate query parameters are required',
        status: httpStatus.BAD_REQUEST,
      });
    }
    
    const fstartTime = startDate;
    const fendTime = endDate;
    const start = new Date(fstartTime.split(' ')[0]);
    const end = new Date(fendTime.split(' ')[0]);
    const diffDays = (end - start) / (1000 * 60 * 60 * 24);

    let resultsArray = [];

    if (type === 'daily') {
      resultsArray = await Promise.all(
        LINES.filter(Boolean).map(async (line) => {
          const query = `
            SELECT 
                DATE(fstart_time) as date,
                SUM(fdur) AS total_fdur,
                COUNT(*) AS total_rows
            FROM v_current_error_2
            WHERE fline = '${line}'
            AND fstart_time BETWEEN '${fstartTime}' AND '${fendTime}'
            GROUP BY DATE(fstart_time)
            ORDER BY DATE(fstart_time)
          `;
          
          const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
          });

          return results.map((row) => {
            const uptime = 24;
            const downtime = Number(row.total_fdur) || 0;
            const totalProblem = Number(row.total_rows) || 0;
            const mtbf = totalProblem > 0 ? Math.abs((uptime - downtime) / totalProblem) : 0;

            return {
              fline: line,
              date: row.date,
              totalFdur: downtime,
              totalRows: totalProblem,
              uptime: uptime.toFixed(2),
              downtime: downtime.toFixed(2),
              mtbf: mtbf.toFixed(2),
            };

          });
        })
      );
      resultsArray = resultsArray.flat();
    } else if (type === 'monthly') {
      resultsArray = await Promise.all(
        LINES.filter(Boolean).map(async (line) => {
          const query = `
            SELECT 
                DATE_FORMAT(fstart_time, '%Y-%m') as month,
                SUM(fdur) AS total_fdur,
                COUNT(*) AS total_rows
            FROM v_current_error_2
            WHERE fline = '${line}'
            AND fstart_time BETWEEN '${fstartTime}' AND '${fendTime}'
            GROUP BY DATE_FORMAT(fstart_time, '%Y-%m')
            ORDER BY DATE_FORMAT(fstart_time, '%Y-%m')
          `;
          
          const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
          });
          
          return results.map((row) => {
            const [year, month] = row.month.split('-');
            const daysInMonth = new Date(year, month, 0).getDate();
            const uptime = daysInMonth * 24;
            const downtime = Number(row.total_fdur) || 0;
            const totalProblem = Number(row.total_rows) || 0;
            const mtbf = totalProblem > 0 ? Math.abs((uptime - downtime) / totalProblem) : 0;

            return {
              fline: line,
              date: row.month,
              totalFdur: downtime,
              totalRows: totalProblem,
              uptime: uptime.toFixed(2),
              downtime: downtime.toFixed(2),
              mtbf: mtbf.toFixed(2),
            };
          });
        })
      );

      resultsArray = resultsArray.flat();

    } else if (type === 'machines') {
      resultsArray = await Promise.all(

        LINES.filter(Boolean).map(async (line) => {
          const query = `
            SELECT
                fmc_name,
                SUM(fdur) AS total_fdur,
                COUNT(*) AS total_rows
            FROM v_current_error_2
            WHERE fline = '${line}'
            AND fstart_time BETWEEN '${fstartTime}' AND '${fendTime}'
            GROUP BY fmc_name
            ORDER BY fmc_name
          `;

          const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
          });

          return results.map((row) => {
            const uptime = diffDays * 24;
            const downtime = Number(row.total_fdur) || 0;
            const totalProblem = Number(row.total_rows) || 0;
            const mtbf = totalProblem > 0 ? Math.abs((uptime - downtime) / totalProblem) : 0;

            return {
              fmc_name: row.fmc_name,
              fline: line,
              totalFdur: downtime,
              totalRows: totalProblem,
              uptime: uptime.toFixed(2),
              downtime: downtime.toFixed(2),
              mtbf: mtbf.toFixed(2),
            };
          });
        })
      );

      resultsArray = resultsArray.flat();

    } else {
      resultsArray = await Promise.all(
        LINES.filter(Boolean).map(async (line) => {
          const query = `
            SELECT 
                SUM(fdur) AS total_fdur,
                COUNT(*) AS total_rows
            FROM v_current_error_2
            WHERE fline = '${line}'
            AND fstart_time BETWEEN '${fstartTime}' AND '${fendTime}';
          `;

          const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
          });

          const finalData = results[0] || {};
          const uptime = Number(diffDays * 24);
          const downtime = Number(finalData.total_fdur) || 0;
          const totalProblem = Number(finalData.total_rows) || 0;
          const mtbf = totalProblem > 0 ? Math.abs((uptime - downtime) / totalProblem) : 0;
          
          return {
            fline: line,
            fStartTime: fstartTime,
            fEndTime: fendTime,
            totalFdur: downtime,
            totalRows: totalProblem,
            uptime: uptime.toFixed(2),
            downtime: downtime.toFixed(2),
            mtbf: mtbf.toFixed(2),
          };
        })
      );
    }
    res.status(httpStatus.OK).json({
      message: 'MTBF Data Retrieved Successfully',
      status: httpStatus.OK,
      data: resultsArray,
    });
  } catch (err) {
    next(err);
  }
};

const getMTTRController = async (req, res, next) => {
  const { startDate, endDate, type } = req.query;
  try {
    if (!startDate || !endDate) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'startDate and endDate query parameters are required',
        status: httpStatus.BAD_REQUEST,
      });
    }
    const fstartTime = startDate;
    const fendTime = endDate;

    let resultsArray = [];
    if (type === 'daily') {
      resultsArray = await Promise.all(
        LINES.filter(Boolean).map(async (line) => {
          const query = `
            SELECT 
                DATE(fstart_time) as date,
                SUM(fdur) AS total_fdur,
                COUNT(*) AS total_rows
            FROM v_current_error_2
            WHERE fline = '${line}'
            AND fstart_time BETWEEN '${fstartTime}' AND '${fendTime}'
            GROUP BY DATE(fstart_time)
            ORDER BY DATE(fstart_time)
          `;
          const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
          });
          return results.map((row) => {
            const downtime = Number(row.total_fdur) || 0;
            const totalProblem = Number(row.total_rows) || 0;
            const mttr = totalProblem > 0 ? Math.abs(downtime / totalProblem) : 0;
            return {
              fline: line,
              date: row.date,
              totalFdur: downtime,
              totalRows: totalProblem,
              downtime: downtime.toFixed(2),
              mttr: mttr.toFixed(2),
            };
          });
        })
      );
      resultsArray = resultsArray.flat();
    } else if (type === 'monthly') {
      resultsArray = await Promise.all(
        LINES.filter(Boolean).map(async (line) => {
          const query = `
            SELECT 
                DATE_FORMAT(fstart_time, '%Y-%m') as month,
                SUM(fdur) AS total_fdur,
                COUNT(*) AS total_rows
            FROM v_current_error_2
            WHERE fline = '${line}'
            AND fstart_time BETWEEN '${fstartTime}' AND '${fendTime}'
            GROUP BY DATE_FORMAT(fstart_time, '%Y-%m')
            ORDER BY DATE_FORMAT(fstart_time, '%Y-%m')
          `;
          const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
          });
          return results.map((row) => {
            const downtime = Number(row.total_fdur) || 0;
            const totalProblem = Number(row.total_rows) || 0;
            const mttr = totalProblem > 0 ? Math.abs(downtime / totalProblem) : 0;
            return {
              fline: line,
              date: row.month,
              totalFdur: downtime,
              totalRows: totalProblem,
              downtime: downtime.toFixed(2),
              mttr: mttr.toFixed(2),
            };
          });
        })
      );
      resultsArray = resultsArray.flat();
    } else if (type === 'machines') {
      resultsArray = await Promise.all(
        LINES.filter(Boolean).map(async (line) => {
          const query = `
            SELECT
                fmc_name,
                SUM(fdur) AS total_fdur,
                COUNT(*) AS total_rows
            FROM v_current_error_2
            WHERE fline = '${line}'
            AND fstart_time BETWEEN '${fstartTime}' AND '${fendTime}'
            GROUP BY fmc_name
            ORDER BY fmc_name
          `;

          const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
          });

          return results.map((row) => {
            const downtime = Number(row.total_fdur) || 0;
            const totalProblem = Number(row.total_rows) || 0;
            const mttr = totalProblem > 0 ? Math.abs(downtime / totalProblem) : 0;

            return {
              fmc_name: row.fmc_name,
              fline: line,
              totalFdur: downtime,
              totalRows: totalProblem,
              downtime: downtime.toFixed(2),
              mttr: mttr.toFixed(2),
            };
          });
        })
      );

      resultsArray = resultsArray.flat();
    } else {
      resultsArray = await Promise.all(
        LINES.filter(Boolean).map(async (line) => {
          const query = `
            SELECT 
                SUM(fdur) AS total_fdur,
                COUNT(*) AS total_rows
            FROM v_current_error_2
            WHERE fline = '${line}'
            AND fstart_time BETWEEN '${fstartTime}' AND '${fendTime}';
          `;
          const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
          });
          const finalData = results[0] || {};
          const downtime = Number(finalData.total_fdur) || 0;
          const totalProblem = Number(finalData.total_rows) || 0;
          const mttr = totalProblem > 0 ? Math.abs(downtime / totalProblem) : 0;
          return {
            fline: line,
            fStartTime: fstartTime,
            fEndTime: fendTime,
            totalFdur: downtime,
            totalRows: totalProblem,
            downtime: downtime.toFixed(2),
            mttr: mttr.toFixed(2),
          };
        })
      );
    }
    res.status(httpStatus.OK).json({
      message: 'MTTR Data Retrieved Successfully',
      status: httpStatus.OK,
      data: resultsArray,
    });
  } catch (err) {
    next(err);
  }
};

const getMtBFMTTRController = async (req, res, next) => {
  const { startDate, endDate, type } = req.query;
  try {
    if (!startDate || !endDate) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'startDate and endDate query parameters are required',
        status: httpStatus.BAD_REQUEST,
      });
    }
    const fstartTime = startDate;
    const fendTime = endDate;
    const start = new Date(fstartTime.split(' ')[0]);
    const end = new Date(fendTime.split(' ')[0]);
    const diffDays = (end - start) / (1000 * 60 * 60 * 24);

    let resultsArray = [];
    if (type === 'daily') {
      resultsArray = await Promise.all(
        LINES.filter(Boolean).map(async (line) => {
          const query = `
            SELECT 
                DATE(fstart_time) as date,
                SUM(fdur) AS total_fdur,
                COUNT(*) AS total_rows
            FROM v_current_error_2
            WHERE fline = '${line}'
            AND fstart_time BETWEEN '${fstartTime}' AND '${fendTime}'
            GROUP BY DATE(fstart_time)
            ORDER BY DATE(fstart_time)
          `;
          const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
          });
          return results.map((row) => {
            const uptime = 24;
            const downtime = Number(row.total_fdur) || 0;
            const totalProblem = Number(row.total_rows) || 0;
            const mtbf = totalProblem > 0 ? Math.abs((uptime - downtime) / totalProblem) : 0;
            const mttr = totalProblem > 0 ? Math.abs(downtime / totalProblem) : 0;
            return {
              fline: line,
              date: row.date,
              totalFdur: downtime,
              totalRows: totalProblem,
              uptime: uptime.toFixed(2),
              downtime: downtime.toFixed(2),
              mtbf: mtbf.toFixed(2),
              mttr: mttr.toFixed(2),
            };
          });
        })
      );
      resultsArray = resultsArray.flat();
    } else if (type === 'monthly') {
      resultsArray = await Promise.all(
        LINES.filter(Boolean).map(async (line) => {
          const query = `
            SELECT
                DATE_FORMAT(fstart_time, '%Y-%m') as month,
                SUM(fdur) AS total_fdur,
                COUNT(*) AS total_rows
            FROM v_current_error_2
            WHERE fline = '${line}'
            AND fstart_time BETWEEN '${fstartTime}' AND '${fendTime}'
            GROUP BY DATE_FORMAT(fstart_time, '%Y-%m')
            ORDER BY DATE_FORMAT(fstart_time, '%Y-%m')
          `;
          const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
          });
          return results.map((row) => {
            const [year, month] = row.month.split('-');
            const daysInMonth = new Date(year, month, 0).getDate();
            const uptime = daysInMonth * 24;
            const downtime = Number(row.total_fdur) || 0;
            const totalProblem = Number(row.total_rows) || 0;
            const mtbf = totalProblem > 0 ? Math.abs((uptime - downtime) / totalProblem) : 0;
            const mttr = totalProblem > 0 ? Math.abs(downtime / totalProblem) : 0;
            return {
              fline: line,
              date: row.month,
              totalFdur: downtime,
              totalRows: totalProblem,
              uptime: uptime.toFixed(2),
              downtime: downtime.toFixed(2),
              mtbf: mtbf.toFixed(2),
              mttr: mttr.toFixed(2),
            };
          });
        })
      );
      resultsArray = resultsArray.flat();
    } else if (type === 'machines') {
      resultsArray = await Promise.all(
        LINES.filter(Boolean).map(async (line) => {
          const query = `
            SELECT
                fmc_name,
                SUM(fdur) AS total_fdur,
                COUNT(*) AS total_rows
            FROM v_current_error_2
            WHERE fline = '${line}'
            AND fstart_time BETWEEN '${fstartTime}' AND '${fendTime}'
            GROUP BY fmc_name
            ORDER BY fmc_name
          `;

          const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
          });

          return results.map((row) => {
            const uptime = diffDays * 24;
            const downtime = Number(row.total_fdur) || 0;
            const totalProblem = Number(row.total_rows) || 0;
            const mtbf = totalProblem > 0 ? Math.abs((uptime - downtime) / totalProblem) : 0;
            const mttr = totalProblem > 0 ? Math.abs(downtime / totalProblem) : 0;

            return {
              fmc_name: row.fmc_name,
              fline: line,
              totalFdur: downtime,
              totalRows: totalProblem,
              uptime: uptime.toFixed(2),
              downtime: downtime.toFixed(2),
              mtbf: mtbf.toFixed(2),
              mttr: mttr.toFixed(2),
            };
          });
        })
      );
      resultsArray = resultsArray.flat();
    } else {
      resultsArray = await Promise.all(
        LINES.filter(Boolean).map(async (line) => {
          const query = `
            SELECT 
                SUM(fdur) AS total_fdur,
                COUNT(*) AS total_rows
            FROM v_current_error_2
            WHERE fline = '${line}'
            AND fstart_time BETWEEN '${fstartTime}' AND '${fendTime}';
          `;
          const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
          });
          const finalData = results[0] || {};
          const uptime = Number(diffDays * 24);
          const downtime = Number(finalData.total_fdur) || 0;
          const totalProblem = Number(finalData.total_rows) || 0;
          const mtbf = totalProblem > 0 ? Math.abs((uptime - downtime) / totalProblem) : 0;
          const mttr = totalProblem > 0 ? Math.abs(downtime / totalProblem) : 0;
          return {
            fline: line,
            fStartTime: fstartTime,
            fEndTime: fendTime,
            totalFdur: downtime,
            totalRows: totalProblem,
            uptime: uptime.toFixed(2),
            downtime: downtime.toFixed(2),
            mtbf: mtbf.toFixed(2),
            mttr: mttr.toFixed(2),
          };
        })
      );
    }

    res.status(httpStatus.OK).json({
      message: 'MTBF/MTTR Data Retrieved Successfully',
      status: httpStatus.OK,
      data: resultsArray,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  defaultController,
  getMTBFController,
  getMTTRController,
  getMtBFMTTRController,
};