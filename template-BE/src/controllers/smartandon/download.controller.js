/* eslint-disable no-console */
const fs = require('fs');
const stream = require('stream');
const path = require('path');
const httpStatus = require('http-status');
const { sequelize } = require('../../models');

let XLSXPopulate;

try {
  XLSXPopulate = require('xlsx-populate');
} catch (error) {
  console.warn('xlsx-populate module not found, download service will be disabled.');
  XLSXPopulate = null;
}

const { generatedStepRepairCellDuration, mappedImageFile } = require('../../services/downloadService');

exports.downloadReport = async (req, res, next) => {
  try {
    const { fid, problem } = req.query;

    if (!fid || !problem) {
      console.error('Missing fid or problem parameter');
      return res.status(httpStatus.BAD_REQUEST).send('Missing fid or problem parameter');
    }

    // Query database for file_report path
    const query = `SELECT file_report FROM tb_error_log_2 WHERE fid = :fid LIMIT 1`;
    const [result] = await sequelize.query(query, {
      replacements: { fid },
    });

    if (result.length > 0 && result[0].file_report) {
      let filePath = result[0].file_report;
      filePath = path.normalize(filePath);
      if (fs.existsSync(filePath)) {
        console.log(`Serving uploaded report file: ${filePath}`);
        return res.download(filePath);
      }
      console.error(`Uploaded report file not found on server: ${filePath}`);
      return res.status(httpStatus.NOT_FOUND).send('Uploaded report file not found on server');
    }
    console.warn(`No file_report entry found in database for fid: ${fid}`);

    // Fallback: serve latest file in folder
    const targetDir = path.join(__dirname, '../../../reports/Uploads', `${fid}_${problem}`);

    console.log(`Hasil Dir: ${targetDir}`);

    if (!fs.existsSync(targetDir)) {
      console.error(`Report folder not found: ${targetDir}`);
      return res.status(httpStatus.NOT_FOUND).send('Report folder not found');
    }

    // Read files in the target directory
    const files = fs
      .readdirSync(targetDir)
      .filter((file) => file.endsWith('.xlsx'))
      .map((file) => ({
        name: file,
        time: fs.statSync(path.join(targetDir, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
      console.error(`No report files found in folder: ${targetDir}`);
      return res.status(httpStatus.NOT_FOUND).send('No report files found');
    }

    const latestFile = files[0].name;
    const filePath = path.join(targetDir, latestFile);

    console.log(`Serving latest report file from folder: ${filePath}`);
    res.download(filePath, latestFile);
  } catch (error) {
    console.error('Error downloading report:', error);
    next(error);
  }
};

exports.downloadTemplate = async (req, res, next) => {
  const { fid } = req.query;
  try {
    if (!XLSXPopulate) {
      throw new Error('xlsx-populate module is not available. Cannot generate Excel file.');
    }

    const vCurrentError2DataQuery = `SELECT * FROM v_current_error_2 WHERE fid = :fid`;
    const vCurrentError2Data = await sequelize.query(vCurrentError2DataQuery, {
      replacements: { fid },
      type: sequelize.QueryTypes.SELECT,
    });

    const tbRUraianDataQuery = `SELECT * FROM tb_r_uraian WHERE error_id = :fid`;
    const tbRUraianData = await sequelize.query(tbRUraianDataQuery, {
      replacements: { fid },
      type: sequelize.QueryTypes.SELECT,
    });

    const problemData = vCurrentError2Data[0] || {};
    console.log('=== DOWNLOAD CONTROLLER DEBUG ===');
    console.log('vCurrentError2Data length:', vCurrentError2Data.length);
    console.log('problemData keys:', Object.keys(problemData));
    console.log('problemData.why1_img:', problemData.why1_img);
    console.log('problemData.why2_img:', problemData.why2_img);
    console.log('tbRUraianData length:', tbRUraianData.length);

    const generatedExcelPath = await generatedStepRepairCellDuration(
      res,
      problemData,
      tbRUraianData,
      './reports/template/draft_ltb.xlsx'
    );
    console.log('generatedExcelPath:', generatedExcelPath);

    await mappedImageFile(res, problemData, tbRUraianData, generatedExcelPath);
  } catch (error) {
    console.log(error);
    res.send('File Belum Lengkap! <a href="https:smartandonsys.web.app/problemHistory">Back</a>');
  }
};

const mime = require('mime-types');

exports.getAllProblems = async (req, res, next) => {
  try {
    const {
      startDate,
      finishDate,
      line,
      machineName,
      problem,
      problemCategory
    } = req.query;

    // Build query parameters
    const params = {
      startDate: startDate || undefined,
      finishDate: finishDate || undefined,
      line: line || undefined,
      machineName: machineName || undefined,
      problem: problem || undefined,
      problemCategory: problemCategory || undefined,
    };

    // Remove undefined parameters
    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    // Query to get all problems without pagination
    let query = `
      SELECT * FROM v_current_error_2 
      WHERE 1=1
    `;
    
    if (startDate) query += ' AND DATE(fend_time) >= :startDate';
    if (finishDate) query += ' AND DATE(fend_time) <= :finishDate';
    if (line) query += ' AND fline = :line';
    if (machineName) query += ' AND fmc_name = :machineName';
    if (problem) {
      query += ' AND ferror_name LIKE :problem';
      params.problem = `%${params.problem}%`;
    }
    if (problemCategory) query += ' AND problemCategory = :problemCategory';
    
    query += ' ORDER BY fend_time DESC';

    const results = await sequelize.query(query, {
      replacements: params,
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: results,
      total: results.length
    });
  } catch (error) {
    console.error('Error fetching all problems:', error);
    next(error);
  }
};

exports.getImageController = async (req, res) => {
  const pathImage = `${req.query.path}`;
  const folderPath = path.dirname(pathImage);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  if (!fs.existsSync(pathImage)) {
    return res.status(404).send('File not found');
  }

  const mimeType = mime.lookup(pathImage) || 'application/octet-stream';
  res.setHeader('Content-Type', mimeType);

  const r = fs.createReadStream(pathImage);
  const ps = new stream.PassThrough();

  stream.pipeline(r, ps, (err) => {
    if (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  });

  ps.pipe(res);
};

exports.downloadExcel = async (req, res, next) => {
  try {
    if (!XLSXPopulate) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).send('xlsx-populate module is not available');
    }

    const { startDate, finishDate, machineName, line, problem, problemCategory } = req.query;

    // Build where clause for filtering (same as getProblemView)
    let whereClause = 'WHERE fid IS NOT NULL';
    const replacements = {};

    if (startDate || finishDate) {
      if (startDate == finishDate) {
        whereClause += ` AND fstart_time LIKE '%${startDate}%'`;
        whereClause += ` AND fstart_time LIKE '%${finishDate}%'`;
      } else {
        if (startDate) {
          whereClause += ` AND fstart_time >= '${startDate}'`;
          replacements.startDate = startDate;
        }
        if (finishDate) {
          whereClause += ` AND fend_time <= '${finishDate}'`;
          replacements.finishDate = finishDate;
        }
      }
    }
    if (machineName) {
      whereClause += ` AND fmc_name LIKE '%${machineName}%'`;
    }
    if (line) {
      whereClause += ` AND line_id = ${line}`;
    }
    if (problem) {
      whereClause += ` AND ferror_name LIKE '%${problem}%'`;
    }

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
    }

    // Query data with the same structure as getProblemView
    const dataQuery = `
      SELECT
        fid,
        line_id,
        fline,
        fmc_name,
        fmaker,
        foperation_no,
        freg,
        fbit,
        ferror_name,
        ferror_detail,
        fstart_time,
        fend_time,
        fdur,
        foperator,
        fshift,
        freal_prob,
        fav_categoty,
        froot_cause,
        fstep_repair,
        fpart_change,
        fpermanet_cm,
        fwhy_analisys,
        fpdf_report,
        fimage,
        fDescImage,
        tmp,
        fpermanet_cm_lama,
        fyokoten,
        fyokoten_date,
        fyokoten_pic,
        fiveWhyLhApprove,
        fiveWhyShApprove,
        fiveWhyLhFeedback,
        fiveWhyShFeedback,
        cmLhApprove,
        cmShApprove,
        cmLhFeedback,
        cmShFeedback,
        temporaryAction,
        cmDhApprove,
        cmDhFeedback,
        cmTlApprove,
        cmTlFeedback,
        fattachment,
        id_m_problem_member,
        id_member_thema,
        fname_theme_member,
        fimage_member,
        why1_img,
        fstep_new,
        gapIlustrasi,
        why2_img,
        why12_img,
        why22_img,
        oCategory,
        qCategory,
        problemCategory,
        file_report
      FROM v_current_error_2
      ${whereClause}
      ORDER BY fid ASC
    `;

    console.log('Excel Download Query:', dataQuery);
    const [problemsData] = await sequelize.query(dataQuery, { replacements });

    // Create Excel workbook
    const workbook = await XLSXPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    // Set headers
    const headers = [
      'ID', 'Line ID', 'Line', 'Machine Name', 'Maker', 'Operation No', 
      'Reg', 'Bit', 'Problem Name', 'Problem Detail', 'Start Time', 
      'End Time', 'Duration', 'Operator', 'Shift', 'Real Problem',
      'AV Category', 'Root Cause', 'Step Repair', 'Part Change',
      'Permanent CM', 'Why Analysis', 'PDF Report', 'Image',
      'Desc Image', 'Temp', 'Permanent CM Lama', 'Yokoten',
      'Yokoten Date', 'Yokoten PIC', '5Why LH Approve', '5Why SH Approve',
      '5Why LH Feedback', '5Why SH Feedback', 'CM LH Approve', 'CM SH Approve',
      'CM LH Feedback', 'CM SH Feedback', 'Temporary Action', 'CM DH Approve',
      'CM DH Feedback', 'CM TL Approve', 'CM TL Feedback', 'Attachment',
      'Problem Member ID', 'Member Theme ID', 'Member Theme Name', 'Member Image',
      'Why 1 Image', 'Step New', 'Gap Illustration', 'Why 2 Image',
      'Why 12 Image', 'Why 22 Image', 'O Category', 'Q Category',
      'Problem Category', 'File Report'
    ];

    headers.forEach((header, index) => {
      sheet.cell(1, index + 1).value(header).style('bold', true);
    });

    // Fill data
    problemsData.forEach((problem, rowIndex) => {
      const row = rowIndex + 2;
      const values = [
        problem.fid, problem.line_id, problem.fline, problem.fmc_name,
        problem.fmaker, problem.foperation_no, problem.freg, problem.fbit,
        problem.ferror_name, problem.ferror_detail, problem.fstart_time,
        problem.fend_time, problem.fdur, problem.foperator, problem.fshift,
        problem.freal_prob, problem.fav_categoty, problem.froot_cause,
        problem.fstep_repair, problem.fpart_change, problem.fpermanet_cm,
        problem.fwhy_analisys, problem.fpdf_report, problem.fimage,
        problem.fDescImage, problem.tmp, problem.fpermanet_cm_lama,
        problem.fyokoten, problem.fyokoten_date, problem.fyokoten_pic,
        problem.fiveWhyLhApprove, problem.fiveWhyShApprove,
        problem.fiveWhyLhFeedback, problem.fiveWhyShFeedback,
        problem.cmLhApprove, problem.cmShApprove, problem.cmLhFeedback,
        problem.cmShFeedback, problem.temporaryAction, problem.cmDhApprove,
        problem.cmDhFeedback, problem.cmTlApprove, problem.cmTlFeedback,
        problem.fattachment, problem.id_m_problem_member, problem.id_member_thema,
        problem.fname_theme_member, problem.fimage_member, problem.why1_img,
        problem.fstep_new, problem.gapIlustrasi, problem.why2_img,
        problem.why12_img, problem.why22_img, problem.oCategory,
        problem.qCategory, problem.problemCategory, problem.file_report
      ];

      values.forEach((value, colIndex) => {
        sheet.cell(row, colIndex + 1).value(value);
      });
    });

    // Auto-size columns
    sheet.usedRange().style('autoWidth', true);

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="problems_export_${new Date().toISOString().split('T')[0]}.xlsx"`);

    // Send the Excel file
    const buffer = await workbook.outputAsync();
    res.send(buffer);

  } catch (error) {
    console.error('Error generating Excel file:', error);
    next(error);
  }
};
