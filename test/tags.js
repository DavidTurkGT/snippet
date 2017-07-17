const assert        = require('assert');
const request       = require('supertest');
const Models        = require('../models');
const Server        = require('../server');

before("Starting up...", (done) => {
  done();
});

after("Cleaning up...", (done) => {
  done();
});

describe("The tag API", () =>{
  it("can retrieve all tags", (done) => {
    request(Server)
      .get('/api/tags')
      .expect(200)
      .expect('Content-Type','application/json; charset=utf-8')
      .expect( (res) => {
        assert(res.body.tags, "No tags receveived");
        assert(res.body.tags.length, "Tags is not an array");
      })
      .end( (err, res) => {
        if(err) done(err);
        else done();
      })
  })
});
