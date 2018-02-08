'use strict';


    let controllers      = require('../controllers');

    let router      = require('express').Router();



    router.post('/getToken', controllers.getToken);

    router.post('/getVideoCategories', controllers.getVideoCategories);
      router.post('/getVideos', controllers.getVideos);

    module.exports = router;
