'use strict';
const crypto = require('crypto');
const config        = require('config');
const http = require("https");
//var mongo   = require('../config/db_config.js').mongoConnect();
//var jwt = require('../config/jwt.js');
class ABC {

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

    getToken(){
      return new Promise( (resolve, reject) => {
        let _this = this;
        let res = {};
        _this.generateRandomString()
        .then( function(salt) {

        const payload = {
          email: "default@oyehoyee.com",
          salt: salt
        };
        return _this.jwt.generateJWT(payload)
        .then((token) => {
          res.code = 0;
          res.alert = "OFF";
          res.alertMessage = 'Login Successful';
          res.token = token;
          res.data = "";
          resolve(res);
        });
      });
      });
    }


    getVideoCategories(){
      return new Promise( (resolve, reject) => {
        let _this = this;
        let res = {};
        var categories = _this.mongo.collection("categories");
        categories.find({},{ categoryID: 1, categoryName: 1, _id: 0 }).sort({"categoryName": 1}).toArray((err, row) => {
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

    getVideos(obj){
      return new Promise( (resolve, reject) => {
        let _this = this;
        let categoryid = parseInt(obj.categoryID,10);
        console.log(categoryid);
        console.log(obj.categoryID);
        let res = {};
        var videos = _this.mongo.collection("videos");
        videos.find({"categoryID" : categoryid , "status":0 }).sort({"publishDate": -1}).toArray((err, row) => {
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

    generateRandomString() {
      return new Promise((resolve, reject) => {
        const rs = crypto.randomBytes(256).toString('base64');
        resolve(rs);
      });
    }

    //returns SHA-512 hashed string
    sha512(passwordParams) {
      return new Promise((resolve, reject) => {
        const hash = crypto.createHmac('sha512', passwordParams.salt); /** Hashing algorithm sha512 */
        hash.update(passwordParams.password);
        const value = hash.digest('hex');
        resolve(value);
      });
    }

} //class ends
module.exports = ABC;
