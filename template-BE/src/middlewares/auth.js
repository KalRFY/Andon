const passport = require('passport');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const express = require('express');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

const app = express();

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

// const auth = (...requiredRights) => async (req, res, next) => {
//   return new Promise((resolve, reject) => {
//     passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
//   })
//     .then(() => next())
//     .catch((err) => next(err));
// };

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access Unauthorized',
    });
  }

  const token = authHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Unauthorized',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid Token',
    });
  }
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    const resourcePath = 'token/jwks';

    const token = req.headers.authorization;
    // console.log('token : x'+token+'x');
    if (token) {
      req.app.locals.token = token;
      const tokenId = token.replace('Bearer ', '');
      req.app.locals.tokenId = tokenId;
      if (tokenId == 'Bearer') {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
      }
      const decodedToken = jwt.decode(tokenId, { complete: true });

      if (decodedToken.payload) {
        req.app.locals.userId = decodedToken.payload.sub;
        const { kid } = decodedToken.header;
        //   let jwtverify = jwt.verify(tokenId,
        // `-----BEGIN CERTIFICATE-----
        // M2E5NDNjMjdhMDQyZWM5YmZhNGI3OGI3ODQxZWYwZTUwMWFiZjRkNzU4N2QyMGZjNWI5ZDNhMjdiZWUwNGQzOTA2ZjJiYjhjMzUwNzFiODZkZWIyZWUyZTNjNTExMzE1OTNlNjk3MTZkMmE1MTI4ZTY5MTA1ODZhZWM0OTM1ODU=
        // -----END CERTIFICATE-----`
        // ,
        //   { algorithms: ['RS256']});

        next();
      } else {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
      }
    } else {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
    }
  };

module.exports = {
  auth,
  authMiddleware,
  verifyCallback,
}