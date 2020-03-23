'use strict'
const express = require('express')
var cors = require('cors')
const authentication = require('./authentication');
const scope = require('./scope');
const task = require('./task');
const order = require('./order');
const moment = require('vue-moment');

const app = express()

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
}
app.use(allowCrossDomain)

// app.use(cors());
// app.use(cors({origin: 'https://***REMOVED***.kmpc.de'}));

app.use('/api/auth', authentication);
app.use('/api/scope', scope);
app.use('/api/task', task);
app.use('/api/order', order);

let port = process.env.PORT || 3000

let server = app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})
