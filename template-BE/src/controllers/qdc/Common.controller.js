const httpStatus = require('http-status');
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { CommonService } = require('../../services');
const CommonAPI = require('../../utils/CommonAPI');
const moment = require('moment');

const searchLine = catchAsync(async (req, res) => {
  const Line = await CommonService.searchLine();
  if (Line[0].length == 0) {
    res.send({
      status:httpStatus.OK,
      message: 'Line not found',
      data: null,
      details: null
    });
  }else{
    res.send({
      status:httpStatus.OK,
      message: null,
      data: Line[0],
      details: null
    });
  }
});

module.exports = {
  searchLine
};
