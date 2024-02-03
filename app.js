require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { auth } = require('express-openid-connect');

// docker run -p 3000:3000 -e $Env:AWS_REGION="eu-north-1" $Env:AWS_ACCESS_KEY_ID="ASIAREPL54OD4LRCAZVT" $Env:AWS_SECRET_ACCESS_KEY="k4K0EUJ3/mHD9jlh+eOFO9S02GpTqrTiod+2BK11" $Env:AWS_SESSION_TOKEN="IQoJb3JpZ2luX2VjEKz//////////wEaCXVzLWVhc3QtMiJHMEUCIQCBqr39KYTTiLvaxY+ak03nxLYOpN7vjVZhJrd4twr35wIgdTbXfWmzxcNtAvoBPuS2RMQx/PG/bkdH3mK3yKGxRtAqsAIIdRAAGgwwNzgzNDEwNzE3NTEiDLea56RPMu+JacThKiqNAv/mC1dVkNobwXsxNk8Dn3ZPpRqIyY9W53jgx+ho7J3Rw4wSx52EgcEDg2neCgKd7CuASwP5OoPMzHD1D6WVeOonha87SpeCySZRF+v9eJ60GeRp0pbw9hOQVoH8dpF9+vZ5q+mZCuGna6Wn9giBexGOBMRqgQ3qWTGm/A4f75FIps6yhyl/neNIvr8BanoLp2BXXzxlp4qgwDVxhM1SPXKkzxtd4lge0DfyhI5p+rQma4R9bQqnqaXMq0ju5R04mFmApQqB/LAhp70vwDsCGvBJb3vj2JAFod+nhReU7Q7qlyN48EhP1IBpx9YPUMypWVxNPDbXKO6kJaXt4JcO2xGvthuwK1r/ZVrbYPd5MPbL+K0GOp0BdgUbVM8eW3qef9upHUf4UeNUKPP77b6S93qBuvD5CUMeLqA77/dAN8lgKuv1hcP8//flrjanz/qyDgX6MhrOJbjuasb3iW5Unt/wLXlln81oeatmAXjuS6l0/y1CpYf+pEmTHV/Ofuzt+YFT8t2Txl6L6jSzdoSbmseFGpI65fd3zJBqeQg+TwELVxvKmwnfbDid7fiSGwwIo8LMBQ=="
var indexRouter = require('./routes/index');
var picturesRouter = require('./routes/pictures');

var app = express();
const fileUpload = require('express-fileupload');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

const config = {
  authRequired: false,
  auth0Logout: true
};

const port = process.env.PORT || 3000;
if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}

app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.use('/', indexRouter);
app.use('/pictures', picturesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
