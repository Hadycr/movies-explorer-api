const { DEFAULT_ERROR_500 } = require('../config/config');

const defaultError = (err, req, res, next) => {
  const { statusCode = DEFAULT_ERROR_500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });

  next();
};

module.exports = defaultError;
