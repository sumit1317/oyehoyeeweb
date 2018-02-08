'use strict';

let ABC  = require('../models');
let jwt = require('../config/jwt.js');
let ag    = new ABC();

let getToken = (req,res) => {
  let obj = req.body;
  //console.log(obj);
      let dt = {};
      ag.getToken(obj)
      .then(function(dt) {
          res.json(dt);
      });
}

let getVideos = (req,res) => {
  //first check for token validity, then check for payload content
  let obj = req.body;
  return jwt.verifyJWT(obj.token)
  .then((payload) => {
    ag.getVideos(obj)
    .then(function(dt) {
        res.json(dt);
    });
  }).catch((err) => {
    var err = {};
    err.code = 2;
    err.message = 'Token Error';
    err.data = {};
    res.json(err);
  })
}

let getVideoCategories = (req,res) => {
  //first check for token validity, then check for payload content
  let obj = req.body;
  return jwt.verifyJWT(obj.token)
  .then((payload) => {
    ag.getVideoCategories()
    .then(function(dt) {
        res.json(dt);
    });
  }).catch((err) => {
    var err = {};
    err.code = 2;
    err.message = 'Token Error';
    err.data = {};
    res.json(err);
  })
}


module.exports = {
  getToken: getToken,
    getVideos: getVideos,
    getVideoCategories: getVideoCategories

}
