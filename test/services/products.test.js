const assert = require('assert');
const app = require('../../src/app');
const _ = require('lodash');
const Utils = require('../utils');

describe('Products service', () => {
  it('registered the service', () => {
    const service = app.service('products');

    assert.ok(service, 'Registered the service');
  });

  describe('CRUD restrictions', () => {
    let utils;
    let server;
    let richardId;
    let richardToken;
    let richardProductId;
    let anaisId;
    let anaisToken;
    let anaisProductId;
    let buildInProductId;

    before(function (done) {
      utils = new Utils({
        hostname: 'localhost', //app.get('host') || 'localhost';
        port: 3032, //app.get('port') || 8998;
      });

      server = app.listen(utils.port);
      server.once('listening', () => done());
    });

    after(function (done) {
      server.close(done);
      utils.db.reset_tables(['users', 'products']);
    });

    beforeEach(async () => {
      await utils.db.reset_tables(['users', 'products']);

      richardId = await utils.users.create('Richard');
      richardProductId = await utils.products.create(
        'Richard product 1',
        1,
        richardId
      );
      await utils.products.create('Richard product 2', 2, richardId);

      anaisId = await utils.users.create('Anais');
      anaisProductId = await utils.products.create(
        'Anais product 1',
        1,
        anaisId
      );
      await utils.products.create('Anais product 2', 2, anaisId);

      buildInProductId = await utils.products.create(
        'build-in product 1',
        1,
        null
      );
      await utils.products.create('build-in product 2', 2, null);

      const { token } = await utils.users.login('Richard');
      richardToken = token;

      const { token: token2 } = await utils.users.login('Anais');
      anaisToken = token2;
    });

    it('anonymous user can only read build in products', async () => {
      const products = await utils.axios.getData('products');
      assert.equal(
        products.total,
        2,
        'anonymous user sees 2 products in total'
      );
      assert.equal(
        products.data.length,
        2,
        'anonymous user can find 2 products'
      );

      const userIds = _.countBy(products.data, (p) => p.UserId);
      assert.deepEqual(
        userIds,
        { null: 2 },
        'all products found by anonymous user are build-in'
      );

      const buildInProduct = await utils.axios.getData(
        `products/${buildInProductId}`
      );
      assert.equal(
        buildInProduct.id,
        buildInProductId,
        'anonymous user can read particular build-in product'
      );
      assert.equal(
        buildInProduct.name,
        'build-in product 1',
        'anonymous user got correct build-in product'
      );

      try {
        await utils.axios.get(`products/${richardProductId}`);
        assert.fail('anonymous user attemp at getting Richard product failed');
      } catch (err) {
        assert.equal(
          err.message,
          'Request failed with status code 404',
          'Error message claims Richard product does not exist'
        );
      }
    });

    it('anonymous user cannot create new products', async () => {
      const newProduct = {
        name: 'Avocado',
        kcal: 1,
        protein: 1,
        carb: 1,
        sugar: 1,
        fat: 1,
        saturated: 1,
      };

      try {
        await utils.axios.post('products', newProduct);
        assert.fail('anonymous user attemp at creating new product failed');
      } catch (err) {
        assert.equal(
          err.message,
          'Request failed with status code 401',
          'Error message indicates anonymous user is not allowed to create new product'
        );
      }

      const allProducts = await app.service('products').find();
      assert.equal(
        allProducts.total,
        6,
        'there are still only 6 previously existing products'
      );
    });

    it('anonymous user cannot update any products', async () => {
      try {
        await utils.axios.patch(`products/${buildInProductId}`, {
          name: 'Favorite build-in product',
        });
        assert.fail(
          'anonymous user attemp at updating build-in product failed'
        );
      } catch (err) {
        assert.equal(
          err.message,
          'Request failed with status code 401',
          'Error message indicates anonymous user is not allowed to update build-in product'
        );
      }

      try {
        await utils.axios.patch(`products/${richardProductId}`, {
          name: 'Favorite Richard product',
        });
        assert.fail('anonymous user attemp at updating Richard product failed');
      } catch (err) {
        // TODO should be 404? btw. this 401 is for invalid ids also as you first have to auth now
        assert.equal(
          err.message,
          'Request failed with status code 401',
          'Error message indicates anonymous user is not allowed to update Richard product'
        );
      }
    });

    it('anonymous user cannot delete any products', async () => {
      try {
        await utils.axios.delete(`products/${buildInProductId}`);
        assert.fail(
          'anonymous user attemp at removing build-in product failed'
        );
      } catch (err) {
        assert.equal(
          err.message,
          'Request failed with status code 401',
          'Error message indicates anonymous user is not allowed to remove build-in product'
        );
      }

      try {
        await utils.axios.delete(`products/${richardProductId}`);
        assert.fail('anonymous user attemp at removing Richard product failed');
      } catch (err) {
        // TODO 404 instead of 401?
        assert.equal(
          err.message,
          'Request failed with status code 401',
          'Error message indicates anonymous user is not allowed to remove Richard product'
        );
      }

      const allProducts = await app.service('products').find();
      assert.equal(
        allProducts.total,
        6,
        'there are still only 6 previously existing products'
      );
    });

    // TODO check access rights for get(), not only find()

    it('Richard can find his and build-in products', async () => {
      const products = await utils.axios.getData('products', richardToken);

      assert.equal(
        products.total,
        4,
        'there are 4 products known to Richard in total'
      );

      assert.equal(
        products.data.length,
        4,
        'server actually returned 4 products for Richard'
      );

      const userIds = _.uniqBy(products.data, (e) => e.UserId).map(
        (e) => e.UserId
      );
      assert.deepEqual(
        userIds,
        [richardId, null],
        'returned data actually contains only products owned by Richard or build-in'
      );
    });

    it('Richard can create new products for himself', async () => {
      const newProduct = {
        name: 'Avocado',
        kcal: 1,
        protein: 1,
        carb: 1,
        sugar: 1,
        fat: 1,
        saturated: 1,
      };

      const expectedNewProduct = {
        name: newProduct.name,
        vendor: null,
        units: null,
        unitSize: null,
        size: null,
        kcal: newProduct.kcal,
        protein: '1.0',
        carb: '1.0',
        sugar: '1.0',
        fat: '1.0',
        saturated: '1.0',
        salt: null,
        barcode: null,
        UserId: richardId,
      };

      // TODO: cannot play with timestamps and cannot play with hidden (like UserId) or unknown fields?
      const returnedNewProduct1 = await utils.axios.postData(
        'products',
        newProduct,
        richardToken
      );

      assert.deepEqual(
        utils.clearTimestampsAndId(returnedNewProduct1),
        utils.clearTimestampsAndId({ ...newProduct, UserId: richardId }),
        'product returned by create request matches request data'
      );

      const allProducts = await utils.axios.getData('products', richardToken);
      assert.equal(
        allProducts.total,
        5,
        'after creating new product for Richard he has 5 in total now'
      );
      assert.equal(
        allProducts.data.length,
        5,
        'after creating new product for Richard server returned him 5 products'
      );

      const matchingNames = allProducts.data.reduce(
        (count, e) => (count += e.name === newProduct.name ? 1 : 0),
        0
      );
      assert.equal(
        matchingNames,
        1,
        'there is only one product matching the new one in response'
      );

      const returnedNewProduct = allProducts.data.find(
        (e) => e.name === newProduct.name
      );
      assert.deepEqual(
        utils.clearTimestampsAndId(returnedNewProduct),
        utils.clearTimestampsAndId(expectedNewProduct),
        'server returned Richard new product with correct data'
      );
    });

    it('Richard cannot create a product for someone else, if he tries it becomes his anyway', async () => {
      const newProduct = {
        name: 'Avocado',
        kcal: 1,
        protein: 1,
        carb: 1,
        sugar: 1,
        fat: 1,
        saturated: 1,
      };
      const returnedNewProduct = await utils.axios.postData(
        'products',
        { ...newProduct, UserId: anaisId },
        richardToken
      );

      assert.deepEqual(
        utils.clearTimestampsAndId(returnedNewProduct),
        utils.clearTimestampsAndId({ ...newProduct, UserId: richardId }),
        'product returned by create request belongs to Richard instead of Anais'
      );

      const anaisProducts = await utils.axios.getData('products', anaisToken);
      assert.equal(
        anaisProducts.total,
        4,
        'Anais still has only 4 products, Richard did not add any for her'
      );
    });

    it('Richard can update only his own products', async () => {
      const updatedProduct = await utils.axios.patchData(
        `products/${richardProductId}`,
        { name: 'Richard fav product' },
        richardToken
      );
      assert.equal(
        updatedProduct.id,
        richardProductId,
        'correct product has beed updated'
      );
      assert.equal(
        updatedProduct.name,
        'Richard fav product',
        'product name has beed updated'
      );

      try {
        await utils.axios.patchData(
          `products/${anaisProductId}`,
          { name: 'Anais fav product' },
          richardToken
        );
        assert.fail('Richard attemp at updating Anais product failed');
      } catch (err) {
        assert.equal(
          err.message,
          'Request failed with status code 404',
          'Error message claims Anais product does not exist'
        );
      }

      try {
        await utils.axios.patchData(
          `products/${buildInProductId}`,
          { name: 'Best build-in product' },
          richardToken
        );
        assert.fail('Richard attemp at updating buiil-in product failed');
      } catch (err) {
        // TODO change error message to unauthorized or text explicitly telling this is build-in
        assert.equal(
          err.message,
          'Request failed with status code 404',
          'Error message claims Build-in product does not exist'
        );
      }
    });

    it('Richard can delete only his own products', async () => {
      const deletedProduct = await utils.axios.deleteData(
        `products/${richardProductId}`,
        richardToken
      );
      assert.equal(
        deletedProduct.id,
        richardProductId,
        'deleted correct product'
      );

      try {
        await utils.axios.deleteData(
          `products/${anaisProductId}`,
          richardToken
        );
        assert.fail('Richard attemp at removing Anais product failed');
      } catch (err) {
        assert.equal(
          err.message,
          'Request failed with status code 404',
          'Error message claims Anais product does not exist'
        );
      }

      try {
        await utils.axios.deleteData(
          `products/${buildInProductId}`,
          richardToken
        );
        assert.fail('Richard attemp at removing build-in product failed');
      } catch (err) {
        // TODO message telling product exists but is build-in therefore only readable, send suggestions instead
        assert.equal(
          err.message,
          'Request failed with status code 404',
          'Error message claims build-in product does not exist'
        );
      }

      const allRichardProducts = await utils.axios.getData(
        'products',
        richardToken
      );
      assert.equal(
        allRichardProducts.total,
        3,
        'Richard now has 3 products in total'
      );

      const userIds = _.countBy(
        allRichardProducts.data,
        (product) => product.UserId
      );
      assert.deepEqual(
        userIds,
        {
          [richardId]: 1,
          null: 2,
        },
        'Now Richard has 2 build-in products and 1 his own'
      );

      const allProducts = await app.service('products').find();
      const allUserIds = _.countBy(
        allProducts.data,
        (product) => product.UserId
      );
      assert.deepEqual(
        allUserIds,
        {
          [richardId]: 1,
          [anaisId]: 2,
          null: 2,
        },
        'Database still has 2 Anais products, 2 build-in products and 1 Richard product'
      );
    });
  });
});
