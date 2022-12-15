const createError = require('http-errors');

const notAllowed = (req, res, next) => {
  next(createError.MethodNotAllowed());
};

module.exports = notAllowed;
