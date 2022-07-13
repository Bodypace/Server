const assert = require('assert');
const app = require('../../src/app');

describe('users service', () => {
  it('registered the service', () => {
    const users = app.service('users');

    assert.ok(users, 'Registered the service');
  });

  describe('user creation', async () => {
    const users = app.service('users');
    const newUserInfo = {
      email: 'ssurrealism@bodypace.org',
      password: 'password',
    };

    let redis = null;

    after(async () => {
      redis = app.get('redisClient');
      const sequelize = app.get('sequelizeClient');
      await sequelize.models.User.destroy({ where: {} });
      await redis.flushAll();
    });

    beforeEach(async () => {
      redis = app.get('redisClient');
      const sequelize = app.get('sequelizeClient');
      await sequelize.models.User.destroy({ where: {} });
      await redis.flushAll();
    });

    it('sends confirmation code on create without code', async () => {
      const response = await users.create(newUserInfo);

      const existingUsers = await users.find();
      assert.deepEqual(
        existingUsers,
        {
          total: 0,
          limit: 35,
          skip: 0,
          data: [],
        },
        'no user was actually created'
      );

      const keys = await redis.keys('*');
      assert.deepEqual(
        keys,
        [newUserInfo.email],
        'created confirmation code for new user'
      );

      const keyTtl = await redis.ttl(newUserInfo.email);
      assert.ok(keyTtl > 290, 'confirmation code will expire in 3 minutes');
      assert.ok(keyTtl <= 300, 'confirmation code will expire in 3 minutes');

      assert.strictEqual(
        response.status,
        'email sent',
        'returned message confirming the confirmation code has been sent'
      );
    });

    // TODO: implement this
    it('sends error on create call with code but no code was generated before', () => {
      assert.ok(true, 'asd');
    });

    describe('when confirmation code has been sent', () => {
      beforeEach(async () => {
        await users.create(newUserInfo);
        await redis.expire(newUserInfo.email, 200);
      });

      it('new create call without code resets previous code', async () => {
        const oldCode = await redis.get(newUserInfo.email);
        const oldCodeTtl = await redis.ttl(newUserInfo.email);
        await users.create(newUserInfo);

        const newCode = await redis.get(newUserInfo.email);
        const newCodeTtl = await redis.ttl(newUserInfo.email);

        assert.notEqual(oldCode, newCode, 'codes are not equaL');
        assert.ok(oldCodeTtl < 250, 'old code lost some TTL already');
        assert.ok(newCodeTtl > 290, 'new code is fresh');
      });

      it('can register new user with correct code', async () => {
        const code = await redis.get(newUserInfo.email);
        const response = await users.create({ ...newUserInfo, code });
        const matchingUsers = await users.find({
          query: { email: newUserInfo.email },
        });

        // TODO: assert confirmation code was removed from redis
        // TODO: check double registration is not working

        assert.equal(
          response.email,
          newUserInfo.email,
          'new user email is correct in response'
        );
        // TODO: figure out how feathres auth works cuz hashes change (but auth works?)
        // assert.equal(
        //   response.password,
        //   '$2a$10$2e7BNvx.CV/v.s/hifzIzujL2hgOExesX.PbsRjv0cWW.4NG8ew3K',
        //   'new user password is correct (and hashed)'
        // );
        assert.equal(
          response.glassSize,
          250,
          'new user default glassSize is correct in response'
        );

        assert.equal(
          matchingUsers.total,
          1,
          'there is one user with our email in total'
        );
        assert.equal(
          matchingUsers.data.length,
          1,
          '1 user with our email was returned from database'
        );

        const matchingUser = matchingUsers.data[0];
        assert.equal(
          matchingUser.email,
          newUserInfo.email,
          'new user email is correct'
        );
        // TODO check password
        assert.equal(
          matchingUser.glassSize,
          250,
          'new user default glassSize is correct'
        );

        const allUsers = await users.find();
        assert.equal(
          allUsers.total,
          1,
          'no other user was added except for our'
        );

        const allMeals = await app.service('meals').find();
        assert.equal(
          allMeals.total,
          5,
          '5 new meals were added to database for our new user'
        );
        assert.equal(
          allMeals.data.length,
          5,
          '5 new meals were returned from database'
        );

        assert.equal(allMeals.data[0].name, 'breakfast', 'breakfast was added');
        assert.equal(
          allMeals.data[0].defaultHour,
          '06:30:00',
          'breakfast default hour is correct'
        );

        assert.equal(
          allMeals.data[1].name,
          'breakfast 2',
          'breakfast 2 was added'
        );
        assert.equal(
          allMeals.data[1].defaultHour,
          '10:00:00',
          'breakfast 2 default hour is correct'
        );

        assert.equal(allMeals.data[2].name, 'lunch', 'lunch was added');
        assert.equal(
          allMeals.data[2].defaultHour,
          '13:30:00',
          'lunch default hour is correct'
        );

        assert.equal(allMeals.data[3].name, 'lunch 2', 'lunch 2 was added');
        assert.equal(
          allMeals.data[3].defaultHour,
          '17:00:00',
          'lunch 2 default hour is correct'
        );

        assert.equal(allMeals.data[4].name, 'dinner', 'dinner was added');
        assert.equal(
          allMeals.data[4].defaultHour,
          '20:30:00',
          'dinner default hour is correct'
        );
      });

      it('cannot register user with incorrect code', (done) => {
        users
          .create({ ...newUserInfo, code: 'xd' })
          .then(() => done('user was registered'))
          .catch((err) => {
            assert.equal(
              err.message,
              'code expired or is invalid',
              'error message explains that code is invalid or expired'
            );
            done();
          });
      });
    });

    describe('when user is already registered', () => {
      beforeEach(async () => {
        await users.create(newUserInfo);
        const code = await redis.get(newUserInfo.email);
        await users.create({ ...newUserInfo, code });
      });

      // TODO: check for abuse and scanning users
      it('does not send confirmation code', (done) => {
        users
          .create(newUserInfo)
          .then(() => done('throws error instead of returning response'))
          .catch((err) => {
            assert.strictEqual(
              err.message,
              'email is already taken',
              'response indicates that the user email is already taken'
            );
            done();
          });
      });
    });
  });
});
