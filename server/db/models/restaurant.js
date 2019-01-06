const Sequelize = require('sequelize');
const db = require('../index');

const Restaurant = db.define('restaurant', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cuisine: {
    type: Sequelize.STRING,
    allowNull: false,
    // comma delimited string list
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 }
  }
})

module.exports = Restaurant;
