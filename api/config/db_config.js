const express   = require('express'),
  //    db        = require('mysql'),
      mongoose  = require('mongoose'),
      config    = require('config');

//let mysqlConfig = config.get("mysql");
let mongoConfig = config.get("mongo");

//let mysqlConnect = function() {
    //let conbox = db.createPool(mysqlConfig);
  //  return conbox;
//};

let mongoConnect = function() {
    let mongobox = mongoose.createConnection(mongoConfig.dbURI);

    mongobox.on('connected', function () {
        console.log('MongoDB connection successful');
    });

    return mongobox;
};

//mariadb
// var Client = require('mariasql');
// let mariaConfig = config.get("mariadb");
// let mariaConnect = function() {
//     let mariaconnection = new Client({
//       "host" : mariaConfig.host,
//       "user" : mariaConfig.user,
//       "password" : mariaConfig.password,
//       "port" : mariaConfig.port,
//       "db" : mariaConfig.db
//     });
//     console.log("Connecting to MariaDB");
//     return mariaconnection;
// };

//module.exports.localConnect = mysqlConnect;
//module.exports.mariaDBConnect = mariaConnect;
module.exports.mongoConnect = mongoConnect;
