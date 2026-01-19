const httpStatus = require('http-status');
const { sequelize } = require('../../models');
const { registerSchema, loginSchema } = require('../../schema/authSchema');
const { registerService, loginService } = require('../../services/authServices');

const defaultController = async (req, res) => {
  
  return res.status(httpStatus.OK).json({
    message: 'Welcome to the Smart Andon API Authentication Controller',
    status: httpStatus.OK,
  });
};

const registerController = async (req, res, next) => {
  const { name, phone, noreg, instance } = req.body;
  try {
    const { error } = registerSchema.validate({ name, phone, noreg });
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        errors: error.details.map((detail) => detail.message),
      });
    }

    const newUser = await registerService({ name, noreg, phone, instance });
    if (!newUser) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: 'User already exists with this email',
        status: httpStatus.BAD_REQUEST,
      });
    }
    return res.status(httpStatus.CREATED).json({
      message: 'User registered successfully',
      status: httpStatus.CREATED,
    });
  } catch (err) {
    next(err);
  }
};

const loginController = async (req, res, next) => {
  const { noreg, password } = req.body;
  try {
    const { error } = loginSchema.validate({ noreg, password });
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({
        errors: error.details.map((detail) => detail.message),
        message: 'Validation error',
      });
    }

    const isValidUser = await loginService({ noreg, password });
    if (!isValidUser) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: 'Invalid Noreg or password',
        status: httpStatus.UNAUTHORIZED,
      });
    }

    return res.status(httpStatus.OK).json({
      message: 'Login successful',
      token: isValidUser.token,
      status: httpStatus.OK,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  defaultController,
  registerController,
  loginController,
};
