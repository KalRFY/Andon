const httpStatus = require('http-status');

const defaultController = async (req, res) => {
  return res.status(httpStatus.OK).json({
    message: 'Welcome to the Smart Andon API User Controller',
    status: httpStatus.OK,
  });
};


const getCurrentUserController = async (req, res, next) => {
  return res.status(httpStatus.OK).json({
    message: 'Current user retrieved successfully',
    user: req.user,
    status: httpStatus.OK,
  });
};

module.exports = {
  defaultController,
  getCurrentUserController,
};
