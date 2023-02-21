const { Transaction, getTransactions } = require('../../../models/TransactionModel')
const { TransactionHistory } = require('../../../models/TransactionHistoryModel')
const ResponseAPI = require('../../../utils/response_api')
const Validator = require('fastest-validator')
const validator = new Validator()

class TransactionController {
  _transactionModel
  _transactionHistoryModel
  _response
  constructor() {
    this._transactionModel = Transaction
    this._transactionHistoryModel = TransactionHistory
    this._response = new ResponseAPI()
  }

  async gets(req, res, next) {
    try {
      let { page, limit, food_id, status, q } = req.query

      if (!page) {
        page = 1
      }

      if (!limit) {
        limit = 6
      }

      let offset = (page - 1) * limit

      if (!q) {
        q = ''
      }

      const transactions = await getTransactions({ limit, offset, food_id, status, q })

      return this._response.success(res, transactions, "Get data successfully!")

    } catch (error) {
      return this._response.error(res, error.toString(), "Something wen't wrong!", 500)
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params
      const schema = {
        status: "string|empty:false"
      }

      const validate = validator.validate(req.body, schema)
      if (validate.length > 0) {
        return this._response.error(res, validate, "Harap isi semua kolom!", 400)
      }

      const transaction = await this._transactionModel.findByPk(id)
      if (!transaction) {
        return this._response.error(res, null, "Data tidak ditemukan!", 404)
      }

      transaction.status = req.body.status
      await transaction.save()

      const data = {
        status: transaction.status,
        transaction_id: transaction.id,
      }

      await this._transactionHistoryModel.create(data)

      return this._response.success(res, null, "Data berhasil disimpan!")
      
    } catch (error) {
      return this._response.error(res, error.toString(), "Something wen't wrong!", 500)
    }
  }

}

module.exports = TransactionController