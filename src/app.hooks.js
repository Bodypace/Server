// Application hooks that run for every service
const { iff } = require('feathers-hooks-common');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { authorize } = require('./hooks/authorize');
const { fixQuerying } = require('./hooks/fix-querying')

module.exports = {
  before: {
    all: [
      iff(
        ({ path }) => path !== 'users' && path !== 'authentication',
        [authenticate('jwt'), authorize()]
      )
    ],
    find: [fixQuerying()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
