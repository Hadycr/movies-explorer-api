require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const router = require('./routes/index');
const defaultError = require('./errors/defaultError');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./config/limiter');
const { MONGO_URL } = require('./config/config');

const { NODE_ENV, MONGO_URL_PROD } = process.env;
const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());
app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL_PROD : MONGO_URL, {
  useNewUrlParser: true,
  enableUtf8Validation: false,
});

app.use(bodyParser.json());
app.use(requestLogger);
app.use(limiter);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use(defaultError);

app.listen(PORT);
