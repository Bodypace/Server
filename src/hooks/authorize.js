const { setField } = require('feathers-authentication-hooks');
const logger = require('../logger');

module.exports = {

  authorize: () => {

    const from = 'params.user.id';
    return async context => {
      const { path, method, type } = context;
      logger.debug(`authorizing request path: ${path}, method: ${method}, type: ${type}`);

      if (type !== 'before') {
        throw Error(`Tried to authorize service in "${type}" hook instead of "before"`);
      }

      return setField({
        from, as:
          path === 'users'
            ? 'params.query.id'
            : method === 'create'
              ? 'data.UserId'
              : 'params.query.UserId'
      })(context);

    };

  }

};