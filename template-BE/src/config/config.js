/* eslint-disable prefer-destructuring */
// const pathENV = require('../../.env');

const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const mySQL2 = require('mysql2');

let paramDotENV = '';
process.argv.forEach(function (val) {
  if (val.indexOf('NODE_ENV') >= 0) {
    paramDotENV = val.split('=')[1];
  }
});

dotenv.config({ path: path.join(__dirname, `../../.env${paramDotENV === '' ? '' : `.${paramDotENV}`}`) });
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('prod', 'dev', 'local').default('dev'),
    PORT: Joi.number().default(3000),
    HOST: Joi.string().default('localhost'),
    DB_USER: Joi.string().default('administrator').description('Database user'),
    DB_PASSWORD: Joi.string().default('4dm1nComp1teR').description('Database password'),
    DB_NAME: Joi.string().default('mt-sys').description('Database name'),
    DB_HOST: Joi.string().default('103.190.28.222').description('Database host'),
    DB_PORT: Joi.number().default(4111).description('Database port'),
    QDC_MSSQL_DBDIALECT: Joi.string().default('mysql').description('Database dialect'),
    JWT_SECRET: Joi.string().default('secret').description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV || process.env.NODE_ENV || 'dev',
  port: envVars.PORT,
  host: envVars.HOST,

  scApi: envVars.VUE_APP_SC_API_URL,
  cmnApi: envVars.VUE_APP_CMN_NODE_API_URL,
  commonApi: envVars.VUE_APP_COMMON_API_URL,
  db: {
    username: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    dialect: 'mysql',
    dialectModule: mySQL2,
    dialectOptions: {
      connectTimeout: 60000,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
};
