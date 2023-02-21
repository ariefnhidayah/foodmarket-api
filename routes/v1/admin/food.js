var express = require('express');
var router = express.Router();

const { version } = require('../config')
const FoodController = require(`../../../controllers/${version}/admin/FoodController`)
const verify_token_admin = require('../../../utils/verify_token_admin')

router.post('/', verify_token_admin, async (req, res, next) => {
  try {
    await new FoodController().add(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.get('/', verify_token_admin, async (req, res, next) => {
  try {
    await new FoodController().gets(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', verify_token_admin, async (req, res, next) => {
  try {
    await new FoodController().get(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', verify_token_admin, async (req, res, next) => {
  try {
    await new FoodController().update(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', verify_token_admin, async (req, res, next) => {
  try {
    await new FoodController().delete(req, res, next)
  } catch (error) {
    next(error)
  }
})

module.exports = router