const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;
const { authorize } = require('../../hooks/authorize');
const { iff, debug } = require('feathers-hooks-common');

const isLoggedIn = () => context => context.params.user !== undefined;

const register = () => {
  return async context => {
    const { code } = context.data

    if (code === undefined) {
      console.log('sending confirm code to email: ABC11')
    }
    else {
      console.log("does code match: ", (code === "ABC11"))
    }

    return context
  }
}

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt'), iff(isLoggedIn(), authorize()) ],
    get: [ authenticate('jwt'), iff(isLoggedIn(), authorize()) ],
    create: [ hashPassword('password'), debug('debug user'), register() ],
    update: [ hashPassword('password'),  authenticate('jwt'), authorize() ],
    patch: [ hashPassword('password'),  authenticate('jwt'), authorize() ],
    remove: [ authenticate('jwt'), authorize() ]
  },

  after: {
    all: [ protect('password') ],
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
