const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies, createMovies, deleteMovies,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.string().required().min(2).max(30),
    year: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2).max(30),
    image: Joi.string().required().pattern(/^(http|https):\/\/[w{3}.]?[\w-._~:/?#[\]@!$&'()*+,;=]#?/i),
    trailerLink: Joi.string().required().pattern(/^(http|https):\/\/[w{3}.]?[\w-._~:/?#[\]@!$&'()*+,;=]#?/i),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
    thumbnail: Joi.string().required().pattern(/^(http|https):\/\/[w{3}.]?[\w-._~:/?#[\]@!$&'()*+,;=]#?/i),
    movieId: Joi.string().required().min(2).max(30),
  }),
}), createMovies);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovies);

module.exports = router;
