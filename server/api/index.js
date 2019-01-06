const router = require('express').Router();
const Promise = require('bluebird');
const { Place, Hotel, Activity, Restaurant } = require('../db/models');

router.get('/', async (req, res, next) => {
  Promise.all([
    Hotel.findAll({include: [Place]}),
    Activity.findAll({include: [Place]}),
    Restaurant.findAll({include: [Place]})
  ])
  .then(data => {
    res.send(data)
  })
  .catch(next)
})

// requested route was Not Found
router.use((req, res, next) => {
  const error = new Error('Not Found!');
  error.status = 404;
  next(error);
})

module.exports = router;
