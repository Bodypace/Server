// Application hooks that run for every service
const { iff } = require('feathers-hooks-common');
const { authenticate } = require('@feathersjs/authentication').hooks;
const { authorize } = require('./hooks/authorize');
const { fixQuerying } = require('./hooks/fix-querying');
const { parseNull } = require('./hooks/parse-null');

module.exports = {
  before: {
    all: [
      iff(
        ({ path }) => !['users', 'authentication', 'products'].includes(path),
        [authenticate('jwt'), authorize()]
      ),
    ],
    find: [fixQuerying(), parseNull()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
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
