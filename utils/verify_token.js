const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env
const { User } = require('../models/UserModel')

module.exports = async (req, res, next) => {
  const authorization = req.headers.authorization
  if (!authorization) {
    return res.status(401).json({
      success: 0,
      message: "Anda tidak diberikan akses!"
    })
  }
  const splited = authorization.split(' ')
  if (splited.length == 0) {
    return res.status(401).json({
      success: 0,
      message: "Anda tidak diberikan akses!"
    })
  }
  const token = authorization.split(' ')[1]
  jwt.verify(token, JWT_SECRET, async (error, decoded) => {
    if (error) {
      return res.status(401).json({
        success: 0,
        message: "Anda tidak diberikan akses!"
      })
    } else {
      req.user = decoded.data

      // check user
      const user = await User.findOne({
        where: {
          id: req.user.id,
        }
      })
      if (!user) {
        return res.status(401).json({
          success: 0,
          message: "Anda tidak diberikan akses!"
        })
      }

      return next()
    }
  })
}