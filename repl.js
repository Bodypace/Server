#!/bin/node
// https://nodejs.org/en/knowledge/REPL/how-to-create-a-custom-repl/

var moment = require('moment');
var lodash = require('lodash');
var redis = require('redis');
var repl = require('repl');

// A "local" node repl with a custom prompt
var local = repl.start(`server::${process.env.NODE_ENV}> `);

const app = require('./src/app');
const sequelize = app.get('sequelizeClient');
const { Op, DataTypes } = require('sequelize');

// Exposing stuff to the local REPL's context.
local.context.moment = moment;
local.context.lodash = lodash;
local.context.redis = redis;

local.context.redisConnect = async () => {
  const client = redis.createClient();

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();
  return client;
};

local.context.app = app;
local.context.sequelize = sequelize;
local.context.Op = Op;
local.context.DataTypes = DataTypes;
local.context.qi = sequelize.getQueryInterface();

local.context.User = sequelize.models.User;
local.context.Goal = sequelize.models.Goal;
local.context.Water = sequelize.models.Water;
local.context.Product = sequelize.models.Product;
local.context.Buy = sequelize.models.Buy;
local.context.Meal = sequelize.models.Meal;
local.context.MealTime = sequelize.models.MealTime;
local.context.Eat = sequelize.models.Eat;

sequelize.models.User.associate(sequelize.models);
sequelize.models.Product.associate(sequelize.models);
sequelize.models.Buy.associate(sequelize.models);
sequelize.models.Eat.associate(sequelize.models);

local.context.services = {
  users: app.service('users'),
  goals: app.service('goals'),
  water: app.service('water'),
  products: app.service('products'),
  buys: app.service('buys'),
  meals: app.service('meals'),
  mealtimes: app.service('mealtimes'),
  eats: app.service('eats'),
};

local.context.times = (n, f) => {
  for (let i = 0; i < n; i++) {
    if (f(i)) {
      return false;
    }
  }
  return true;
};
