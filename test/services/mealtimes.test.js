const assert = require('assert');
const app = require('../../src/app');

describe('\'mealtimes\' service', () => {
  it('registered the service', () => {
    const service = app.service('mealtimes');

    assert.ok(service, 'Registered the service');
  });
});
