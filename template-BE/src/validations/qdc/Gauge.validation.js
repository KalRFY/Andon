const Joi = require('joi');


const searchGauge = {
    body: Joi.object()
      .keys({
        search:{
          keyword: Joi.string().max(255).allow(null,''),
          gaugeStatus: Joi.string().max(25).allow(null,''),
          idGauges: Joi.string().allow(null,''),
          lineName: Joi.string().allow(null,'')
        },
        page:Joi.number().integer().allow(null,''),
        limit:Joi.number().integer().allow(null,''),
        sortBy:Joi.string().allow(null,''),
        sortOrder:Joi.string().allow(null,'')
    }),
};

const deleteGauge = {
  body: Joi.object()
    .keys({
      gauge_id: Joi.number().integer().required()
    }),
};

const getGauge = {
  body: Joi.object()
    .keys({
      gauge_id: Joi.number().integer().required()
    }),
};


const createGauge = {
  body: Joi.object().keys({
    gauge_serial_no: Joi.string().max(200).required(),
    gauge_name: Joi.string().max(50).required(),
    gauge_brand: Joi.string().max(50).required(),
    gauge_line_name: Joi.string().max(50),
    gauge_line_id: Joi.number().integer().allow(null),
    gauge_op_no: Joi.string().max(100).required(),
    gauge_product_range_measurement: Joi.string().max(200).allow(null,''),
    gauge_calibration_equipment: Joi.string().max(200).allow(null,''),
    gauge_valid_for: Joi.number().integer().required(),
    gauge_install_calibration: Joi.string().max(25).required(),
    gauge_last_calibration: Joi.string().max(25).required(),
    gauge_pic: Joi.string().max(200).required(),
    gauge_foto: Joi.string().allow(null,''),
    gauge_detail: Joi.array().allow(null,''),
  }),
};

const updateGauge = {
  body: Joi.object().keys({
    gauge_id: Joi.number().integer().required(),
    gauge_serial_no: Joi.string().max(200).required(),
    gauge_name: Joi.string().max(50).required(),
    gauge_brand: Joi.string().max(50).required(),
    gauge_line_name: Joi.string().max(50),
    gauge_line_id: Joi.number().integer().allow(null),
    gauge_op_no: Joi.string().max(100).required(),
    gauge_product_range_measurement: Joi.string().max(200).allow(null,''),
    gauge_calibration_equipment: Joi.string().max(200).allow(null,''),
    gauge_valid_for: Joi.number().integer().required(),
    gauge_install_calibration: Joi.string().max(25).required(),
    gauge_last_calibration: Joi.string().max(25).required(),
    gauge_pic: Joi.string().max(200).required(),
    gauge_foto: Joi.string().allow(null,''),
    gauge_detail: Joi.array().allow(null,''),
  }),
};

module.exports = {
  searchGauge,
  getGauge,
  deleteGauge,
  createGauge,
  updateGauge
};
