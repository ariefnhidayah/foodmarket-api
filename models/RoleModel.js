const { Op, DataTypes } = require('sequelize')
const db = require('../Database')
const { convertDateYMD } = require('../utils/date')

const Role = db.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
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
  tableName: 'roles'
})

module.exports = {
  Role
}