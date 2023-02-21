const { Op, DataTypes } = require('sequelize')
const db = require('../Database')
const { Food } = require('./FoodModel')
const { User } = require('./UserModel')
const { convertDateYMD } = require('../utils/date')

const Transaction = db.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  code: DataTypes.STRING,
  user_id: DataTypes.INTEGER,
  food_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  total: DataTypes.DOUBLE,
  status: {
    type: DataTypes.ENUM(['pending', 'paid', 'expired', 'finish']),
    defaultValue: 'pending'
  },
  payment_proof: DataTypes.STRING,
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
  tableName: 'transactions'
})

Transaction.belongsTo(Food, { foreignKey: 'food_id', as: 'food' })
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

const getTransactions = async (params) => await Transaction.findAndCountAll({
  order: [['id', 'desc']],
  offset: parseInt(params.offset),
  limit: parseInt(params.limit),
  where: {
    [Op.and]: [
      params.user_id ? { user_id: params.user_id } : null,
      params.food_id ? { food_id: params.food_id } : null,
      params.status ? { status: params.status } : null,
      params.q ? {
        [Op.or]: [
          {
            [Op.like]: { code: `%${params.q}%` }
          },
          {
            [Op.like]: { '$user.name$': `%${params.q}%` }
          },
          {
            [Op.like]: { '$user.phone_number$': `%${params.q}%` }
          },
        ]
      } : null,
    ]
  },
  include: [
    {
      model: Food,
      as: 'food'
    },
    {
      model: User,
      as: 'user'
    }
  ]
})

const getTransactionApp = async (code, user_id) => await Transaction.findOne({
  where: {
    code,
    user_id
  },
  include: [
    {
      model: Food,
      as: 'food'
    },
    {
      model: User,
      as: 'user'
    }
  ]
})

module.exports = {
  Transaction,
  getTransactions,
  getTransactionApp
}