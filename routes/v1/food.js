var express = require('express');
var router = express.Router();

const { version } = require('./config')
const FoodController = require(`../../controllers/${version}/FoodController`)

router.get('/', async (req, res, next) => {
  try {
    await new FoodController().gets(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    await new FoodController().get(req, res, next)
  } catch (error) {
    next(error)
  }
})

module.exports = router