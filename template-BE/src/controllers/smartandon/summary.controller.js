const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const getLTBSummary = async (req, res, next) => {
  try {
    const { problemCategory } = req.query;

    let whereClause = 'WHERE fid IS NOT NULL';

    if (problemCategory) {
      whereClause += ` AND (problemCategory = ${problemCategory}`;
      if (problemCategory == 3) {
        whereClause += `
          OR (
            ((fdur >= 120 AND fdur < 659) AND (line_id = 1 OR line_id = 2)) OR
            ((fdur >= 120 AND fdur < 359) AND (line_id IN (3,4,5,6))) OR
            (fdur >= 15 AND fdur < 179 AND line_id = 7)
          )
        `;
      } else if (problemCategory == 4) {
        whereClause += `
          OR (
            ((fdur >= 659) AND (line_id = 1 OR line_id = 2)) OR
            ((fdur >= 359) AND (line_id IN (3,4,5,6))) OR
            (fdur >= 179 AND line_id = 7)
          )
        `;
      }
      whereClause += `)`;
    } else {
      whereClause += ` AND ((fline = 'ASSY LINE' AND fdur >= 15) OR (fline <> 'ASSY LINE' AND fdur >= 120))`;
    }

    const raw = await sequelize.query(
      `SELECT
        fid,
        fline,
        fmc_name,
        ferror_name,
        fstart_time,
        fdur,
        cmTlApprove,
        cmLhApprove,
        cmShApprove,
        cmDhApprove,
        cmTlFeedback,
        cmLhFeedback,
        cmShFeedback,
        cmDhFeedback,
        fpermanet_cm,
        fpermanet_cm_lama
      FROM v_current_error_2
      ${whereClause}
      ORDER BY fid ASC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const mapStatus = (approve, thresholdDays, feedbackField) => {
      if (approve === 1) return 'dotApprove';
      const daysSince = (d) =>
        (Date.now() - new Date(d).getTime()) / (1000 * 3600 * 24);
      if (daysSince(approve === 0 ? feedbackField.start : null) >= thresholdDays && !feedbackField.feedback)
        return 'dotDelay';
      if (feedbackField.feedback) return 'dotComment';
      return 'dot';
    };

    // Debug logging for first item to check data structure
    if (raw.length > 0) {
      console.log('🔍 Sample item fpermanet_cm:', raw[0].fpermanet_cm, 'Type:', typeof raw[0].fpermanet_cm, 'IsArray:', Array.isArray(raw[0].fpermanet_cm));
      console.log('🔍 Sample item fpermanet_cm_lama:', raw[0].fpermanet_cm_lama, 'Type:', typeof raw[0].fpermanet_cm_lama, 'IsArray:', Array.isArray(raw[0].fpermanet_cm_lama));
    }

    // Calculate LTR/SLTR counts based on fdur and line_id
    let ltrCount = 0;
    let sltrCount = 0;

    raw.forEach(item => {
      const { fdur, line_id } = item;
      if ((fdur >= 120 && fdur < 659 && (line_id === 1 || line_id === 2)) ||
          (fdur >= 120 && fdur < 359 && [3,4,5,6].includes(line_id)) ||
          (fdur >= 15 && fdur < 179 && line_id === 7)) {
        ltrCount++;
      } else if ((fdur >= 659 && (line_id === 1 || line_id === 2)) ||
                 (fdur >= 359 && [3,4,5,6].includes(line_id)) ||
                 (fdur >= 179 && line_id === 7)) {
        sltrCount++;
      }
    });

    const data = raw.map(item => ({
      ...item,
      lhCheck: item.cmLhApprove === 1 ? 'approved' : (item.cmLhFeedback ? 'commented' : 'delayed'),
      shCheck: item.cmShApprove === 1 ? 'approved' : (item.cmShFeedback ? 'commented' : 'delayed'),
      dhCheck: item.cmDhApprove === 1 ? 'approved' : (item.cmDhFeedback ? 'commented' : 'delayed'),
    }));

    res.status(httpStatus.OK).json({
      message: 'LTB Summary fetched successfully',
      data: {
        delayProblems: data,
        count: [0, 0, 0, 0],
        countFin: [0, 0, 0, 0],
        ltrCount,
        sltrCount,
      },
    });
  } catch (error) {
    next(error);
  }
  
};

const getLTRSLTRSummary = async (req, res, next) => {
  try {
    const { type } = req.query; // 'ltr' or 'sltr'

    let whereClause = 'WHERE fid IS NOT NULL AND ((fline = \'ASSY LINE\' AND fdur >= 15) OR (fline <> \'ASSY LINE\' AND fdur >= 120))';

    if (type === 'ltr') {
      whereClause += ` AND (
        ((fdur >= 120 AND fdur < 659) AND (line_id = 1 OR line_id = 2)) OR
        ((fdur >= 120 AND fdur < 359) AND (line_id IN (3,4,5,6))) OR
        (fdur >= 15 AND fdur < 179 AND line_id = 7)
      )`;
    } else if (type === 'sltr') {
      whereClause += ` AND (
        ((fdur >= 659) AND (line_id = 1 OR line_id = 2)) OR
        ((fdur >= 359) AND (line_id IN (3,4,5,6))) OR
        (fdur >= 179 AND line_id = 7)
      )`;
    }

    const raw = await sequelize.query(
      `SELECT
        fid,
        fline,
        fmc_name,
        ferror_name,
        fstart_time,
        fdur,
        cmTlApprove,
        cmLhApprove,
        cmShApprove,
        cmDhApprove,
        cmTlFeedback,
        cmLhFeedback,
        cmShFeedback,
        cmDhFeedback,
        fpermanet_cm,
        fpermanet_cm_lama
      FROM v_current_error_2
      ${whereClause}
      ORDER BY fid ASC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const data = raw.map(item => ({
      ...item,
      lhCheck: item.cmLhApprove === 1 ? 'approved' : (item.cmLhFeedback ? 'commented' : 'delayed'),
      shCheck: item.cmShApprove === 1 ? 'approved' : (item.cmShFeedback ? 'commented' : 'delayed'),
      dhCheck: item.cmDhApprove === 1 ? 'approved' : (item.cmDhFeedback ? 'commented' : 'delayed'),
    }));

    res.status(httpStatus.OK).json({
      message: `${type.toUpperCase()} Summary fetched successfully`,
      data: {
        delayProblems: data,
        count: [0, 0, 0, 0],
        countFin: [0, 0, 0, 0],
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLTBSummary,
  getLTRSLTRSummary,
};

