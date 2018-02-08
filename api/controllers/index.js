'use strict';

let oyehoyeeweb  = require('../models');
let jwt = require('../config/jwt.js');
let ag    = new oyehoyeeweb();

let getVideos = (req,res) => {
  let obj = req.body;
  //console.log(obj);
      let dt = {};
      ag.getVideos(obj)
      .then(function(dt) {
          res.json(dt);
      });
}


module.exports = {
    getVideos: getVideos
}
