const { QueryTypes } = require('sequelize')
const { Transaction } = require('../models/TransactionModel')

module.exports = async () => {
  const date = new Date()
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month < 10 ? `0${month}` : month

  const lastOrder = await Transaction.sequelize.query(`SELECT MAX(SUBSTR(code, 12)) code FROM transactions WHERE YEAR(date_added) = ${year} AND MONTH(date_added) = ${month} ORDER BY date_added DESC LIMIT 1`, {
    type: QueryTypes.SELECT
  });

  let increment = 0
  if (lastOrder.length > 0) {
    increment = lastOrder[0].code != null ? lastOrder[0].code : 0
  }

  increment = increment == 0 ? 1 : parseInt(increment) + 1
  if (increment < 10) {
    increment = `000${increment}`
  } else if (increment < 100) {
    increment = `00${increment}`
  } else if (increment < 1000) {
    increment = `0${increment}`
  }

  return `TRX/${year}${month}/${increment}`
}