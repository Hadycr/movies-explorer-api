const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const NotFoundError = require('../errors/notFoundError');
const { STATUS_CREATED_201 } = require('../config/config');

module.exports.getCurrentUsers = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Данные не найдены');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Данные не корректны'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name
    }))
    .then(() => res.status(STATUS_CREATED_201).send({
      name,
      email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token, message: 'Всё верно!' });
    })
    .catch(next);
};

// module.exports.getUsers = (req, res, next) => {
//   User.find({})
//     .then((users) => res.send(users))
//     .catch(next);
// };

// module.exports.getUserById = (req, res, next) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail(() => {
//       throw new NotFoundError('Данные не найдены');
//     })
//     .then((user) => {
//       res.send(user);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Данные не корректны'));
//       } else {
//         next(err);
//       }
//     });
// };

// module.exports.updateUser = (req, res, next) => {
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
//     .orFail(() => {
//       throw new NotFoundError('Данные не найдены');
//     })
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequestError('Данные не корректны'));
//       } else {
//         next(err);
//       }
//     });
// };

// module.exports.updateAvatar = (req, res, next) => {
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
//     .orFail(() => {
//       throw new NotFoundError('Данные не найдены');
//     })
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         next(new BadRequestError('Данные не корректны'));
//       } else {
//         next(err);
//       }
//     });
// };

// module.exports.getCurrentUsers = (req, res, next) => {
//   User.findById(req.user._id)
//     .then((user) => res.send(user))
//     .catch(next);
// };
