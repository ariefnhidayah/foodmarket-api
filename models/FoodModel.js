const { Op, DataTypes } = require('sequelize')
const db = require('../Database')
const { convertDateYMD } = require('../utils/date')

const Food = db.define('Food', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  description: DataTypes.STRING,
  ingredients: DataTypes.STRING,
  price: DataTypes.FLOAT,
  rate: DataTypes.DOUBLE,
  types: DataTypes.STRING,
  picture_path: DataTypes.STRING,
  date_added: DataTypes.DATE,
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
  tableName: "foods"
})

const getFoods = async (params) => await Food.findAndCountAll({
  order: [[params.order_by, parseInt(params.is_order_asc) === 1 ? 'asc' : 'desc']],
  offset: parseInt(params.offset),
  limit: parseInt(params.limit),
  where: {
    [Op.and]: [
      params.q ? {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${params.q}%`
            },
          },
          {
            description: {
              [Op.like]: `%${params.q}%`
            },
          },
          {
            ingredients: {
              [Op.like]: `%${params.q}%`
            },
          },
          {
            types: {
              [Op.like]: `%${params.q}%`
            },
          },
        ]
      } : null,
      params.name ? {
        name: {
          [Op.like]: `%${params.name}%`
        },
      } : null,
      params.types ? {
        types: {
          [Op.like]: `%${params.types}%`
        },
      } : null,
      params.price_from ? {
        price: {
          [Op.gt]: params.price_from,
        }
      } : null,
      params.price_to ? {
        price: {
          [Op.lt]: params.price_to,
        }
      } : null,
      params.rate_from ? {
        rate: {
          [Op.gt]: params.rate_from,
        }
      } : null,
      params.rate_to ? {
        rate: {
          [Op.lt]: params.rate_to,
        }
      } : null,
      { date_deleted: null }
    ]
  }
})

module.exports = {
  Food,
  getFoods
}