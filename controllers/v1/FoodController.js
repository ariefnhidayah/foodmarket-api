const { Food, getFoods } = require('../../models/FoodModel')
const ResponseAPI = require('../../utils/response_api')

class FoodController {
  _foodModel
  _response
  constructor() {
    this._foodModel = Food
    this._response = new ResponseAPI()
  }

  async gets(req, res, next) {
    try {
      let { page, limit, name, types, price_from, price_to, rate_from, rate_to, order_by, is_order_asc } = req.query

      if (!page) {
        page = 1
      }

      if (!limit) {
        limit = 6
      }

      let offset = (page - 1) * limit

      if (!order_by) {
        order_by = 'name'
      }

      if (typeof is_order_asc === 'undefined') {
        is_order_asc = 1
      }

      const foods = await getFoods({
        limit,
        offset,
        name,
        types,
        price_from,
        price_to,
        rate_from,
        rate_to,
        order_by,
        is_order_asc
      })

      return this._response.success(res, foods)

    } catch (error) {
      return this._response.error(res, error, "Something wen't wrong!");
    }
  }

  async get(req, res, next) {
    try {
      const { id } = req.params
      const food = await this._foodModel.findByPk(id)
      if (!food) {
        return this._response.error(res, null, "Data tidak ada!", 404);
      }

      return this._response.success(res, food)

    } catch (error) {
      return this._response.error(res, error, "Something wen't wrong!");
    }
  }

}

module.exports = FoodController