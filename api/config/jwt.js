'use strict';

var jwt     = require('jsonwebtoken');
var crypto  = require('crypto');
const config        = require('config');
const sk = config.get("jwt.sk");
const expTime = config.get("jwt.exp");

const exp   = { expiresIn: expTime };
//const exp   = { expiresIn: '365d' };


var generateJWT = (payLoad) => {
    //payLoad.salt = jwtSalt();

    return new Promise((resolve, reject) => {
        jwt.sign(payLoad, sk, exp, (err, token) => {
            if(err)
            {
                //reject({'token' : ''});
                reject('');
            }
            if(token) {
                //resolve({'token' : token});
                //console.log("Genering Token-"+token);
                resolve(token);
            }
        });
    });
}
//Note by sumit
//If somebody tampers with payload, token verification fails. I have tested this by changing userid(email) in the payload.

var verifyJWT = (t) => {
  //console.log("Checking Token-"+t);
    return new Promise((resolve, reject) => {
        jwt.verify(t, sk, {}, (err, verified) => {
            if(err) {
              reject(err);
            }
            if(verified) {
              var decoded = jwt.decode(t, {complete: true});
              if(decoded.payload) {
                  var payload = decoded.payload;
                  // payload.userid= decoded.payload.userid;
                  // payload.salt = decoded.payload.salt;
                  //sumit to add code for email and salt verification
              resolve(payload);
            }
          }
        });
    })
}

var verifyJWT1 = (t) => {
  //whenever verification is performed, a new token is generated
    return new Promise((resolve, reject) => {
        jwt.verify(t, sk, {}, (err, verified) => {
            if(verified) {
                var decoded = jwt.decode(t, {complete: true});
                var payload = {};
                if(decoded.payload) {
                    payload.email = decoded.payload.email;
                    payload.s = jwtSalt();
                    generateJWT(payload).then(function(refreshed) {
                        if(refreshed) {
                            var token = refreshed;
                            resolve(token);
                        }
                        else {
                            resolve(verified);
                        }
                    });
                }
            }
            if(err) {
              var er = {};
              er.message="Token verification failed";
              reject(er);
            }
        });
    })
}

var jwtSalt = () => {
    return crypto.randomBytes(256).toString('base64');
}

module.exports = {
    generateJWT: generateJWT,
    verifyJWT: verifyJWT
};
