const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QccMTypes = sequelize.define('qcc_m_types', {
    type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    type_nm: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'qcc_m_types',
    timestamps: false,
  });

  return QccMTypes;
};
