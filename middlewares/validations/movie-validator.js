const { celebrate, Joi } = require('celebrate');

module.exports.movieValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^(http|https):\/\/[w{3}.]?[\w-._~:/?#[\]@!$&'()*+,;=]#?/i),
    trailerLink: Joi.string().required().pattern(/^(http|https):\/\/[w{3}.]?[\w-._~:/?#[\]@!$&'()*+,;=]#?/i),
    nameRU: Joi.string(),
    nameEN: Joi.string(),
    thumbnail: Joi.string().required().pattern(/^(http|https):\/\/[w{3}.]?[\w-._~:/?#[\]@!$&'()*+,;=]#?/i),
    movieId: Joi.number(),
  }),
});

module.exports.movieValidateDelete = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});
