'use strict';
const config        = require('config');
const http = require("https");
//var mongo   = require('../config/db_config.js').mongoConnect();
//var jwt = require('../config/jwt.js');
class oyehoyeeweb {

    constructor() {
    //  this.db     = require('../config/db_config.js').localConnect();
    //  this.mariadb = require('../config/db_config.js').mariaDBConnect();
    this.mongo = require('../config/db_config.js').mongoConnect();
      this.jwt = require('../config/jwt.js');
    }
    // constructor (options) {
    //     super();
    //     this.dt = {};
    // }
    checkEmpty(val) {
        if(val === '' || val === null ||typeof val === 'undefined'){
            return true;
        } else {
            return false;
        }
    }

    getVideos(obj){
      return new Promise( (resolve, reject) => {
        let _this = this;
        let categoryid = parseInt(obj.categoryID,10);
        let res = {};
        var videos = _this.mongo.collection("videos");
        videos.find({"categoryID" : categoryid , "status":1 }).sort({"publishDate": -1}).toArray((err, row) => {
            if(err) {
                resolve(err);
            }
            else {
                res.data = row;
                resolve(res);
            }
        })
      });
    }

}
module.exports = bobbyCalvesAdmin;
