const { User, checkEmail } = require('../../../models/UserModel')
const ResponseAPI = require('../../../utils/response_api')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Validator = require('fastest-validator')
const validator = new Validator()
const ProfileImage = require('../../../utils/profile_image')
const { uploadImage } = require('../../../utils/upload')
const { ROLE_ADMIN } = require('../../../utils/role')

const { JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRED } = process.env

class AuthController {
  _userModel
  _response
  constructor() {
    this._userModel = User
    this._response = new ResponseAPI()
  }

  async login(req, res, next) {
    try {
      const schema = {
        email: "email|empty:false",
        password: "string|min:6"
      }

      const validate = validator.validate(req.body, schema)
      if (validate.length > 0) {
        return this._response.error(res, validate, "Harap isi semua kolom!", 400)
      }

      const { email, password } = req.body

      const user = await this._userModel.findOne({
        where: {
          email: email
        }
      })

      if (!user) {
        return this._response.error(res, null, "Email tidak terdaftar!", 404)
      }

      if (user.role_id != ROLE_ADMIN) {
        return this._response.error(res, null, "Anda tidak memiliki akses!", 401)
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return this._response.error(res, null, "Password salah!", 400)
      }

      const token = jwt.sign({ data: user }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED })
      return this._response.success(res, {
        access_token: token,
        token_type: 'Bearer',
        data: user,
      }, "Berhasil login!")

    } catch (error) {
      return this._response.error(res, error, "Something wen't wrong!");
    }
  }

  async fetch(req, res, next) {
    try {
      const user = await this._userModel.findOne({
        where: {
          id: req.user.id,
          role_id: ROLE_ADMIN
        }
      })

      return this._response.success(res, user)

    } catch (error) {
      return this._response.error(res, error, "Something wen't wrong!");
    }
  }

  async update(req, res, next) {
    try {
      await this._userModel.update(req.body, {
        where: {
          id: req.user.id
        }
      })

      const user = await this._userModel.findOne({
        where: {
          id: req.user.id
        }
      })

      return this._response.success(res, user)

    } catch (error) {
      return this._response.error(res, error, "Something wen't wrong!");
    }
  }

  async uploadPhoto(req, res, next) {
    try {
      const user = req.user
      if(!req.files) {
        return this._response.error(res, null, "Gambar harus diisi!", 400)
      }
      
      const image = req.files.image

      
      const filename = image.name
      const upload = uploadImage(image.data, filename, 'avatar')
      if (!upload.success) {
        return this._response.error(res, upload, upload.message, 500)
      }

      await this._userModel.update({
        profile_photo_path: upload.data
      }, {
        where: {
          id: user.id
        }
      })

      return this._response.success(res, null, "Data berhasil disimpan!")

    } catch (error) {
      return this._response.error(res, error.toString(), "Something wen't wrong!");
    }
  }

}

module.exports = AuthController