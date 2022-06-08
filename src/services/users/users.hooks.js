const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword, protect } =
  require('@feathersjs/authentication-local').hooks;
const { authorize } = require('../../hooks/authorize');
const { iff, debug } = require('feathers-hooks-common');

const isLoggedIn = () => (context) => context.params.user !== undefined;


module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt'), iff(isLoggedIn(), authorize())],
    get: [authenticate('jwt'), iff(isLoggedIn(), authorize())],
    create: [hashPassword('password'), debug('user::create()')],
    update: [hashPassword('password'), authenticate('jwt'), authorize()],
    patch: [hashPassword('password'), authenticate('jwt'), authorize()],
    remove: [authenticate('jwt'), authorize()],
  },

  after: {
    all: [protect('password')],
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
