const { Transaction, getTransactions, getTransactionApp } = require('../../models/TransactionModel')
const { Food } = require('../../models/FoodModel')
const { TransactionHistory } = require('../../models/TransactionHistoryModel')
const ResponseAPI = require('../../utils/response_api')
const generate_transaction_number = require('../../utils/generate_transaction_number')
const Validator = require('fastest-validator')
const validator = new Validator()
const { uploadImage } = require('../../utils/upload')
const path = require('path')

class TransactionController {
  _transactionModel
  _foodModel
  _response
  _transactionHistoryModel
  constructor() {
    this._transactionModel = Transaction
    this._foodModel = Food
    this._transactionHistoryModel = TransactionHistory
    this._response = new ResponseAPI()
  }

  async add(req, res, next) {
    try {
      const schema = {
        food_id: "number|empty:false",
        quantity: "number|empty:false",
        shipping_cost: "number|empty:false"
      }

      const validate = validator.validate(req.body, schema)
      if (validate.length > 0) {
        return this._response.error(res, validate, "Harap isi semua kolom!", 400)
      }

      const { food_id, quantity, shipping_cost } = req.body

      const tax = 3000

      const food = await this._foodModel.findOne({ where: { id: food_id } })
      if (!food) {
        return this._response.error(res, null, "Data tidak ditemukan!", 404);
      }

      const code = await generate_transaction_number()

      const user = req.user
      let transaction = await this._transactionModel.create({
        food_id: food.id,
        user_id: user.id,
        quantity: quantity,
        total: parseFloat(quantity) * parseFloat(food.price),
        shipping_cost,
        tax,
        grand_total: (parseFloat(quantity) * parseFloat(food.price)) + shipping_cost + tax,
        status: 'pending',
        code
      })

      transaction = await this._transactionModel.findOne({
        where: {
          code
        },
        include: [
          {
            model: this._foodModel,
            as: 'food'
          }
        ]
      })

      await this._transactionHistoryModel.create({
        transaction_id: transaction.id,
        status: transaction.status
      })

      return this._response.success(res, transaction)

    } catch (error) {
      console.log(error)
      return this._response.error(res, error, "Something wen't wrong!");
    }
  }

  async gets(req, res, next) {
    try {
      const user = req.user
      let { page, limit, food_id, status, code } = req.query
      if (code) {
        const transaction = await getTransactionApp(code, user.id)
        if (!transaction) {
          return this._response.error(res, null, "Transaksi tidak ditemukan!", 404);
        }

        return this._response.success(res, transaction)
      } else {
        if (!page) {
          page = 1
        }

        if (!limit) {
          limit = 6
        }

        let offset = (page - 1) * limit

        const transactions = await getTransactions({
          offset,
          limit,
          user_id: user.id,
          food_id,
          status
        })

        return this._response.success(res, transactions)
      }

    } catch (error) {
      return this._response.error(res, error, "Something wen't wrong!");
    }
  }

  async uploadPaymentProof(req, res, next) {
    try {
      const user = req.user
      const { id } = req.params

      const transaction = await this._transactionModel.findOne({
        where: {
          id,
          user_id: user.id
        }
      })

      if (!transaction) {
        return this._response.error(res, null, "Transaksi tidak ditemukan!", 404);
      }

      if (transaction.status == 'paid') {
        return this._response.error(res, null, "Transaksi sudah dibayar!", 400);
      } else if (transaction.status == 'expired') {
        return this._response.error(res, null, "Transaksi sudah kadaluarsa!", 400);
      } else if (transaction.status == 'finish') {
        return this._response.error(res, null, "Transaksi sudah selesai!", 400);
      }

      if (!req.files) {
        return this._response.error(res, null, "Gambar harus diisi!", 400)
      }

      const image = req.files.image

      const filename = `${transaction.code.replace(/[^a-zA-Z0-9]/g, '_')}` + path.extname(image.name)

      const upload = uploadImage(image.data, filename, 'payment-proof')

      if (!upload.success) {
        return this._response.error(res, upload, upload.message, 500)
      }

      transaction.payment_proof = upload.data
      transaction.status = 'paid'
      await transaction.save()

      await this._transactionHistoryModel.create({
        transaction_id: transaction.id,
        status: transaction.status
      })

      return this._response.success(res, null, "Data berhasil disimpan!")

    } catch (error) {
      return this._response.error(res, error.toString(), "Something wen't wrong!");
    }
  }
}

module.exports = TransactionController