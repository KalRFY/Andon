const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const newMachineInput = sequelize.define('newMachineInput', {
    fid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    errorID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    machineName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lineName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    problemDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'newmachineinput',
    timestamps: true,
  });

  return newMachineInput;
};
