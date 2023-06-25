const router = require('express').Router();
const auth = require('../middlewares/auth');
const { userValidateUp, userValidateIn } = require('../middlewares/validations/user-validator');
const { createUser, login } = require('../controllers/users');
const userRouter = require('./users');
const cardRouter = require('./movies');
const NotFoundError = require('../errors/notFoundError');

router.post('/signup', userValidateUp, createUser);
router.post('/signin', userValidateIn, login);
router.use(auth);
router.use('/users/', userRouter);
router.use('/movies/', cardRouter);
router.use('/*', (req, res, next) => {
  next(new NotFoundError('404 not found'));
});

module.exports = router;
