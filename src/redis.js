const redis = require('redis');


module.exports = async function (app) {
  const client = redis.createClient();
  client.on('error', (err) => console.log('Redis Client Error: ', err));
  await client.connect();
  app.set('redisClient', client);
};
