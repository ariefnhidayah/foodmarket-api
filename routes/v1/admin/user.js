var express = require('express');
var router = express.Router();

const { version } = require('../config')
const UserController = require(`../../../controllers/${version}/admin/UserController`)
const verify_token_admin = require('../../../utils/verify_token_admin')

router.post('/', verify_token_admin, async (req, res, next) => {
  try {
    await new UserController().add(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.get('/', verify_token_admin, async (req, res, next) => {
  try {
    await new UserController().gets(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', verify_token_admin, async (req, res, next) => {
  try {
    await new UserController().update(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', verify_token_admin, async (req, res, next) => {
  try {
    await new UserController().delete(req, res, next)
  } catch (error) {
    next(error)
  }
})

module.exports = router