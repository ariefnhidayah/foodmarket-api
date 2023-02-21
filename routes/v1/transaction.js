var express = require('express');
var router = express.Router();

const { version } = require('./config')
const TransactionController = require(`../../controllers/${version}/TransactionController`)
const verify_token = require('../../utils/verify_token')

router.post('/', verify_token, async (req, res, next) => {
  try {
    await new TransactionController().add(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.get('/', verify_token, async(req, res, next) => {
  try {
    await new TransactionController().gets(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.put('/:id/upload-payment-proof', verify_token, async(req, res, next) => {
  try {
    await new TransactionController().uploadPaymentProof(req, res, next)
  } catch (error) {
    next(error)
  }
})

module.exports = router