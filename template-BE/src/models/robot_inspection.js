'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RobotInspection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The method may not receive correct `this` context.
     */
    static associate(models) {
      // define association here
    }
  }
  RobotInspection.init({
    robot_id: DataTypes.INTEGER,
    inspection_date: DataTypes.DATE,
    image_path: DataTypes.STRING,
    ai_results: DataTypes.JSON,
    status: DataTypes.ENUM('pending', 'approved', 'rejected'),
    user_validation: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'RobotInspection',
  });
  return RobotInspection;
};
