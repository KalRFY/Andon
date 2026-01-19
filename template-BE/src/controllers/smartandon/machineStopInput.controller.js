const httpStatus = require('http-status');
const { sequelize } = require('../../models');


const getMachineStopInput = async (req, res, next) => {
  try {
    const [problemMachine, metadata] = await sequelize.query(`
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
    res.status(httpStatus.OK).json(problemMachine);
  } catch (error) {
    next(error);
  }
};

const getProblemNameSuggestions = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const [results, metadata] = await sequelize.query(`
      SELECT DISTINCT ferror_name
      FROM tb_error_log_2
      WHERE ferror_name LIKE :search
      ORDER BY ferror_name ASC
      LIMIT 20
    `, {
      replacements: { search: '%' + search + '%' },
      type: sequelize.QueryTypes.SELECT}
    );
    const problemNames = results.map(row => row.ferror_name);
    res.status(httpStatus.OK).json(problemNames);
  } catch (error) {
    next(error);
  }
};

const putMachineStopInput = async (req, res, next) => {
  try {
    console.log('Received request body:', req.body);

    const { fmc_id, ferror_name, fstart_time, foperator, lineName } = req.body;

    let values = '';
    let columns = '';

    if (fmc_id) {
      columns += 'fmc_id';
      values += `${fmc_id}`;
    }
    if (ferror_name){
      columns += columns ? ', ferror_name' : 'ferror_name';
      values += `, '${ferror_name}'`;
    }
    if (fstart_time){
      columns += columns ? ', fstart_time' : 'fstart_time';
      values += `, '${fstart_time}'`;
    }
    if (foperator){
      columns += columns ? ', foperator' : 'foperator';
      values += `, '${foperator}'`;
    }


    console.log("Columns: " + columns);
    console.log("Values: " + values);

    if (!fmc_id || !ferror_name) {
      console.log('Missing required fields:', { fmc_id, ferror_name, fstart_time, foperator, lineName });
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Missing required fields' });
    }

    const insertQuery = `
      INSERT INTO tb_error_log_2 (${columns})
      VALUES (${values})
    `;

    console.log("Constructed Query: " + insertQuery);
    await sequelize.query(insertQuery, {
      type: sequelize.QueryTypes.INSERT,
    });
    res.status(httpStatus.CREATED).json({ message: 'Error log inserted successfully' });

  } catch (error) {
    console.error('Error in putMachineStopInput:', error);
    next(error);
  }
};

module.exports = {
  getMachineStopInput,
  getProblemNameSuggestions,
  putMachineStopInput,
};
