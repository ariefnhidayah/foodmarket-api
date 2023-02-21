const { User, getUsers, checkEmail } = require("../../../models/UserModel");
const ResponseAPI = require('../../../utils/response_api')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Validator = require('fastest-validator')
const validator = new Validator()
const ProfileImage = require('../../../utils/profile_image')

class UserController {
  _userModel
  _response
  constructor() {
    this._userModel = User
    this._response = new ResponseAPI()
  }

  async add(req, res, next) {
    try {
      const schema = {
        name: "string|empty:false",
        email: "email|empty:false",
        password: "string|min:6",
        role_id: "number|empty:false"
      }

      const validate = validator.validate(req.body, schema)
      if (validate.length > 0) {
        return this._response.error(res, validate, "Harap isi semua kolom!", 400)
      }

      let { name, email, password, address, house_number, phone_number, city, role_id } = req.body

      // check email
      const check = await checkEmail(email)
      if (check) {
        return this._response.error(res, null, "Email telah digunakan!", 400)
      }

      password = await bcrypt.hash(password, 10)
      const profile_photo_path = new ProfileImage().generateImage(name)

      const data = {
        name,
        email,
        password,
        profile_photo_path,
        address,
        house_number,
        phone_number,
        city,
        role_id,
      }
      await this._userModel.create(data)

      return this._response.success(res, null, "Data berhasil disimpan!")

    } catch (error) {
      return this._response.error(res, error.toString(), "Something wen't wrong!", 500)
    }
  }

  async update(req, res, next) {
    try {
      const schema = {
        name: "string|empty:false",
        email: "email|empty:false",
        role_id: "number|empty:false"
      }

      const validate = validator.validate(req.body, schema)
      if (validate.length > 0) {
        return this._response.error(res, validate, "Harap isi semua kolom!", 400)
      }

      const { id } = req.params

      const user = await this._userModel.findByPk(id)
      if (!user) {
        return this._response.error(res, null, "Data tidak ditemukan!", 404)
      }

      let { name, email, password, address, house_number, phone_number, city, role_id } = req.body

      // check email
      const check = await checkEmail(email, id)
      if (check) {
        return this._response.error(res, null, "Email telah digunakan!", 400)
      }

      if (password != '') {
        password = await bcrypt.hash(password, 10)
      }
      const profile_photo_path = new ProfileImage().generateImage(name)

      const data = {
        name,
        email,
        profile_photo_path,
        address,
        house_number,
        phone_number,
        city,
        role_id,
      }
      if (password != '') {
        data.password = password
      }
      await this._userModel.update(data, { where: { id } })

      return this._response.success(res, null, "Data berhasil disimpan!")

    } catch (error) {
      return this._response.error(res, error.toString(), "Something wen't wrong!", 500)
    }
  }

  async gets(req, res, next) {
    try {
      let { page, limit, q, role_id } = req.query

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

      const users = await getUsers({ offset, limit, q, role_id })

      return this._response.success(res, users, "Get data successfully!")
    } catch (error) {
      return this._response.error(res, error.toString(), "Something wen't wrong!", 500)
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      const user = await this._userModel.findByPk(id)
      if (!user) {
        return this._response.error(res, null, "Data tidak ada!", 404)
      }

      await user.destroy()

      return this._response.success(res, null, "Data berhasil dihapus!")

    } catch (error) {
      return this._response.error(res, error.toString(), "Something wen't wrong!", 500)
    }
  }

}

module.exports = UserController