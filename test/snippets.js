const assert        = require('assert');
const request      = require('supertest');
const models        = require('../models');
const Server        = require('../server');

let User;

before("Starting up...", (done) => {
  done();
});

after("Cleaning up...", (done) => {
  done();
});

describe("The snippet API", () => {
  it("can retrieve an array of all snips", (done) => {
    request(Server)
      .get('/api/snippets')
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res.body.snippets,"No snippets received");
        assert(res.body.snippets.length, "Snippets received has no length. Is it an array?");
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
        code: "JavaJavaJava"
      })
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res.body.snippet, "No snippet received");
        assert.equal(res.body.snippet.title,"New snippet","Names do not match");
        assert.equal(res.body.snippet.code,"JavaJavaJava", "Code does not match");
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      })
  });
});
