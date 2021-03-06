require('../../test-helper');
const db = require('../../../lib/db');
const request = require('supertest');
const routes = require(__server + '/index.js');
const dbCleaner = require('knex-cleaner');
const User = require(__models + '/user');
const Seed = require('../../lib/seed_test');

var SeedObj = null;

// Hey Grant! Starting here :~)

// sometimes I've written comments, others just possible edge cases

describe('User Models', function () {

  beforeEach_(function * () {
    yield Seed.cleaner();
    SeedObj = yield* Seed.runner();
  });

  it_('Should get all users', function * () {
    var users = yield User.getUsers();
    expect(users[0].user_id).to.equal(SeedObj.user1Id.user_id);
    expect(users).to.be.an.instanceOf(Array);

    // Might not be necessary - I think the above assertions verify it worked
    // It also makes this test susceptible to changes in the seed file
    // but if they changed it wouldn't necessarily mean the model failed
    expect(users).to.have.length(5);
  });

  it_('Should find user by something', function * () {
    var user = yield User.findUserBy('username', 'GregB');
    expect(user.user_id).to.equal(SeedObj.user2Id.user_id);
    expect(user).to.be.an.instanceOf(Object);

    // - if no users exists with the username we're looking for
    // - if the column to verify by doesn't exist
  });

  it_('Should find user by ID', function * () {
    var user = yield User.findUserById(SeedObj.user3Id.user_id);
    expect(user.username).to.equal('CharlieBrizzown');
    expect(user).to.be.an.instanceOf(Object);

    // - if no user exists with the requested id
  });

  it_('Should find user id by name', function * () {
    var user = yield User.findUserIdByName('don cheenus');
    expect(user.user_id).to.equal(SeedObj.user1Id.user_id);
    expect(user).to.be.instanceOf(Object);

    // - if no user exists with the sought name
  });

  it_('Should delete user by Id', function * () {
    var user = yield User.deleteUser(SeedObj.user5Id.user_id);
    expect(user).to.equal(undefined);

    // - does it throw up if the user didn't exist anyway? Should it?
  });

  it_('Should find friends by user_id', function * () {
    // - if no friends

    var friends = yield User.findFriends(SeedObj.user1Id.user_id);
    expect(friends).to.be.instanceOf(Array);

    // does this make the test too reliant on the seed files? How can we otherwise
    // verify but with a less particular attribute.. like name of first user
    // -- uncertain
    expect(friends).to.have.length(1);
  });

  it_('Should create user', function * () {
    var attrs = {
      username: 'Jockabird',
      password: 'abc123',
      name: 'Grant Redfearn',
      address: '700 Rock Ledge, Arcadia, OK',
      zipcode: 73007,
      phone_number: '405-513-4627',
      email: 'grantredfearn@gmail.com',
      emergency_contact: 'Jessica Redfearn',
      avatar: 'gredfearn.wordpress.com',
    };

    var user = yield User.createUser(attrs);
    expect(user).to.not.equal(undefined);
    expect(user.username).to.equal('Jockabird');

    // - errors thrown if a required field isn't provided?
    //    userful: chaijs.com/api/bdd/#method_throw
  });

  it_('Should update user', function * () {
    var updates = {
      username: 'Greg Brizzle',
      email: 'GregBrady@marsha.com',
    };
    var user = yield User.updateUser(SeedObj.user2Id.user_id, updates);
    expect(user.username).to.equal('Greg Brizzle');
    expect(user.email).to.equal('GregBrady@marsha.com');
  });

  it_('Should create or update user (update)', function * () {
    var updates = {
      username: 'Cheenus',
      name: 'CheenusPriced',
      email: 'doncheendonchee@cheen.com',
      avatar: 'www.doncheen.com/image.png',
    };
    var user = yield User.createOrUpdateUser('username', updates);
    expect(user.user.name).to.equal('CheenusPriced');
    expect(user.user.email).to.equal('doncheendonchee@cheen.com');

    // - how do we handle if updated field is invalid?
    //    i.e. name becomes an integer instead of varchar?
  });

  it_('Should create or update user (create)', function * () {
    var attrs = {
      username: 'Jockabird',
      password: 'abc123',
      name: 'Grant Redfearn',
      address: '700 Rock Ledge, Arcadia, OK',
      zipcode: 73007,
      phone_number: '405-513-4627',
      email: 'grantredfearn@gmail.com',
      emergency_contact: 'Jessica Redfearn',
      avatar: 'gredfearn.wordpress.com',
    };
    var user = yield User.createOrUpdateUser('username', attrs);
    expect(user.user.username).to.equal('Jockabird');
    expect(user.user.name).to.equal('Grant Redfearn');
  });

});
