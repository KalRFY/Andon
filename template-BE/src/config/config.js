var param_dot_env = '';
process.argv.forEach(function(val, index, array) {
    console.log("config.js " + val);
    if (val.indexOf('NODE_ENV') >= 0) {
        param_dot_env = val.split('=')[1];
    }
});
console.log('param_dot_env : ' +(param_dot_env === '' ? '' : (param_dot_env)))
// const pathENV = require('../../.env');
const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

console.log('env path : '+'../../.env'+(param_dot_env===''?'':('.'+param_dot_env)));

dotenv.config({ path: path.join(__dirname, '../../.env'+(param_dot_env===''?'':('.'+param_dot_env))) });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('prod', 'dev', 'local').default('dev'),
    PORT: Joi.number().default(3000),
    USER_DB_NEW: Joi.string().default('administrator').description('Database user'),
    PASSWORD_DB_NEW: Joi.string().default('4dm1nComp1teR').description('Database password'),
    NAME_DB_NEW: Joi.string().default('mt-sys').description('Database name'),
    HOST_DB_NEW: Joi.string().default('103.190.28.222').description('Database host'),
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

  scApi: envVars.VUE_APP_SC_API_URL,
  cmnApi: envVars.VUE_APP_CMN_NODE_API_URL,
  commonApi: envVars.VUE_APP_COMMON_API_URL,
  qdc_db: {
    username: envVars.USER_DB_NEW,
    password: envVars.PASSWORD_DB_NEW,
    database: envVars.NAME_DB_NEW,
    host: envVars.HOST_DB_NEW,
    port: envVars.DB_PORT,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    dialectOptions: {
      connectTimeout: 10000
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  },

  // New PostgreSQL database config
  qdc_pg_db: {
    username: envVars.USER_DB_NEW || 'tpm_user',
    password: envVars.PASSWORD_DB_NEW || 'postgres',
    database: envVars.NAME_DB_NEW || 'tpm_system',
    host: envVars.HOST_DB_NEW || '10.65.12.22',
    dialect: 'postgres',
    port: envVars.DB_PORT || 5432,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      // No nested options object here to avoid ERR_INVALID_ARG_TYPE
    },
    searchPath: 'mt_sys'
  },  
  platform_db: {
    username: envVars.PLATFORM_DB_USER ,
    password: envVars.PLATFORM_DB_PASSWORD,
    database: envVars.PLATFORM_DB_NAME,
    host: envVars.PLATFORM_DB_HOST,
    port: envVars.PLATFORM_DB_PORT,
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
