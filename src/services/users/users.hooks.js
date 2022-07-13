const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword, protect } =
  require('@feathersjs/authentication-local').hooks;
const { authorize } = require('../../hooks/authorize');
const { iff } = require('feathers-hooks-common');
const moment = require('moment');

const isLoggedIn = () => (context) => context.params.user !== undefined;

const createDefaultMeals = async (context) => {
  const meals = context.app.service('meals');
  const createMeal = async (name, defaultHour) =>
    await meals.create({
      daySince: moment().format('YYYY-MM-DD'),
      defaultHour,
      name,
      UserId: context.result.id,
    });

  await createMeal('breakfast', '06:30');
  await createMeal('breakfast 2', '10:00');
  await createMeal('lunch', '13:30');
  await createMeal('lunch 2', '17:00');
  await createMeal('dinner', '20:30');
};

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt'), iff(isLoggedIn(), authorize())],
    get: [authenticate('jwt'), iff(isLoggedIn(), authorize())],
    create: [hashPassword('password')],
    update: [hashPassword('password'), authenticate('jwt'), authorize()],
    patch: [hashPassword('password'), authenticate('jwt'), authorize()],
    remove: [authenticate('jwt'), authorize()],
  },

  after: {
    all: [protect('password')],
    find: [],
    get: [],
    create: [
      async (context) => {
        if (context.result.email) {
          await createDefaultMeals(context);
        }
        return context;
      },
    ],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
