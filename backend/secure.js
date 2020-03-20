
const config = require('./config')
const jwt = require('jsonwebtoken')

function sign(userId) {
    let token = jwt.sign({ id: userId }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    })
    return token;
}

function verify(token, callback){
    jwt.verify(token, config.secret, function(err, decoded) {
        if(decoded){
            callback({auth: true, err: null})
        } else {
            callback({auth: true, err: err.name})
        }
      });
}

module.exports = {
    verify,
    sign
  }