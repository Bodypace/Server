const assert = require('assert');
const app = require('../../src/app');

describe('\'Goals\' service', () => {
  it('registered the service', () => {
    const service = app.service('goals');

    assert.ok(service, 'Registered the service');
  });
});
