const Place = require('./place');
const Hotel = require('./hotel');
const Activity = require('./activity');
const Restaurant = require('./restaurant');
const db = require('../index');

// model associations
Hotel.belongsTo(Place);
Restaurant.belongsTo(Place);
Activity.belongsTo(Place);

module.exports = {
  db,
  Place,
  Hotel,
  Activity,
  Restaurant
}
