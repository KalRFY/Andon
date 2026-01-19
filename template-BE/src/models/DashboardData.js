const { DataTypes } = require('sequelize');
const sequelize = require('../config/sqlite');

const DashboardData = sequelize.define('DashboardData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'dashboard_data',
  timestamps: false,
});

module.exports = DashboardData;
