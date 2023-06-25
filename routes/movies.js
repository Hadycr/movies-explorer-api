const router = require('express').Router();

const {
  getMovies, createMovies, deleteMovies,
} = require('../controllers/movies');

const { movieValidate, movieValidateDelete } = require('../middlewares/validations/movie-validator');

router.get('/', getMovies);
router.post('/', movieValidate, createMovies);

router.delete('/:movieId', movieValidateDelete, deleteMovies);

module.exports = router;
