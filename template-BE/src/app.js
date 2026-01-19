const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const fileUpload = require('express-fileupload');
// const schedule = require('node-schedule');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const oeeSyncService = require('./services/oeeSync.service');

const app = express();
const dashboardRoutes = require('./routes/smartandon/dashboard');

global.__basedir = `${__dirname}/..`;

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({ extended: false }));

// app.use(fileUpload());

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors({ exposedHeaders: ['Content-Disposition'] }));
app.options('*', cors());

// Serve static files from reports/uploads directory

app.use('/reports/uploads', express.static(path.join(__dirname, '../reports/uploads')));

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/auth', authLimiter);
}

// v1 api routes
app.use('/api', routes);

// Add direct access to dashboard routes
app.use('/dashboard', dashboardRoutes);
// app.use('/problem', dashboardRoutes);

// Serve static files from the built frontend directory
app.use(express.static(path.join(__dirname, '../../template-FE/dist')));

// Catch all handler: send back the index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../template-FE/dist/index.html'));
});

// Handle Chrome DevTools specific route to prevent errors
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  // Log only essential request information instead of the entire request object
  console.log(`Unhandled route: ${req.method} ${req.originalUrl}`);
  next(new ApiError(httpStatus.NOT_FOUND, `Route not found: ${req.originalUrl}`));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  // Start the OEE sync service
  oeeSyncService.startScheduledSync();
});
