class ResponseAPI {
  _response = {
    success: 1,
    data: null,
    message: ""
  }

  success(res, data = null, message = '') {
    this._response.data = data
    this._response.message = message
    this._response.success = 1
    return res.json(this._response)
  }

  error(res, data = null, message = '', status = 500) {
    this._response.data = data
    this._response.message = message
    this._response.success = 0
    return res.status(status).json(this._response)
  }
}

module.exports = ResponseAPI