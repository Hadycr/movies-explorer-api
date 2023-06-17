const Movie = require('../models/movie');

const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');
const { STATUS_CREATED_201 } = require('../config/config');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovies = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(STATUS_CREATED_201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovies = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Данные не найдены');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить карточку другого пользователя');
      }
      movie.deleteOne()
        .then(() => res.send(movie))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Данные не корректны'));
      } else {
        next(err);
      }
    });
};

// module.exports.addLike = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(() => {
//       throw new NotFoundError('Данные не найдены');
//     })
//     .then((card) => res.send({ card }))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Данные не корректны'));
//       } else {
//         next(err);
//       }
//     });
// };

// module.exports.deleteLike = (req, res, next) => {
//   Card.findByIdAndUpdate(
//     req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true },
//   )
//     .orFail(() => {
//       throw new NotFoundError('Данные не найдены');
//     })
//     .then((card) => res.send({ card }))
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         next(new BadRequestError('Данные не корректны'));
//       } else {
//         next(err);
//       }
//     });
// };
