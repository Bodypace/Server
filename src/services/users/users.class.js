const { Service } = require('feathers-sequelize');
const logger = require('../../logger');

exports.Users = class Users extends Service {
  setup(app) {
    this.app = app;
  }

  async create_code(email) {
    logger.debug(`creating registration code for email: ${email}`);
    const newCode = Math.random().toString().slice(2, 8);
    this.redis.set(email, newCode);
    this.redis.expire(email, 300);

    logger.debug(
      `sending registration code for email: ${email}, code: ${newCode}`
    );

    return {
      status: 'email sent',
    };
  }

  async create(data, params) {
    const { email, code } = data;
    logger.debug(`creating new user: ${email}, code: ${code}`);
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
