const httpStatus = require('http-status');
const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");
const pick = require('../../utils/pick');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { GaugeService } = require('../../services');
const CommonAPI = require('../../utils/CommonAPI');
const moment = require('moment');

const createGauge = catchAsync(async (req, res) => {
  let gaugeDetail = req.body.gauge_detail
  if(gaugeDetail && gaugeDetail.length > 0){
    req.body.gauge_detail = JSON.stringify(gaugeDetail)
  }else{
    req.body.gauge_detail = '[]'
  }

  const Gauge = await GaugeService.createGauge(req.body,req.app.locals.userId);
  let response = Gauge[0][0].response
  if (response == 200){
    res.send({
      status: httpStatus.OK,
      message: "Successfully inserted data Gauge"
    });
  }else{
    res.send({
      status: httpStatus.FORBIDDEN,
      message: "Failed to insert data Gauge [Data Duplicate]"
    });
  }
});

const searchGauge = catchAsync(async (req, res) => {
  const filter = req.body.search;
  const options = pick(req.body, ['sortBy','sortOrder', 'limit', 'page']);
  const result = await GaugeService.queryGauges(filter, options,req.app.locals.userId);
  res.send({
    status:httpStatus.OK,
    message:null,
    details:null,
    data:result.rows,
    totalRecords:result.count,
    totalPages:Math.ceil(result.count/req.body.limit),
    pageNo:req.body.page,
    pageSize:req.body.limit
  });
});

const deleteGauge = catchAsync(async (req, res) => {
  const Gauge = await GaugeService.getGauge(req.body,req.app.locals.userId);
  if (Gauge[0].length == 0) {
    res.send({
      status:httpStatus.NOT_FOUND,
      message:"Gauge not found",
    });
  }else{
    await GaugeService.deleteGauge(req.body,req.app.locals.userId);
    res.send({
      status:httpStatus.OK,
      message:"Gauge successfuly deleted",
    });
  }
});

const getGauge = catchAsync(async (req, res) => {
  const Gauge = await GaugeService.getGauge(req.body,req.app.locals.userId);
  if (Gauge[0].length == 0) {
    res.send({
      status:httpStatus.OK,
      message: 'Gauge not found',
      data: null,
      details: null
    });
  }else{
    res.send({
      status:httpStatus.OK,
      message: null,
      data: Gauge[0],
      details: null
    });
  }
});

const updateGauge = catchAsync(async (req, res) => {
  let gaugeDetail = req.body.gauge_detail
  if(gaugeDetail && gaugeDetail.length > 0){
    req.body.gauge_detail = JSON.stringify(gaugeDetail)
  }else{
    req.body.gauge_detail = '[]'
  }

  const Gauge = await GaugeService.getGauge(req.body,req.app.locals.userId);
  if (Gauge[0].length == 0) {
    res.send({
      status:httpStatus.NOT_FOUND,
      message:"Gauge not found",
    });
  }else{
    await GaugeService.updateGauge(req.body,req.app.locals.userId);
    res.send({
      status:httpStatus.OK,
      message:"Gauge successfuly updated",
    });
  }
});


module.exports = {
  searchGauge,
  getGauge,
  deleteGauge,
  createGauge,
  updateGauge
};
