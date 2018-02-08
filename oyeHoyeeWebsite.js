// 'use strict';
const express       = require('express'),
      app           = express(),
      server        = require('http').createServer(app),
      io            = require('socket.io').listen(server),
      bodyParser    = require('body-parser'),
      router        = express.Router(),
      routes        = require('./api/routes'),
      request       = require('request'),
      sqlinjection  = require('sql-injection'),
      accesslog     = require('access-log'),
      basicauth     = require('basicauth-middleware'),
      compression   = require('compression'),
      helmet        = require('helmet'),
      morgan        = require('morgan'),
      path          = require('path'),
      fs            = require('fs'),
      rfs           = require('rotating-file-stream'),
      cluster       = require('cluster'),
      numCPUs       = require('os').cpus().length,
      aws           = require('aws-sdk'),
      s3            = new aws.S3({ /* ... */ }),
      config        = require('config');
  app.use(express.static('public'));

//  if(config.has("auth.userName") && config.has("auth.passCode")) {
//    app.use(basicauth(config.get("auth.userName"), config.get("auth.passCode")));
//  }

  if (cluster.isMaster) {
      console.log(`Master Process ID ${process.pid} is running`);
      //Workers Forked
      for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
      }
      //Worker Died
      cluster.on('exit', (worker, code, signal) => {
          console.log(`Worker Process ID ${worker.process.pid} died`);
      });
  } else {
      console.log(`Worker Process ID ${process.pid} is running`);
      app.use(compression());
      app.use(helmet());
      app.use(bodyParser.urlencoded({extended: false}));
      app.use(bodyParser.json());
      app.use(function (req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          next();
      });
      // setup the logger
      var logDirectory = path.join(__dirname, 'log');
      // ensure log directory exists
      fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
      // create a rotating write stream
      var accessLogStream = rfs('access.log', {
        interval: '1d', // rotate daily
        path: logDirectory
      });
      app.use(morgan('combined', {stream: accessLogStream}));
      //cheersking apis
      var bobbyCalvesAdminRoutes = require('./api/routes');
      app.use('/api', bobbyCalvesAdminRoutes);
      server.listen(config.get("port"));
      console.log("Listening on port"+config.get("port"));
  }
