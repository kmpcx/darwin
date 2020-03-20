
const config = require('./config')
const jwt = require('jsonwebtoken')

function sign(userId) {
    let token = jwt.sign({ id: userId }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    })
    return token;
}

function verify(token){
    jwt.verify(token, config.secret, function(err, decoded) {
        // console.log("decoded: " + decoded);
        // console.log("err: " + err);
        // console.log(decoded.foo); // bar
        if(decoded){
            console.log("auth")
            return {auth: true, err: null}
        } else {
            console.log("No auth")
            console.log(err)
            return {auth: true, err: err.name}
        }
      });
}

module.exports = {
    verify,
    sign
  }