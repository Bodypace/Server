const app = require('../src/app');
const assert = require('assert');
const axios = require('axios');

class AssertUtils {
  responseHasData(response, goodCode = 200) {
    assert.equal(
      response.status,
      goodCode,
      `got response with status code ${goodCode} indicating success`
    );
    assert.ok(response.data, 'response contains data from server');
  }
}

class AxiosUtils {
  constructor({ hostname, port, assertUtils }) {
    this.assert = assertUtils;
    this.hostname = hostname;
    this.port = port;
  }

  getUrl(pathname = '') {
    return `http://${this.hostname}:${this.port}/${pathname}`;
  }

  getConfig(token = null) {
    if (!token) {
      return undefined;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  get(pathname = '', token = null) {
    return axios.get(this.getUrl(pathname), this.getConfig(token));
  }

  post(pathname = '', data = {}, token = null) {
    return axios.post(this.getUrl(pathname), data, this.getConfig(token));
  }

  patch(pathname = '', data = {}, token = null) {
    return axios.patch(this.getUrl(pathname), data, this.getConfig(token));
  }

  delete(pathname = '', token = null) {
    return axios.delete(this.getUrl(pathname), this.getConfig(token));
  }

  async getData(pathname = '', token = null) {
    const response = await this.get(pathname, token);
    this.assert.responseHasData(response);
    return response.data;
  }

  async postData(pathname = '', data = {}, token = null) {
    const response = await this.post(pathname, data, token);
    this.assert.responseHasData(response, 201);
    return response.data;
  }

  async patchData(pathname = '', data = {}, token = null) {
    const response = await this.patch(pathname, data, token);
    this.assert.responseHasData(response, 200);
    return response.data;
  }

  async deleteData(pathname = '', token = null) {
    const response = await this.delete(pathname, token);
    this.assert.responseHasData(response, 200);
    return response.data;
  }
}

class DatabaseUtils {
  async reset_tables(serviceNames) {
    for (const serviceName of serviceNames) {
      const Model = app.service(serviceName).Model;
      await Model.destroy({ where: {} });
    }
  }
}

class UsersUtils {
  constructor({ axiosUtils }) {
    this.axios = axiosUtils;
    this.users = app.service('users');
    this.redis = app.get('redisClient');
  }

  async create(email, password = 'password') {
    await this.users.create({ email, password });
    const code = await this.redis.get(email);
    const newUser = await this.users.create({ email, password, code });
    return newUser.id;
  }

  async login(email, password = 'password') {
    const response = await this.axios.post('authentication', {
      strategy: 'local',
      email,
      password,
    });
    return { token: response.data.accessToken, ...response.data.user };
  }
}

class ProductsUtils {
  constructor() {
    this.Product = app.service('products').Model;
  }

  async create(name, nutrientsValue, userId) {
    const newProduct = await this.Product.create({
      name,
      kcal: nutrientsValue,
      protein: nutrientsValue,
      carb: nutrientsValue,
      sugar: nutrientsValue,
      fat: nutrientsValue,
      saturated: nutrientsValue,
      createdAt: new Date(),
      updatedAt: new Date(),
      UserId: userId,
    });
    return newProduct.id;
  }
}

class Utils {
  constructor({ hostname, port }) {
    this.hostname = hostname;
    this.port = port;

    // general
    this.assert = new AssertUtils();
    this.axios = new AxiosUtils({ hostname, port, assertUtils: this.assert });
    this.db = new DatabaseUtils();

    // services
    this.users = new UsersUtils({ axiosUtils: this.axios });
    this.products = new ProductsUtils();
  }

  clearTimestamps(obj) {
    return { ...obj, createdAt: null, updatedAt: null };
  }

  clearTimestampsAndId(obj) {
    return this.clearTimestamps({
      ...obj,
      id: null,
    });
  }
}

module.exports = Utils;
