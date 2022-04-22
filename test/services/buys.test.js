const assert = require('assert');
const app = require('../../src/app');

describe('\'buys\' service', () => {
  it('registered the service', () => {
    const service = app.service('buys');

    assert.ok(service, 'Registered the service');
  });
});
