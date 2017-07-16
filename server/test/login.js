//Login Back-end Tests
const assert          = require('assert');
const request         = require('supertest');
const Server          = require('../server');
const Models          = require('../models');

let User;

before("Starting up...", (done) => {
  request(Server)
    .post('/api/users')
    .send({username: "loginTest", password: "password"})
    .expect(200)
    .end( (err,res) => {
      User = res.body.user;
      if(err) done(err);
      else done();
    });
});

after("Cleaning up...", (done) => {
  Models.Users.destroy({ where: {} })
  .then( done() );
});

describe("The login process", () => {
  it("should log in when the all credentials are correct", (done) => {
    request(Server)
      .post('/api/users/login')
      .send({username: "loginTest", password: "password"})
      .expect(200)
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("should throw a 401 if the username if not found", (done) => {
    request(Server)
      .post("/api/users/login")
      .send({username: "notFound", password: "password"})
      .expect(401)
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("should throw a 401 if the password is incorrect", (done) => {
    request(Server)
      .post("/api/users/login")
      .send({username: "loginTest", password: "wrong"})
      .expect(401)
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });

  it("should throw a 400 if username is blank", (done) => {
    request(Server)
      .post("/api/users/login")
      .send({username: "", password: "password"})
      .expect(400)
      .end( (err, res) =>{
        if(err) done(err);
        else done();
      });
  });

  it("should throw a 400 if the password is blank", (done) => {
    request(Server)
      .post('/api/users/login')
      .send({username: "testLogin", password: ""})
      .expect(400)
      .end( (err, res) => {
        if(err) done(err);
        else done();
      });
  });
});
