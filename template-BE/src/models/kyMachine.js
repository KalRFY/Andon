module.exports = (sequelize, DataTypes) => {
  const KYMachine = sequelize.define(
    'KYMachine',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      machine_id: DataTypes.INTEGER,
      details: DataTypes.STRING,
      created_by: DataTypes.STRING,
      created_dt: DataTypes.DATE,
      stop6_category: DataTypes.STRING,
      ilustration: DataTypes.STRING,
    },
    {
      tableName: 'tb_ky',
      timestamps: false,
    }
  );

  return KYMachine;
};
