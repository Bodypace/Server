const users = require('./users/users.service.js');
const goals = require('./goals/goals.service.js');
const water = require('./water/water.service.js');
const products = require('./products/products.service.js');
const buys = require('./buys/buys.service.js');
const meals = require('./meals/meals.service.js');
const mealtimes = require('./mealtimes/mealtimes.service.js');
const eats = require('./eats/eats.service.js');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(goals);
  app.configure(water);
  app.configure(products);
  app.configure(buys);
  app.configure(meals);
  app.configure(mealtimes);
  app.configure(eats);
};
