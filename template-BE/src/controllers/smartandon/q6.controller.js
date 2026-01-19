/* eslint-disable no-control-regex */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-console */
const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const defaultController = async (req, res) => {
  return res.status(httpStatus.OK).json({
    message: 'Welcome to the Q6 Controller',
    status: httpStatus.OK,
  });
};

const getQ6AnalysisController = async (req, res, next) => {
  try {
    const startDate = req.query.startDate || req.query.fstart_date;
    const endDate = req.query.endDate || req.query.fend_date;
    const line = req.query.line || req.query.fline;
    const isAbnormalRaw = req.query.isAbnormal ? req.query.isAbnormal : false;
    const isFreqRaw = req.query.isFreq ? req.query.isFreq : false;

    const isAbnormalFlag = String(isAbnormalRaw) === 'true';
    const isFreqFlag = String(isFreqRaw) === 'true';

    let ltbClause = `AND (
        (fdur >= 120 AND (fline = 'Cylinder Head' OR fline = 'Cylinder Block' OR fline = 'Crank shaft' OR fline = 'Cam Shaft' OR fline = 'HPDC' OR fline = 'LPDC'))
      ) OR (
        (fdur >= 15 AND fline = 'ASSY LINE')
      )`;

    if (line && line !== 'ALL') {
      if (line === 'ASSY LINE') {
        ltbClause = `AND fdur >= 15 AND (fline = 'ASSY LINE')`;
      } else {
        ltbClause = `AND fdur >= 120 AND (fline = '${line}')`;
      }
    }

    const where = `fstart_time BETWEEN '${startDate}' AND '${endDate}' ${ltbClause} AND fstep_new NOT LIKE '%"quick6":""%' AND fstep_new <> '[]'`;

    const sql = `
      SELECT fid, fline, ferror_name, fstep_new
      FROM v_current_error_2
      WHERE ${where}
    `;

    const rawRows = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    const safeParseSteps = (raw) => {
      if (!raw) return null;
      try {
        const cleaned = typeof raw === 'string' ? raw.replace(/[\u0000-\u001F]+/g, '') : raw;
        return JSON.parse(cleaned);
      } catch (e) {
        return null;
      }
    };

    const colorForIndex = (i) => {
      // Generate a random hex color
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      return randomColor;
    };

    const responseMap = {
      series: [],
      chartOptions: {
        strokeWidth: [],
        enabledOnSeries: [],
        colors: [],
        yaxis: [
          {
            title: { text: isFreqFlag ? 'Frequency' : 'Actual (min)' },
          },
        ],
      },
      data: [],
    };

    const containerStandard = [0, 0, 0, 0, 0, 0];

    rawRows.forEach((row, rowIdx) => {
      const steps = safeParseSteps(row.fstep_new);
      if (!steps || !Array.isArray(steps) || steps.length === 0) return;

      const containerActual = [0, 0, 0, 0, 0, 0];

      responseMap.chartOptions.colors.push(colorForIndex(rowIdx));
      responseMap.chartOptions.strokeWidth.push(0);
      responseMap.chartOptions.enabledOnSeries.push(rowIdx);
      responseMap.chartOptions.yaxis.push({ show: false, opposite: true });

      steps.forEach((step) => {
        const key = step && step.quick6;
        if (!key || typeof key !== 'string' || !key.startsWith('Q')) return;
        const idx = parseInt(key.slice(1), 10) - 1;
        if (Number.isNaN(idx) || idx < 0 || idx > 5) return;

        const actual = Number(step && step.actualTime) || 0;
        const ideal = Number(step && step.idealTime) || 0;

        if (isAbnormalFlag && !isFreqFlag) {
          if (actual > ideal) {
            containerActual[idx] += actual;
            containerStandard[idx] += ideal;
          } else {
            containerActual[idx] += 0;
            containerStandard[idx] += 0;
          }
          responseMap.data.push(row);
        } else if (!isAbnormalFlag && !isFreqFlag) {
          containerActual[idx] += actual;
          containerStandard[idx] += ideal;
          responseMap.data.push(row);
        } else {
          containerActual[idx] += 1;
          containerStandard[idx] += 1;
          responseMap.data.push(row);
        }
      });

      responseMap.series.push({
        fid: row.fid,
        name: `${row.fline} - ${row.ferror_name}`,
        type: 'column',
        data: containerActual,
      });
    });

    responseMap.chartOptions.colors.push(colorForIndex(responseMap.chartOptions.colors.length));
    responseMap.series.push({ name: 'Standard', type: 'line', data: containerStandard });
    responseMap.chartOptions.strokeWidth.push(4);
    responseMap.chartOptions.enabledOnSeries.push(responseMap.chartOptions.enabledOnSeries.length);
    responseMap.chartOptions.yaxis.push({ show: false });

    return res.status(200).json({
      message: 'Graph Q6 data generated',
      status: 200,
      data: responseMap,
    });
  } catch (err) {
    console.error('Error in getQ6AnalysisController:', err);
    return next(err);
  }
};

const getO6AnalysisController = async (req, res, next) => {
  try {
    const startDate = req.query.startDate || req.query.fstart_date;
    const endDate = req.query.endDate || req.query.fend_date;
    const line = req.query.line || req.query.fline;
    const isFreqRaw = req.query.isFreq ? req.query.isFreq : false;

    const isFreqFlag = String(isFreqRaw) === 'true';

    let ltbClause = `AND (
        (fdur >= 120 AND (fline = 'Cylinder Head' OR fline = 'Cylinder Block' OR fline = 'Crank shaft' OR fline = 'Cam Shaft' OR fline = 'HPDC' OR fline = 'LPDC'))
      ) OR (
        (fdur >= 15 AND fline = 'ASSY LINE')
      )`;

    if (line && line !== 'ALL') {
      if (line === 'ASSY LINE') {
        ltbClause = `AND fdur >= 15 AND (fline = 'ASSY LINE')`;
      } else {
        ltbClause = `AND fdur >= 120 AND (fline = '${line}')`;
      }
    }

    const where = `fstart_time BETWEEN '${startDate}' AND '${endDate}' ${ltbClause} AND oCategory IS NOT NULL`;

    const sql = `
      SELECT fid, fline, ferror_name, fdur, oCategory, fstep_new
      FROM v_current_error_2
      WHERE ${where}
      ORDER BY fid ASC
    `;

    const rawRows = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    console.log('O6 Analysis - Raw rows fetched:', rawRows.length);
    console.log('O6 Analysis - Sample row:', rawRows[0] || 'No rows');
    console.log('O6 Analysis - Filters applied:', { startDate, endDate, line, isFreqFlag });

    const safeParseSteps = (raw) => {
      if (!raw) return null;
      try {
        const cleaned = typeof raw === 'string' ? raw.replace(/[\u0000-\u001F]+/g, '') : raw;
        return JSON.parse(cleaned);
      } catch (e) {
        return null;
      }
    };

    const colorForIndex = (i) => {
      // Generate a random hex color
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      return randomColor;
    };

    const responseMap = {
      series: [],
      chartOptions: {
        strokeWidth: [],
        enabledOnSeries: [],
        colors: [],
        yaxis: [
          {
            title: { text: isFreqFlag ? 'Frequency' : 'Actual (min)' },
          },
        ],
      },
      data: [],
    };

    const containerStandard = [0, 0, 0, 0, 0, 0];

    rawRows.forEach((row, rowIdx) => {
      const containerActual = [0, 0, 0, 0, 0, 0];

      responseMap.chartOptions.colors.push(colorForIndex(rowIdx));
      responseMap.chartOptions.strokeWidth.push(0);
      responseMap.chartOptions.enabledOnSeries.push(rowIdx);
      responseMap.chartOptions.yaxis.push({ show: false, opposite: true });

      // Parse oCategory to get O1-O6 values
      const oCategory = row.oCategory;
      if (oCategory && typeof oCategory === 'string') {
        const idx = parseInt(oCategory, 10) - 1;
        if (!Number.isNaN(idx) && idx >= 0 && idx <= 5) {
          if (isFreqFlag) {
            containerActual[idx] += 1;
            containerStandard[idx] += 1;
          } else {
            containerActual[idx] += row.fdur || 0;
            containerStandard[idx] += 0; // No standard for O6
          }
          responseMap.data.push(row);
        }
      }

      if (containerActual.some(val => val > 0)) {
        responseMap.series.push({
          fid: row.fid,
          name: `${row.fline} - ${row.ferror_name}`,
          type: 'column',
          data: containerActual,
        });
      }
    });

    responseMap.chartOptions.colors.push(colorForIndex(responseMap.chartOptions.colors.length));
    responseMap.series.push({ name: 'Standard', type: 'line', data: containerStandard });
    responseMap.chartOptions.strokeWidth.push(4);
    responseMap.chartOptions.enabledOnSeries.push(responseMap.chartOptions.enabledOnSeries.length);
    responseMap.chartOptions.yaxis.push({ show: false });

    return res.status(200).json({
      message: 'Graph O6 data generated',
      status: 200,
      data: responseMap,
    });
  } catch (err) {
    console.error('Error in getO6AnalysisController:', err);
    return next(err);
  }
};

module.exports = {
  defaultController,
  getQ6AnalysisController,
  getO6AnalysisController,
};
