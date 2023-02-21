var express = require('express');
var router = express.Router();

const { version } = require('../config')
const AuthController = require(`../../../controllers/${version}/admin/AuthController`)
const verify_token_admin = require('../../../utils/verify_token_admin')

router.post('/login', async (req, res, next) => {
  try {
    await new AuthController().login(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.get('/', verify_token_admin, async (req, res, next) => {
  try {
    await new AuthController().fetch(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.put('/', verify_token_admin, async (req, res, next) => {
  try {
    await new AuthController().update(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.put('/upload-photo', verify_token_admin, async (req, res, next) => {
  try {
    await new AuthController().uploadPhoto(req, res, next)
  } catch (error) {
    next(error)
  }
})

module.exports = router