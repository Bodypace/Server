const { Service } = require('feathers-sequelize');

exports.Users = class Users extends Service {
  setup(app) {
    this.app = app;
  }

  async create_code(email) {
    const users = await this.app.service('users').find({ query: { email } });
    if (users.total !== 0 || users.data.length !== 0) {
      throw Error('email is already taken');
    }

    const newCode = Math.random().toString().slice(2, 8);
    this.redis.set(email, newCode);
    this.redis.expire(email, 300);

    return {
      status: 'email sent',
    };
  }

  async create(data, params) {
    const { email, code } = data;
    this.redis = this.app.get('redisClient');

    if (code === undefined) {
      return this.create_code(email);
    }

    const correctCode = await this.redis.get(email);
    if (correctCode === undefined || correctCode !== code) {
      throw Error('code expired or is invalid');
    }

    delete data.code;
    return super.create(data, params);
  }
};
