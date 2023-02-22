const { Food, getFoods } = require('../../../models/FoodModel')
const ResponseAPI = require('../../../utils/response_api')
const Validator = require('fastest-validator')
const validator = new Validator()
const path = require('path')
const { uploadImage } = require('../../../utils/upload')
const { getDateNow } = require('../../../utils/date')

class FoodController {
  _foodModel
  _response
  constructor() {
    this._foodModel = Food
    this._response = new ResponseAPI()
  }

  async add(req, res, next) {
    const schema = {
      name: "string|empty:false",
      description: "string|empty:false",
      ingredients: "string|empty:true",
      price: "string|empty:false",
      rate: "string|empty:true",
      types: "string|empty:true"
    }

    const validate = validator.validate(req.body, schema)
    if (validate.length > 0) {
      return this._response.error(res, validate, "Harap isi semua kolom!", 400)
    }

    if (!req.files) {
      return this._response.error(res, null, "Gambar tidak boleh kosong!", 400)
    }

    const transaction = await this._foodModel.sequelize.transaction()

    let { name, description, ingredients, price, rate, types } = req.body

    try {
      const image = req.files.image

      const filename = name + path.extname(image.name)
      const upload = uploadImage(image.data, filename, "food")
      if (!upload.success) {
        return this._response.error(res, upload.toString(), upload.message, 500)
      }

      const data = {
        name,
        description,
        ingredients,
        price,
        rate,
        types,
        picture_path: upload.data
      }

      await this._foodModel.create(data, { transaction })

      await transaction.commit()

      return this._response.success(res, null, "Data berhasil disimpan!")
    } catch (error) {
      await transaction.rollback()
      return this._response.error(res, error.toString(), "Something wen't wrong!", 500)
    }
  }

  async update(req, res, next) {
    const schema = {
      name: "string|empty:false",
      description: "string|empty:false",
      ingredients: "string|empty:true",
      price: "string|empty:false",
      rate: "string|empty:true",
      types: "string|empty:true"
    }

    const validate = validator.validate(req.body, schema)
    if (validate.length > 0) {
      return this._response.error(res, validate, "Harap isi semua kolom!", 400)
    }

    const { id } = req.params
    const food = await this._foodModel.findByPk(id)
    if (!food) {
      return this._response.error(res, null, "Data tidak ditemukan!", 404)
    }

    let { name, description, ingredients, price, rate, types } = req.body

    let data = {};
    if (req.files && req.files.image) {
      const image = req.files.image

      const filename = name + path.extname(image.name)
      const upload = uploadImage(image.data, filename, "food")
      if (!upload.success) {
        return this._response.error(res, upload.toString(), upload.message, 500)
      }

      data = {
        name,
        description,
        ingredients,
        price,
        rate,
        types,
        picture_path: upload.data
      }
    } else {
      data = {
        name,
        description,
        ingredients,
        price,
        rate,
        types
      }
    }

    await this._foodModel.update(data, { where: { id } })
    return this._response.success(res, null, "Data berhasil disimpan!")
  }

  async gets(req, res, next) {
    try {
      let { page, limit, q, order_by, is_order_asc } = req.query

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

      if (!order_by) {
        order_by = 'name'
      }

      if (typeof is_order_asc === 'undefined') {
        is_order_asc = 1
      }

      const foods = await getFoods({ offset, limit, q, order_by, is_order_asc, })

      return this._response.success(res, foods, "Get data successfully!")

    } catch (error) {
      return this._response.error(res, error.toString(), "Something wen't wrong!", 500)
    }
  }

  async get(req, res, next) {
    try {
      const { id } = req.params
      const food = await this._foodModel.findByPk(id)
      if (!food) {
        return this._response.error(res, null, "Data tidak ditemukan!", 404)
      }

      return this._response.success(res, food, "")

    } catch (error) {
      return this._response.error(res, error.toString(), "Something wen't wrong!", 500)
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      const food = await this._foodModel.findByPk(id)
      if (!food) {
        return this._response.error(res, null, "Data tidak ditemukan!", 404)
      }

      // await food.destroy()
      // food.date_deleted = Date.now()
      // await food.save()
      await this._foodModel.update({ date_deleted: getDateNow() }, { where: { id } })

      return this._response.success(res, null, "Data berhasil dihapus!")

    } catch (error) {
      return this._response.error(res, error.toString(), "Something wen't wrong!", 500)
    }
  }

}

module.exports = FoodController