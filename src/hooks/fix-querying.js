
module.exports = {

  fixQuerying: () => {

    return async context => {
      // idk how this works exactly but somehow fixes errors
      // without it e.g. in repl, find() with $or (or other operators)
      // will complain about some shit like 'invalid value'
      // (which at least on first look looks fine)
      context.params.query = { ...context.params.query };
      return context;
    };

  }

};