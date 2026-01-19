// const { DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//   const line = sequelize.define('tb_line', {
//     fid: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       allowNull: false,
//     },
//     fline: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     parent_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     level: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     level_desc: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     fdesc: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     sname: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//   }, {
//     tableName: 'tb_line',
//     timestamps: false,
//   });
//   return line;
// };