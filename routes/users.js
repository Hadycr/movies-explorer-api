const router = require('express').Router();

const {
  getCurrentUsers, updateUser,
} = require('../controllers/users');

const { userValidate } = require('../middlewares/validations/user-validator');

router.get('/me', getCurrentUsers);

router.patch('/me', userValidate, updateUser);

module.exports = router;
