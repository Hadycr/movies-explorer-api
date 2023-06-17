const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUsers, updateUser,
} = require('../controllers/users');
// const { URL_REGEX } = require('../config/config');

router.get('/me', getCurrentUsers);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = router;
