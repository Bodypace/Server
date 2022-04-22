const assert = require('assert');
const app = require('../../src/app');

describe('\'eats\' service', () => {
  it('registered the service', () => {
    const service = app.service('eats');

    assert.ok(service, 'Registered the service');
  });
});
