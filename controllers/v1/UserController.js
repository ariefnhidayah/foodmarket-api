const { User, checkEmail } = require('../../models/UserModel')
const ResponseAPI = require('../../utils/response_api')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Validator = require('fastest-validator')
const validator = new Validator()
const ProfileImage = require('../../utils/profile_image')
const { uploadImage } = require('../../utils/upload')
const { ROLE_USER } = require('../../utils/role')

const { JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRED } = process.env

class UserController {
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
        return this._response.error(res, validate, "Please fill in all fields!", 400)
      }

      const { email, password } = req.body

      const user = await this._userModel.findOne({
        where: {
          email: email
        }
      })

      if (!user) {
        return this._response.error(res, null, "Unregistered e-mail!", 404)
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return this._response.error(res, null, "Password wrong!", 400)
      }

      const token = jwt.sign({ data: user }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED })
      return this._response.success(res, {
        access_token: token,
        token_type: 'Bearer',
        data: user,
      }, "Login successfully!")

    } catch (error) {
      return this._response.error(res, error, "Something wen't wrong!");
    }
  }

  async register(req, res, next) {
    try {
      const schema = {
        name: "string|empty:false",
        email: "email|empty:false",
        password: "string|min:6"
      }

      const validate = validator.validate(req.body, schema)
      if (validate.length > 0) {
        return this._response.error(res, validate, "Please fill in all fields!", 400)
      }

      let { name, email, password, address, house_number, phone_number, city, role_id } = req.body

      // check email
      const check = await checkEmail(email)
      if (check) {
        return this._response.error(res, null, "Email has been used!", 400)
      }

      password = await bcrypt.hash(password, 10)
      let profile_photo_path = new ProfileImage().generateImage(name)

      if (req.files != null) {
        const image = req.files.image
        const filename = image.name
        const upload = uploadImage(image.data, filename, 'avatar')
        if (!upload.success) {
          return this._response.error(res, upload, upload.message, 500)
        }
        profile_photo_path = upload.data
      }

      const data = {
        name,
        email,
        password,
        profile_photo_path,
        address,
        house_number,
        phone_number,
        city,
        role_id: role_id != null ? role_id : ROLE_USER,
      }

      const user = await this._userModel.create(data)
      const token = jwt.sign({ data: user }, JWT_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRED })

      return this._response.success(res, {
        access_token: token,
        token_type: 'Bearer',
        data: user,
      }, "Login successfully!")

    } catch (error) {
      return this._response.error(res, error, "Something wen't wrong!");
    }
  }

  async checkEmail(req, res, next) {
    try {
      const { email } = req.body
      const check = await this._userModel.findOne({
        where: {
          email
        }
      })

      if (check) {
        return this._response.error(res, null, "Email has been used!", 400)
      } else {
        return this._response.success(res, null, "");
      }

    } catch (error) {
      return this._response.error(res, error, "Something wen't wrong!");
    }
  }

  async fetch(req, res, next) {
    try {
      const user = await this._userModel.findOne({
        where: {
          id: req.user.id,
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
      if (!req.files) {
        return this._response.error(res, null, "Image is required!", 400)
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

      return this._response.success(res, null, "Data saved successfully!")

    } catch (error) {
      return this._response.error(res, error.toString(), "Something wen't wrong!");
    }
  }

}

module.exports = UserController