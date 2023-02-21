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
      let { page, limit, name, types, price_from, price_to, rate_from, rate_to } = req.query

      if (!page) {
        page = 1
      }

      if (!limit) {
        limit = 6
      }

      let offset = (page - 1) * limit

      const foods = await getFoods({
        limit,
        offset,
        name,
        types,
        price_from,
        price_to,
        rate_from,
        rate_to,
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