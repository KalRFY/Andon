const { token } = require('morgan');
const { sequelize } = require('../models');
const { generateLoginToken } = require('../utils/authUtils');

const registerService = async ({ name, noreg, phone }) => {
  const checkUserQuery = `SELECT fname FROM tb_mt_member WHERE fnoreg = :noreg LIMIT 1`;
  const existingUser = await sequelize.query(checkUserQuery, {
    replacements: { noreg },
    type: sequelize.QueryTypes.SELECT,
  });
  if (existingUser.length > 0) {
    throw new Error('User with this Noreg already exists');
  }

  const newId = (await getLastId()) + 1;
  const insertUserQuery = `INSERT INTO tb_mt_member (fid, fname, fwa_no, fnoreg) VALUES (:id, :name, :phone, :noreg)`;
  await sequelize.query(insertUserQuery, {
    replacements: { id: newId, name, phone, noreg },
    type: sequelize.QueryTypes.INSERT,
  });
  return {
    name,
    noreg,
  };
};

const loginService = async ({ noreg, password }) => {
  const query = `SELECT fid, fname, fnoreg, fwa_no FROM tb_mt_member WHERE fnoreg = :noreg LIMIT 1`;
  const user = await sequelize.query(query, {
    replacements: { noreg },
    type: sequelize.QueryTypes.SELECT,
  });

  if (user.length === 0) {
    throw new Error('Invalid Noreg');
  }

  const first4Digit = user[0].fwa_no.slice(0, 4);
  const passwordDigit = `${first4Digit}`;

  const isPasswordValid = password === passwordDigit;
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const jwtToken = generateLoginToken({
    id: user[0].fid,
    noreg: user[0].fnoreg,
    name: user[0].fname,
  });

  return {
    name: user[0].fname,
    noreg: user[0].fnoreg,
    token: jwtToken,
  };
};

const getLastId = async () => {
  const query = `SELECT MAX(fid) AS lastId FROM tb_mt_member`;
  const result = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });
  return result[0].lastId || 0;
};

module.exports = {
  registerService,
  loginService,
};
