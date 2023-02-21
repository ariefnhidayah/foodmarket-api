const { Op, DataTypes } = require('sequelize')
const db = require('../Database')
const { Transaction } = require('./TransactionModel')
const { convertDateYMD } = require('../utils/date')

const TransactionHistory = db.define('TransactionHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  transaction_id: DataTypes.INTEGER,
  status: DataTypes.STRING,
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
  tableName: 'transaction_histories'
})

TransactionHistory.belongsTo(Transaction, { foreignKey: "transaction_id", as: "transaction" })

module.exports = {
  TransactionHistory
}