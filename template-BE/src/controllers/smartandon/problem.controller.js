const httpStatus = require('http-status');
const { object } = require('joi');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { sequelize } = require('../../models');

const getProblem = async (req, res, next) => {
  try {
    const [problems, metadata] = await sequelize.query(`
      SELECT
        fid,
        fmc_id,
        freg,
        fbit,
        ferror_name,
        ferror_detail,
        fstart_time,
        fend_time,
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
        keywords,
        fpermanet_cm_lama,
        fyokoten,
        fyokoten_pic,
        fyokoten_date,
        fiveWhyLhApprove,
        fiveWhyShApprove,
        fiveWhyShFeedback,
        fiveWhyLhFeedback,
        cmLhApprove,
        cmShApprove,
        cmShFeedback,
        cmLhFeedback,
        temporaryAction,
        cmDhApprove,
        cmDhFeedback,
        cmTlApprove,
        cmTlFeedback,
        fattachment,
        fjob_id,
        id_m_problem_member,
        why1_img,
        fstep_new,
        gapIlustrasi,
        why2_img,
        why12_img,
        why22_img,
        file_report,
        oCategory,
        qCategory,
        problemCategory
      FROM tb_error_log_2
      WHERE fid IS NOT NULL
      ORDER BY fid ASC
    `);
    res.status(httpStatus.OK).json(problems);
  } catch (error) {
    next(error);
  }
};

const getProblemView = async (req, res, next) => {
  try {
    console.log(`===============================${req}===============================`);
    const search = JSON.parse(req.query.search || '{}');
    console.log('[BE Debug] Received search params:', search);
    const page = parseInt(search.page) || 1;
    const limit = parseInt(search.limit) || 100;
    const offset = (page - 1) * limit;

    const { startDate } = search;
    const { finishDate } = search;
    const { machineName } = search;
    const { line } = search;
    const { problem } = search;
    const { problemCategory } = search;
    const { limitView } = search;
    const { groupBy } = search;
    const { sortColumn } = search;
    const { sortDirection } = search;
    const { weeklyCount } = search;

    console.log('Limit View:', limitView);
    console.log('Limit:', limit);
    console.log('groupBy:', groupBy);
    console.log('[BE] Parsed search:', search);
    console.log('[BE] weeklyCount:', weeklyCount);

    let limitClause = `LIMIT ${limit} OFFSET ${offset}`;
    let groupClause = '';
    if (limitView == 0) {
      limitClause = ``;
      console.log('Iyaaaaa');
    }
    if (limitView == 'group') {
      if (groupBy == 'monthly') {
        groupClause = 'GROUP BY CONCAT(YEAR(fstart_time), "-", LPAD(MONTH(fstart_time), 2, "0"))';
      } else if (groupBy == 'line') {
        limitClause = ``;
        groupClause = 'GROUP BY fline';
      } else {
        limitClause = ``;
        groupClause = 'GROUP BY DATE(fstart_time)';
      }
      limitClause = '';
      console.log('Group Clause:', groupClause);
    }
    console.log('Limit Clauseee:', limitClause);


    // Build where clause for date filtering
    let whereClause = 'WHERE fid IS NOT NULL';
    const replacements = {};

    // Convert dates to WIB timezone for consistent comparison
    const startDateWIB = startDate ? moment.tz(startDate, 'Asia/Jakarta').format('YYYY-MM-DD') : null;
    const finishDateWIB = finishDate ? moment.tz(finishDate, 'Asia/Jakarta').format('YYYY-MM-DD') : null;

    if (startDateWIB || finishDateWIB) {
      if (startDateWIB && finishDateWIB && startDateWIB === finishDateWIB) {
        whereClause += ` AND DATE(CONVERT_TZ(fstart_time, '+00:00', '+07:00')) = '${startDateWIB}'`;
      } else {
        if (startDateWIB) {
          whereClause += ` AND DATE(CONVERT_TZ(fstart_time, '+00:00', '+07:00')) >= '${startDateWIB}'`;
        }
        if (finishDateWIB) {
          whereClause += ` AND DATE(CONVERT_TZ(fend_time, '+00:00', '+07:00')) <= '${finishDateWIB}'`;
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

    if (limitView == 'Current') {
      whereClause += ` AND fend_time IS NULL`;
    }

    if (limitView == 'sparepart'){
      limitClause = ``;
      console.log('Iyaaaaa');
      whereClause += ` AND fpart_change IS NOT NULL AND TRIM(fpart_change) != ''`;
    }

    if (weeklyCount) {
      console.log('[BE WeeklyCount] Weekly count mode activated');

      // Calculate Monday of current week and today in WIB timezone
      const monday = moment.tz('Asia/Jakarta').startOf('week').add(1, 'day').format('YYYY-MM-DD');
      const today = moment.tz('Asia/Jakarta').format('YYYY-MM-DD');

      console.log('[BE WeeklyCount] Calculated dates:');
      console.log('  - Monday (start of week):', monday);
      console.log('  - Today (end of week):', today);
      console.log('  - Current timezone:', moment.tz.guess());

      whereClause += ` AND DATE(fstart_time) >= '${monday}'`;
      whereClause += ` AND DATE(fstart_time) <= '${today}'`;
      whereClause += ` AND problemCategory IN (3, 4)`;

      console.log('[BE WeeklyCount] Filtering for problemCategory IN (3=LTR, 4=SLTR)');
      limitClause = ``;
    }

    console.log(whereClause);

    // Query total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM v_current_error_2
      ${whereClause}
    `;
    const [countResult] = await sequelize.query(countQuery, { replacements });
    const { total } = countResult[0];

    // Query paginated data
    let selectFields = `
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
        pmCategory,
        problemCategory,
        file_report
    `;
    let orderBy = 'ORDER BY fid ASC';
    if (sortColumn && sortDirection) {
      const validSortColumns = ['fid', 'fstart_time', 'fmc_name', 'ferror_name', 'foperator', 'fline', 'fdur'];
      const validSortDirections = ['asc', 'desc'];

      if (validSortColumns.includes(sortColumn) && validSortDirections.includes(sortDirection.toLowerCase())) {
        if (sortColumn === 'fend_time') {
          orderBy = `ORDER BY ${sortColumn} ${sortDirection.toUpperCase()}`;
        } else if (sortColumn === 'fdur') {
          orderBy = `ORDER BY CAST(${sortColumn} AS UNSIGNED) ${sortDirection.toUpperCase()}`;
        } else {
          orderBy = `ORDER BY ${sortColumn} ${sortDirection.toUpperCase()}`;
        }
      }
    }

    if (limitView == 'group') {
      if (groupBy == 'monthly') {
        selectFields = "CONCAT(YEAR(fstart_time), '-', LPAD(MONTH(fstart_time), 2, '0')) as date, COUNT(*) as count";
      } else if (groupBy == 'line') {
        selectFields = 'fline as line, SUM(fdur) as totalDuration';
      } else {
        selectFields = 'DATE(fstart_time) as date, COUNT(*) as count';
      }
      orderBy = groupBy == 'line' ? 'ORDER BY line ASC' : 'ORDER BY date ASC';
    }

    if (weeklyCount) {
      selectFields = 'problemCategory, COUNT(*) as count';
      orderBy = 'ORDER BY problemCategory ASC';
      groupClause = 'GROUP BY problemCategory';

      console.log('[BE WeeklyCount] Select fields:', selectFields);
      console.log('[BE WeeklyCount] Group clause:', groupClause);
    }

    const dataQuery = `
      SELECT ${selectFields}
      FROM v_current_error_2
      ${whereClause}
      ${groupClause}
      ${orderBy}
      ${limitClause}
    `;
    
    console.log('Problem View Query:', dataQuery);
    console.log('Problem View');

    const [problemsView] = await sequelize.query(dataQuery, {
      replacements,
    });

    if (weeklyCount) {
      console.log('[BE WeeklyCount] Raw query results:', problemsView);
    }

    if (weeklyCount) {
      // Initialize counts
      let ltrCount = 0;
      let sltrCount = 0;

      // Process results
      problemsView.forEach(row => {
        if (parseInt(row.problemCategory) === 3) {
          ltrCount = row.count;
        } else if (parseInt(row.problemCategory) === 4) {
          sltrCount = row.count;
        }
      });

      console.log('[BE WeeklyCount] Processed counts:');
      console.log('  - LTR count (problemCategory=3):', ltrCount);
      console.log('  - SLTR count (problemCategory=4):', sltrCount);

      res.status(httpStatus.OK).json({
        ltrCount,
        sltrCount,
      });
    } else {
      res.status(httpStatus.OK).json({
        total,
        page,
        limit,
        data: problemsView,
      });
    }
  } catch (error) {
    next(error);
  }
};

const getProblemById = async (req, res, next) => {
  try {
    const { fid } = req.params;
    const query = `
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
        pmCategory,
        problemCategory,
        file_report,
        fpermanet_cm as countermeasureKenapaTerjadi,
        fpermanet_cm_lama as countermeasureKenapaLama
      FROM v_current_error_2
      WHERE fid = :fid
      LIMIT 1
    `;
    const [result] = await sequelize.query(query, {
      replacements: { fid },
    });
    if (result.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Problem not found' });
    }

    const query2 = `
      SELECT
        tb.type_uraian as typeUraian,
        tb.ilustration as ilustration
      FROM tb_r_uraian tb
      WHERE tb.error_id = :fid
    `

    const query3 = `
      SELECT
        tb.type_uraian as typeUraian,
        tb.desc_nm as desc_nm
      FROM tb_r_uraian tb
      WHERE tb.error_id = :fid
    `

    const queryAnalysis = `
      SELECT
        o.analisys_category as analisys_category,
        o.json_string as json_string
      FROM o_analisys o
      WHERE o.id_problem = :fid
    `

    const querySpareparts = `
      SELECT
        problemId,
        sparepart_category,
        material_number,
        isModify,
        partSimilar,
        Description,
        rov,
        lead_time,
        sparepart_nm,
        sparepartTr,
        sparepart_id,
        uuid,
        price,
        vendor,
        replacement_material_number,
        quantity,
        newPart,
        description
      FROM tb_sparepart
      WHERE problemId = :fid
    `
    const [uraianResult] = await sequelize.query(query2, {
      replacements: { fid },
    });

    const [descResult] = await sequelize.query(query3, {
      replacements: { fid },
    });

    const [analysis] = await sequelize.query(queryAnalysis, {
      replacements: { fid },
    });

    const [sparepartsResult] = await sequelize.query(querySpareparts, {
      replacements: { fid },
    });

    const statusMapReverse = {
      1: 1,
      2: 2,
    };

    const finalResult = {
      ...result[0],

      uraianResult: uraianResult.reduce((acc, item) => {
        acc[item.typeUraian] = item.ilustration;
        return acc;
      }, {}),

      descResult: descResult.reduce((desc, item) => {
        desc[item.typeUraian] = item.desc_nm;
        return desc;
      }, {}),

      analysis: analysis.reduce((analisis, item) => {
        analisis[item.analisys_category] = item.json_string;
        return analisis;
      }, {}),
      
      sparepart_list: sparepartsResult.map(item => ({
        sparepart: { id: item.sparepart_id, label: item.sparepart_nm },
        sparepartTr: item.sparepartTr,
        price: item.price,
        vendor: item.vendor,
        quantity: item.quantity,
        status: item.sparepart_category !== null ? item.sparepart_category : 1,
        total: (item.price || 0) * (item.quantity || 1),
        material_number: item.material_number,
        isModify: item.isModify,
        partSimilar: item.partSimilar,
        description: item.Description,
        rov: item.rov,
        lead_time: item.lead_time,
        uuid: item.uuid,
        replacement_material_number: item.replacement_material_number,
        newPart: item.newPart
      })),
    }
    console.log('Final Result:', finalResult);

    res.status(httpStatus.OK).json(finalResult);
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    const {
      machineName,
      line,
      problemDescription,
      operator,
      fid,
      maker,
      operationNo,
      avCategory,
      shift,
      startDate,
      finishDate,
      durationMin,
      problemCategory,
      itemTemporaryAction,
      rootcauses5Why,
      stepRepair,
      stepRepairNew,
      partChange,
      countermeasureKenapaTerjadi,
      yokoten,
      rootcause5WhyKenapaLama,
      tambahAnalisisLama,
      tambahAnalysisTerjadi,
      whyImage,
      whyLamaImage,
      comments5WhySH,
      comments5WhyLH,
      commentsCountermeasure,
      attachmentMeeting,
      file_report,
      uploadFile,
      actualImage,
      uploadImage,
      ilustrasiActual,
      ilustrasiStandart,
      standartImage,
      gapBetweenStandarAndActual,
      uraianKejadian,
      agreeTerms,
      countermeasureKenapaLama,
      pilihFocusThemaMember,
      pilihTaskforce,
      pilihO6,
      pilihQ6,
      comments5Why,
      lastReportFile,
      oCategory,
      qCategory,
      pmCategory,
      fiveWhyTlApprove,
      fiveWhyLhApprove,
      fiveWhyShApprove,
      cmTlApprove,
      cmLhApprove,
      cmShApprove,
      cmDhApprove,
      fiveWhyLhFeedback,
      fiveWhyShFeedback,
      cmLhFeedback,
      cmShFeedback,
      cmTlFeedback,
      cmDhFeedback,
      sparepart_list,
    } = req.body;
    console.log('UPDATE PROBLEM BODY:', req.body);
    console.log('Problems from body:', problemDescription);

    // Parse sparepart_list if it's a string
    let parsedSparepartList = sparepart_list;
    if (typeof sparepart_list === 'string') {
      try {
        parsedSparepartList = JSON.parse(sparepart_list);
      } catch (e) {
        console.error('Error parsing sparepart_list:', e);
        parsedSparepartList = [];
      }
    }

    if (!fid) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Problem ID (fid) is required' });
    }

    // const updateFields = [];
    const replacements = {
      machineName,
      line,
      problemDescription,
      operator,
      fid,
      maker,
      operationNo,
      avCategory,
      shift,
      startDate,
      finishDate,
      durationMin,
      problemCategory,
      itemTemporaryAction,
      rootcauses5Why,
      stepRepair,
      stepRepairNew,
      partChange,
      countermeasureKenapaTerjadi,
      yokoten,
      rootcause5WhyKenapaLama,
      tambahAnalisisLama,
      tambahAnalysisTerjadi,
      whyImage,
      whyLamaImage,
      comments5WhySH,
      comments5WhyLH,
      commentsCountermeasure,
      attachmentMeeting,
      file_report,
      uploadFile,
      actualImage,
      uploadImage,
      ilustrasiActual,
      ilustrasiStandart,
      standartImage,
      gapBetweenStandarAndActual,
      uraianKejadian,
      agreeTerms,
      countermeasureKenapaLama,
      pilihFocusThemaMember,
      pilihTaskforce,
      pilihO6,
      pilihQ6,
      oCategory,
      qCategory,
      pmCategory,
      comments5Why,
      lastReportFile,
      fiveWhyTlApprove,
      fiveWhyLhApprove,
      fiveWhyShApprove,
      cmTlApprove,
      cmLhApprove,
      cmShApprove,
      cmDhApprove,
      fiveWhyLhFeedback,
      fiveWhyShFeedback,
      cmLhFeedback,
      cmShFeedback,
      cmTlFeedback,
      cmDhFeedback,
    };

    const cmKenapaLama = countermeasureKenapaLama || [];
    console.log('Is array cmKenapaLama:', Array.isArray(cmKenapaLama));
    const cmKenapaTerjadi = countermeasureKenapaTerjadi || [];
    console.log('Is array cmKenapaTerjadi:', Array.isArray(cmKenapaTerjadi));
    console.log('Countermeasure Kenapa Lama:', cmKenapaLama);
    console.log('Countermeasure Kenapa Terjadi:', cmKenapaTerjadi);

    replacements.countermeasureKenapaTerjadi =
      typeof countermeasureKenapaTerjadi === 'object'
        ? JSON.stringify(countermeasureKenapaTerjadi)
        : countermeasureKenapaTerjadi;

    replacements.countermeasureKenapaLama =
      typeof countermeasureKenapaLama === 'object' ? JSON.stringify(countermeasureKenapaLama) : countermeasureKenapaLama;

    console.log('Replacements:', replacements);

    const updateFields = [
      't1.ferror_name = :problemDescription',
      't1.foperator = :operator',
      't1.fiveWhyShFeedback = :comments5WhySH',
      't1.fiveWhyLhFeedback = :comments5WhyLH',
      't1.temporaryAction = :itemTemporaryAction',
      't1.fpart_change = :partChange',
      't1.oCategory = :oCategory',
      't1.qCategory = :qCategory',
      't1.fyokoten = :yokoten',
      't1.problemCategory = :problemCategory',
      't1.why1_img = :whyImage',
      't1.why2_img = :whyLamaImage',
      't1.fpermanet_cm = :countermeasureKenapaTerjadi',
      't1.fpermanet_cm_lama = :countermeasureKenapaLama',
      't1.fstep_repair = :stepRepair',
      't1.fstart_time = :startDate',
      't1.fend_time = :finishDate',
    ];

    let updateField = 't1.fmc_id = t2.fid';

    if (machineName && machineName !== '' && Number.isInteger(Number(machineName))) {
      updateField += `, t1.fmc_id = :machineName`;
    }
    if (problemDescription) {
      updateField += `, t1.ferror_name = :problemDescription`;
    }
    if (operator) {
      updateField += `, t1.foperator = :operator`;
    }
    if (gapBetweenStandarAndActual) {  
      updateField += `, t1.gapIlustrasi = :gapBetweenStandarAndActual`;
    }
    if (avCategory) {
      updateField += `, t1.fav_categoty = :avCategory`;
    }
    if (shift) {
      updateField += `, t1.fshift = :shift`;
    }
    if (startDate) {
      // Convert to WIB timezone using moment
      const startDateWIB = moment.tz(startDate, 'Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
      updateField += `, t1.fstart_time = :startDate`;
      replacements.startDate = startDateWIB;
    }
    if (finishDate) {
      // Convert to WIB timezone using moment
      const finishDateWIB = moment.tz(finishDate, 'Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
      updateField += `, t1.fend_time = :finishDate`;
      replacements.finishDate = finishDateWIB;
    }
    if (problemCategory) {
      updateField += `, t1.problemCategory = :problemCategory`;
    }
    if (itemTemporaryAction) {
      updateField += `, t1.temporaryAction = :itemTemporaryAction`;
    }
    if (whyImage) {
      updateField += `, t1.why1_img = :whyImage`;
    }
    if (oCategory) {
      updateField += `, t1.oCategory = :oCategory`;
    }
    if (stepRepair && stepRepair.length > 0) {
      updateField += `, t1.fstep_repair = :stepRepair`;
    }
    if (partChange) {
      updateField += `, t1.fpart_change = :partChange`;
    }
    if (yokoten) {
      updateField += `, t1.fyokoten = :yokoten`;
    }
    if (qCategory) {
      updateField += `, t1.qCategory = :qCategory`;
    }
    if (pmCategory) {
      updateField += `, t1.pmCategory = :pmCategory`;
    }
    if (whyLamaImage) {
      updateField += `, t1.why2_img = :whyLamaImage`;
    }
    if (countermeasureKenapaLama) {
      updateField += `, t1.fpermanet_cm_lama = :countermeasureKenapaLama`;
    }
    // if (attachmentMeeting) {
    //   updateField += `, t1.fpermanet_cm_lama = :attachmentMeeting`;
    // }
    if (req.files) {
      console.log('Files uploaded:', req.files);
      if (req.files.actualImage) {
        const fileObj = req.files.actualImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        console.log('New path for actualImage:', newPath);
        fs.renameSync(fileObj.path, newPath);
        replacements.actualImage = newPath;
      }
      if (req.files.uploadImage) {
        const fileObj = req.files.uploadImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        
        fs.renameSync(fileObj.path, newPath);
        replacements.uploadImage = newPath;
      }
      if (req.files.standartImage) {
        const fileObj = req.files.standartImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        console.log('New path for standartImage:', newPath);
        fs.renameSync(fileObj.path, newPath);
        replacements.standartImage = newPath;
      }
      if (req.files.whyImage) {
        const fileObj = req.files.whyImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        fs.renameSync(fileObj.path, newPath);
        if (newPath) {
          updateField += `, t1.why1_img = '${newPath}'`;
        }
      }
      if (req.files.whyLamaImage) {
        const fileObj = req.files.whyLamaImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        fs.renameSync(fileObj.path, newPath);
        if (newPath) {
          updateField += `, t1.why2_img = '${newPath}'`;
        }
      }
      if (req.files.uploadFile) {
        const fileObj = req.files.uploadFile[0];
        const ext = path.extname(fileObj.originalname);
        const reportsUploadDir = path.join(__dirname, `../../../reports/uploads/${fid}_${problemDescription}`);
        if (!fs.existsSync(reportsUploadDir)) {
          fs.mkdirSync(reportsUploadDir, { recursive: true });
        }
        const newPath = `./reports/uploads/${fid}_${problemDescription}/${path.basename(fileObj.path)}${ext}`;
        fs.renameSync(fileObj.path, newPath);
        if (newPath) {
          replacements.uploadFile = newPath;
          updateField += `, t1.file_report = :uploadFile`;
        }
        console.log('New path for uploadFile:', newPath);
        console.log('File upload completed:', fileObj.uploadFile);
      }
      if (req.files.attachmentMeeting) {
        const fileObj = req.files.attachmentMeeting[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        fs.renameSync(fileObj.path, newPath);
        replacements.attachmentMeeting = newPath;
        updateField += `, t1.fattachment_meeting = :attachmentMeeting`;
      }
      if (req.files.file_report) {
        const fileObj = req.files.file_report[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        fs.renameSync(fileObj.path, newPath);
        replacements.file_report = newPath;
        updateField += `, t1.ffile_report = :file_report`;
      }
    }

    if (countermeasureKenapaTerjadi) {
      updateField += `, t1.fpermanet_cm = :countermeasureKenapaTerjadi`;
    }
    if (countermeasureKenapaLama) {
      updateField += `, t1.fpermanet_cm_lama = :countermeasureKenapaLama`;
    }
    // if (fiveWhyTlApprove !== undefined) {
    //   updateField += `, t1.fiveWhyTlApprove = :fiveWhyTlApprove`;
    // }
    if (fiveWhyLhApprove !== undefined) {
      updateField += `, t1.fiveWhyLhApprove = :fiveWhyLhApprove`;
    }
    if (fiveWhyShApprove !== undefined) {
      updateField += `, t1.fiveWhyShApprove = :fiveWhyShApprove`;
    }
    if (cmTlApprove !== undefined) {
      updateField += `, t1.cmTlApprove = :cmTlApprove`;
    }
    if (cmLhApprove !== undefined) {
      updateField += `, t1.cmLhApprove = :cmLhApprove`;
    }
    if (cmShApprove !== undefined) {
      updateField += `, t1.cmShApprove = :cmShApprove`;
    }
    if (cmDhApprove !== undefined) {
      updateField += `, t1.cmDhApprove = :cmDhApprove`;
    }
    if (fiveWhyLhFeedback !== undefined) {
      updateField += `, t1.fiveWhyLhFeedback = :fiveWhyLhFeedback`;
    }
    if (fiveWhyShFeedback !== undefined) {
      updateField += `, t1.fiveWhyShFeedback = :fiveWhyShFeedback`;
    }
    if (cmLhFeedback !== undefined) {
      updateField += `, t1.cmLhFeedback = :cmLhFeedback`;
    }
    if (cmShFeedback !== undefined) {
      updateField += `, t1.cmShFeedback = :cmShFeedback`;
    }
    if (cmTlFeedback !== undefined) {
      updateField += `, t1.cmTlFeedback = :cmTlFeedback`;
    }
    if (cmDhFeedback !== undefined) {
      updateField += `, t1.cmDhFeedback = :cmDhFeedback`;
    }
    if (stepRepairNew !== undefined) {
      try {
        let parsedStepRepairNew = stepRepairNew;

        // If stepRepairNew is a string, parse it as JSON
        if (typeof stepRepairNew === 'string') {
          try {
            parsedStepRepairNew = JSON.parse(stepRepairNew);
            console.log('stepRepairNew parsed from string:', parsedStepRepairNew.length, 'items');
          } catch (parseError) {
            console.warn('stepRepairNew is a string but not valid JSON, treating as empty array');
            parsedStepRepairNew = [];
          }
        }

        // Validate that parsedStepRepairNew is an array
        if (!Array.isArray(parsedStepRepairNew)) {
          console.warn('stepRepairNew is not an array, converting to empty array');
          replacements.stepRepairNew = JSON.stringify([]);
        } else {
          // Remove 'id' field from each item to match expected format
          parsedStepRepairNew = parsedStepRepairNew.map(item => {
            const { id, ...rest } = item;
            return rest;
          });
          replacements.stepRepairNew = JSON.stringify(parsedStepRepairNew);
          console.log('stepRepairNew data saved:', parsedStepRepairNew.length, 'items');
        }
        updateField += `, t1.fstep_new = :stepRepairNew`;
      } catch (error) {
        console.error('Error processing stepRepairNew data:', error);
        replacements.stepRepairNew = JSON.stringify([]);
        updateField += `, t1.fstep_new = :stepRepairNew`;
      }
    }
    
    console.log('Replacements:', replacements);
    const updateQuery = `
      UPDATE tb_error_log_2 t1
      JOIN tb_mc t2 ON t1.fmc_id = t2.fid
      LEFT JOIN m_problem_member mpm ON t1.fid = mpm.id_m_problem
      LEFT JOIN tb_mt_member tmm ON tmm.fid = mpm.id_m_member
      SET ${updateField}
      WHERE t1.fid = :fid;
    `;
    await sequelize.query(updateQuery, { replacements });

    // Removed incomplete and invalid updateQuerySparepart as delete + insert approach is used for sparepart updates

    console.log('Update Query:', updateQuery);

    const uraianKeys = ['general', 'standard', 'actual'];
    const analysisKeys = ['TERJADI', 'LAMA'];
    // const sparepartsKeys = ['1', '2', '3'];

    const uraianData = {
      general: {
        type_uraian: 'general',
        ilustration: replacements.uploadImage || null,
        desc_nm: replacements.uraianKejadian || null
      },
      standard: {
        type_uraian: 'standard',
        ilustration: replacements.standartImage || null,
        desc_nm: replacements.ilustrasiStandart || null
      },
      actual: {
        type_uraian: 'actual',
        ilustration: replacements.actualImage || null,
        desc_nm: replacements.ilustrasiActual || null
      }
    };

    const analysisData = {
      TERJADI: {
        analisys_category: 'TERJADI',
        json_string: replacements.tambahAnalysisTerjadi ? (typeof replacements.tambahAnalysisTerjadi === 'string' ? replacements.tambahAnalysisTerjadi : JSON.stringify(replacements.tambahAnalysisTerjadi)) : '[]'
      },
      LAMA: {
        analisys_category: 'LAMA',
        json_string: replacements.tambahAnalisisLama ? (typeof replacements.tambahAnalisisLama === 'string' ? replacements.tambahAnalisisLama : JSON.stringify(replacements.tambahAnalisisLama)) : '[]'
      },
    };

    for (const key of uraianKeys) {
      const item = uraianData[key];
      
      const checkQuery = `
        SELECT COUNT(*) as count FROM tb_r_uraian 
        WHERE error_id = :fid AND type_uraian = :type_uraian
      `;
      
      const [checkResult] = await sequelize.query(checkQuery, { 
        replacements: { 
          fid: replacements.fid, 
          type_uraian: item.type_uraian 
        } 
      });

      if (checkResult[0].count === 0) {
        const insertQuery = `
          INSERT INTO tb_r_uraian (error_id, type_uraian, ilustration, desc_nm)
          VALUES (:fid, :type_uraian, :ilustration, :desc_nm)
        `;
        await sequelize.query(insertQuery, { 
          replacements: {
            fid: replacements.fid,
            type_uraian: item.type_uraian,
            ilustration: item.ilustration,
            desc_nm: item.desc_nm
          }
        });
      } else {
        // Update existing record
        const updateQuery = `
          UPDATE tb_r_uraian 
          SET ilustration = :ilustration, desc_nm = :desc_nm
          WHERE error_id = :fid AND type_uraian = :type_uraian
        `;
        await sequelize.query(updateQuery, { 
          replacements: {
            fid: replacements.fid,
            type_uraian: item.type_uraian,
            ilustration: item.ilustration,
            desc_nm: item.desc_nm
          }
        });
      }
    };

    for (const key of analysisKeys) {
      const item = analysisData[key];
      
      const checkQuery = `
        SELECT COUNT(*) as count FROM o_analisys 
        WHERE id_problem = :fid AND analisys_category = :analisys_category
      `;
      
      const [checkResult] = await sequelize.query(checkQuery, { 
        replacements: { 
          fid: replacements.fid, 
          analisys_category: item.analisys_category 
        } 
      });

      if (checkResult[0].count === 0) {
        // Insert new record
        const insertQuery = `
          INSERT INTO o_analisys (id_problem, analisys_category, json_string)
          VALUES (:fid, :analisys_category, :json_string)
        `;
        await sequelize.query(insertQuery, { 
          replacements: {
            fid: replacements.fid,
            analisys_category: item.analisys_category,
            json_string: item.json_string || '[]',
          }
        });
      } else {
        // Update existing record
        const updateQuery = `
          UPDATE o_analisys 
          SET json_string = :json_string
          WHERE id_problem = :fid AND analisys_category = :analisys_category
        `;
        await sequelize.query(updateQuery, { 
          replacements: {
            fid: replacements.fid,
            analisys_category: item.analisys_category,
            json_string: item.json_string || '[]',
          }
        });
      }
    };

    // Handle sparepart_list updates
    if (parsedSparepartList && Array.isArray(parsedSparepartList)) {
      console.log('Processing sparepart_list for bulk upsert:', parsedSparepartList);

      // Collect sparepart_id list for deletion of removed items
      const currentSparepartIds = parsedSparepartList.map(sp => sp.sparepart_id || sp.sparepart?.id).filter(id => id !== null && id !== undefined);

      if (currentSparepartIds.length > 0) {
        // Delete spareparts not in the current list
        const deleteNotInQuery = `
          DELETE FROM tb_sparepart
          WHERE problemId = :fid AND sparepart_id NOT IN (:currentIds)
        `;
        await sequelize.query(deleteNotInQuery, {
          replacements: { fid: replacements.fid, currentIds: currentSparepartIds }
        });
      } else {
        // If no spareparts, delete all for this problem
        const deleteAllQuery = `
          DELETE FROM tb_sparepart
          WHERE problemId = :fid
        `;
        await sequelize.query(deleteAllQuery, { replacements: { fid: replacements.fid } });
      }

      if (parsedSparepartList.length > 0) {
        const values = [];
        const replacementsBulk = {};

        parsedSparepartList.forEach((sparepart, index) => {
          const sparepartCategory = sparepart.status || 1;
          const sparepartName = sparepart.sparepart?.label || '';
          const sparepartId = sparepart.sparepart_id || null;
          const sparepartTr = sparepart.sparepartTr || '';
          const materialNumber = sparepart.material_number || null;
          const price = sparepart.price || 0;
          const vendor = sparepart.vendor || '';
          const quantity = sparepart.quantity || 1;
          const isModify = sparepart.isModify || null;
          const partSimilar = sparepart.partSimilar || null;
          const newPart = sparepart.newPart || null;
          const description = sparepart.description || null;
          // const rov = sparepart.rov || null;
          // const leadTime = sparepart.lead_time || null;
          // const uuid = sparepart.uuid || null;
          // const replacementMaterialNumber = sparepart.replacement_material_number || null;

          values.push(`(:problemId, :sparepartCategory${index}, :sparepartName${index}, :sparepartTr${index}, :sparepartId${index}, :materialNumber${index}, :price${index}, :vendor${index}, :quantity${index}, :isModify${index}, :partSimilar${index}, :newPart${index}, :description${index})`);

          replacementsBulk[`sparepartCategory${index}`] = sparepartCategory;
          replacementsBulk[`sparepartName${index}`] = sparepartName;
          replacementsBulk[`sparepartTr${index}`] = sparepartTr;
          replacementsBulk[`sparepartId${index}`] = sparepartId;
          replacementsBulk[`materialNumber${index}`] = materialNumber;
          replacementsBulk[`price${index}`] = price;
          replacementsBulk[`vendor${index}`] = vendor;
          replacementsBulk[`quantity${index}`] = quantity;
          replacementsBulk[`isModify${index}`] = isModify;
          replacementsBulk[`partSimilar${index}`] = partSimilar;
          replacementsBulk[`newPart${index}`] = newPart;
          replacementsBulk[`description${index}`] = description;
          // replacementsBulk[`rov${index}`] = rov;
          // replacementsBulk[`leadTime${index}`] = leadTime;
          // replacementsBulk[`uuid${index}`] = uuid;
          // replacementsBulk[`replacementMaterialNumber${index}`] = replacementMaterialNumber;
        });

        replacementsBulk.problemId = replacements.fid;

        const insertSparepartQuery = `
          INSERT INTO tb_sparepart (
            problemId,
            sparepart_category,
            sparepart_nm,
            sparepartTr,
            sparepart_id,
            material_number,
            price,
            vendor,
            quantity,
            isModify,
            partSimilar,
            newPart,
            description
          ) VALUES ${values.join(', ')}
          ON DUPLICATE KEY UPDATE
            sparepart_category = VALUES(sparepart_category),
            sparepartTr = VALUES(sparepartTr),
            sparepart_id = VALUES(sparepart_id),
            sparepart_nm = VALUES(sparepart_nm),
            material_number = VALUES(material_number),
            price = VALUES(price),
            vendor = VALUES(vendor),
            quantity = VALUES(quantity),
            isModify = VALUES(isModify),
            partSimilar = VALUES(partSimilar),
            newPart = VALUES(newPart),
            description = VALUES(description)
        `;

        console.log('Bulk Insert Sparepart Query:', insertSparepartQuery);
        console.log('Bulk Insert Replacements:', replacementsBulk);

        await sequelize.query(insertSparepartQuery, { replacements: replacementsBulk });
      }
    }

    res.status(httpStatus.OK).json({ status: 'success', message: 'Problem updated successfully' });

  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('Deleting problem with ID:', id);

    const deleteQuery = `
      DELETE FROM tb_error_log_2
      WHERE fid = :id
    `;
    const [result] = await sequelize.query(deleteQuery, {
      replacements: { id },
    });

    if (result.affectedRows === 0) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Problem not found' });
    }

    res.status(httpStatus.OK).json({ message: 'Problem deleted successfully' });
  } catch (error) {
    next(error);
  }
};



module.exports = {
  getProblem,
  getProblemView,
  getProblemById,
  updateProblem,
  deleteProblem,
};
