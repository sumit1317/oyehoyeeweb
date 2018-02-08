'use strict';


    let controllers      = require('../controllers');

    let router      = require('express').Router();


    //ADMIN
      router.post('/getVideos', controllers.getVideos);

    module.exports = router;
