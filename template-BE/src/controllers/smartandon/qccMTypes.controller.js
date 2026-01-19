const httpStatus = require('http-status');
const { QccMTypes } = require('../../models');

const getQccMTypes = async (req, res, next) => {
  try {
    const types = await QccMTypes.findAll({
      attributes: ['type_id', 'type_nm'],
      order: [['type_id', 'ASC']],
    });
    res.status(httpStatus.OK).json(types);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getQccMTypes,
};
