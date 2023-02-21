const { Op, DataTypes } = require('sequelize')
const db = require('../Database')
const { Role } = require('./RoleModel')
const { convertDateYMD } = require('../utils/date')

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  profile_photo_path: DataTypes.STRING,
  address: DataTypes.STRING,
  house_number: DataTypes.STRING,
  phone_number: DataTypes.STRING,
  city: DataTypes.STRING,
  role_id: DataTypes.INTEGER,
  date_added: {
    type: DataTypes.DATE,
    get: function () {
      return convertDateYMD(this.getDataValue('date_added'))
    }
  },
  date_modified: {
    type: DataTypes.DATE,
    get: function () {
      return convertDateYMD(this.getDataValue('date_modified'))
    }
  }
}, {
  tableName: 'users'
});

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' })

const checkEmail = async (email, id = null) => await User.findOne({
  where: {
    [Op.and]: [
      {
        email
      },
      id ? {
        [Op.not]: {
          id
        }
      } : null,
    ]
  }
})

const getUsers = async (params) => await User.findAndCountAll({
  order: [['name', 'asc']],
  offset: parseInt(params.offset),
  limit: parseInt(params.limit),
  where: {
    [Op.and]: [
      params.q ? {
        [Op.or]: [
          { name: `%${params.q}%` },
          { email: `%${params.q}%` },
          { address: `%${params.q}%` },
        ]
      } : null,
      params.role_id ? {
        role_id: params.role_id
      } : null,
    ]
  },
  include: [
    {
      model: Role,
      attributes: ['name'],
      as: 'role'
    }
  ]
})

module.exports = {
  User,
  checkEmail,
  getUsers
}