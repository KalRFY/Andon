const httpStatus = require('http-status');
const { Gauge } = require('../../models');
const ApiError = require('../../utils/ApiError');

module.exports = (sequelize, Sequelize) => {
  class GaugeService {

      /**
     * Create a Gauge
     * @param {Object} Gauge
     * @param {String} userId
     * @returns {Promise<Gauge>}
     */
    static createGauge = async (Gauge,userId) => {
      console.log(Gauge)
      return new Promise(async (resolve, reject) => {
      await sequelize.query(
        'qdc_gauge_insert_data'
        + ' @GaugeSerialNo = :gauge_serial_no,'
        + ' @GaugeName = :gauge_name,'
        + ' @GaugeBrand = :gauge_brand,'
        + ' @GaugeLineName = :gauge_line_name,'
        + ' @GaugeLineId = :gauge_line_id,'
        + ' @GaugeOpNo = :gauge_op_no,'
        + ' @GaugeProductRangeMeasurement = :gauge_product_range_measurement,'
        + ' @GaugeCalibrationEquipment = :gauge_calibration_equipment,'
        + ' @GaugeValidFor = :gauge_valid_for,'
        + ' @GaugeInstallCalibration = :gauge_install_calibration,'
        + ' @gaugeLastCalibration = :gauge_last_calibration,'
        + ' @gaugePic = :gauge_pic,'
        + ' @gaugeFoto = :gauge_foto,'
        + ' @gaugeDetail = :gauge_detail,'
        
        + " @createdBy = '"+userId+"'"
        ,{
            replacements: Gauge
        },
        Sequelize.QueryTypes.INSERT
        )
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
      })
    };


    /**
     * Update a Gauge
     * @param {Object} Gauge
     * @param {String} userId
     * @returns {Promise<Gauge>}
     */
     static updateGauge = async (Gauge,userId) => {
      return new Promise(async (resolve, reject) => {
      await sequelize.query(
        'qdc_gauge_update_data'
        + ' @GaugeId = :gauge_id,'
        + ' @GaugeSerialNo = :gauge_serial_no,'
        + ' @GaugeName = :gauge_name,'
        + ' @GaugeBrand = :gauge_brand,'
        + ' @GaugeLineName = :gauge_line_name,'
        + ' @GaugeLineId = :gauge_line_id,'
        + ' @GaugeOpNo = :gauge_op_no,'
        + ' @GaugeProductRangeMeasurement = :gauge_product_range_measurement,'
        + ' @GaugeCalibrationEquipment = :gauge_calibration_equipment,'
        + ' @GaugeValidFor = :gauge_valid_for,'
        + ' @GaugeInstallCalibration = :gauge_install_calibration,'
        + ' @gaugeLastCalibration = :gauge_last_calibration,'
        + ' @gaugePic = :gauge_pic,'
        + ' @gaugeFoto = :gauge_foto,'
        + ' @gaugeDetail = :gauge_detail,'
        
        + " @changedBy = '"+userId+"'"
        ,{
            replacements: Gauge
        },
        Sequelize.QueryTypes.UPDATE
        )
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
      })
    };

    static paginateGauge = async (filter, options, userId) => {
      return new Promise(async(resolve, reject) => {
        let params = JSON.parse(JSON.stringify(filter));
        params.page = options.page;
        params.limit = options.limit;
        params.sortBy = options.sortBy;
        params.sortOrder = options.sortOrder;
        
        await sequelize.query(
          "qdc_gauge_search_data"
            + " @keyword = :keyword,"
            + " @lineName = :lineName,"
            + " @searchBy = '" + userId + "',"
            + " @page = :page,"
            + " @rowPerPage = :limit,"
            + " @orderBy = :sortBy,"
            + " @sortOrder = :sortOrder"
          ,{
              replacements: params
          }
          ,Sequelize.QueryTypes.SELECT
          )
          .then(result => {
            if(result.length == 0){
              resolve({count:0, rows:[]});
            }else
            if(result[0][0]['FNAME'] && result[0][0]['FNAME']=='ROW_COUNT'){
              let rowCount = result[0].splice(0,1);
              let count = rowCount[0]['FVAL'];
              let rows = result[0];
              resolve({count:count, rows: rows});
            }else{
              resolve(result);
            }
          })
          .catch(error => {
            reject(error);
          });
      })
    };

    /**
     * Query for Gauges
     * @param {Object} filter - Sequelize filter
     * @param {Object} options - Query options
     * @param {string} [options.sortOrder] - Sort option in the format: ['field1'],['field2']
     * @param {string} [options.sortBy] - Sort option in the format: ['ASC'],['DESC']
     * @param {number} [options.limit] - Maximum number of results per page (default = 10)
     * @param {number} [options.page] - Current page (default = 1)
     * @param {String} userId
     * @returns {Promise<QueryResult>}
     */
    static queryGauges = async (filter, options, userId) => {
      const Gauge = await this.paginateGauge(filter, options, userId);
      return Gauge;
    };

    /**
     * Delete Gauge
     * @param {Object} Gauge
     * @param {String} userId
     * @returns {Promise<Gauge>}
     */
    static deleteGauge = async (Gauge,userId) => {
      await sequelize.query(
        'qdc_gauge_delete_data'
        + ' @gaugeId = :gauge_id,'

        + " @changedBy = '"+userId+"'"
        ,{
            replacements: Gauge
        },
        Sequelize.QueryTypes.UPDATE
        )
        .then(result => {
          return result;
        })
        .catch(error => {
          throw(error);
        });
    };

    /**
     * Get Gauge
     * @param {Object} Gauge
     * @param {String} userId
     * @returns {Promise<Gauge>}
     */
    static getGauge = async (Gauge,userId) => {
      return new Promise(async(resolve, reject) => {
        await sequelize.query(
          "qdc_gauge_get_data"
              + ' @gaugeId = :gauge_id,'

              + " @searchBy = '"+userId+"'"
          ,{
              replacements: Gauge
          }
          ,Sequelize.QueryTypes.SELECT
          )
          .then(result => {
            resolve(result);
          })
          .catch(error => {
            reject(error);
          });
      })
    };

    
  }
  return GaugeService;
};
