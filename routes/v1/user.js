var express = require('express');
var router = express.Router();

const { version } = require('./config')
const UserController = require(`../../controllers/${version}/UserController`)
const verify_token = require('../../utils/verify_token')

router.post('/login', async (req, res, next) => {
  try {
    await new UserController().login(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.post('/register', async (req, res, next) => {
  try {
    await new UserController().register(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.post('/check-email', async (req, res, next) => {
  try {
    await new UserController().checkEmail(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.get('/', verify_token, async (req, res, next) => {
  try {
    await new UserController().fetch(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.put('/', verify_token, async (req, res, next) => {
  try {
    await new UserController().update(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.put('/upload-photo', verify_token, async (req, res, next) => {
  try {
    await new UserController().uploadPhoto(req, res, next)
  } catch (error) {
    next(error)
  }
})

module.exports = router