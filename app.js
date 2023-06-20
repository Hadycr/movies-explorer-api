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
const {limiter} = require('./config/limiter');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());
app.use(helmet());


mongoose.connect('mongodb://127.0.0.1:27017/mydb1', {
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

// app.listen(PORT);
app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  // console.log(BASE_PATH);
});
