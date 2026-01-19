const httpStatus = require('http-status');
const { object } = require('joi');
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../../models');

const getFrontend = async (req, res, next) => {
  try {
    const [frontend, metadata] = await sequelize.query(`
      SELECT
        frontendId,
        frontend
      FROM tb_frontend
      WHERE frontendId IS NOT NULL
      ORDER BY frontendId ASC
    `);
    res.status(httpStatus.OK).json(frontend);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFrontend,
};
