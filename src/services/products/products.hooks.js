const { iff } = require('feathers-hooks-common');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { authorize } = require('../../hooks/authorize');

const hasToken = (context) => {
  return context.params.authentication !== undefined;
};

const allowNullUserId = (context) => {
  const query = context.params.query;

  if (query.UserId !== undefined) {
    query.UserId = {
      $or: [query.UserId, null],
    };
  } else if (context.params.provider !== undefined) {
    query.UserId = null;
  }

  return context;
};

module.exports = {
  before: {
    all: [],
    find: [iff(hasToken, [authenticate('jwt'), authorize()]), allowNullUserId],
    get: [iff(hasToken, [authenticate('jwt'), authorize()]), allowNullUserId],
    create: [authenticate('jwt'), authorize()],
    update: [authenticate('jwt'), authorize()],
    patch: [authenticate('jwt'), authorize()],
    remove: [authenticate('jwt'), authorize()],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
