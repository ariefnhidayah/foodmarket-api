var express = require('express');
var router = express.Router();

const { version } = require('../config')
const TransactionController = require(`../../../controllers/${version}/admin/TransactionController`)
const verify_token_admin = require('../../../utils/verify_token_admin')


router.get('/', verify_token_admin, async (req, res, next) => {
  try {
    await new TransactionController().gets(req, res, next)
  } catch (error) {
    next(error)
  }
})

router.put('/:id/status', verify_token_admin, async (req, res, next) => {
  try {
    await new TransactionController().updateStatus(req, res, next)
  } catch (error) {
    next(error)
  }
})

module.exports = router