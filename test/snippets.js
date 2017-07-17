const assert        = require('assert');
const request      = require('supertest');
const Models        = require('../models');
const Server        = require('../server');

let User;

before("Starting up...", (done) => {
  let newUser = {
    username: "test",
    salt: "himalayan",
    iterations: 42,
    hash: "browns"
  }
  Models.Users.create(newUser)
  .then( (user) => {
    User = user;
    done();
  });
});

after("Cleaning up...", (done) => {
  Models.Snippets.destroy({ where: {} })
  .then( () => {
    Models.Users.destroy({ where: {} })
    .then( done() );
  })
});

describe("The snippet API", () => {
  it("can retrieve an array of all snips", (done) => {
    request(Server)
      .get('/api/snippets')
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res.body.snippets,"No snippets received");
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("can retrieve an array of snips for a user", (done) => {
    request(Server)
      .get('/api/snippets/'+User.id)
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res.body.snippets,"No snippets received");
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("create a new snip", (done) => {
    request(Server)
      .post('/api/snippets')
      .send({
        title: "New snippet",
        code: "JavaJavaJava",
        userId: User.id
      })
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res.body.snippet, "No snippet received");
        assert.equal(res.body.snippet.title,"New snippet","Names do not match");
        assert.equal(res.body.snippet.body,"JavaJavaJava", "Code does not match");
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      })
  });
});
