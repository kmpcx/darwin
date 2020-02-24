const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit : 20,
  host: '***REMOVED***',
  user: '***REMOVED***',
  password: '***REMOVED***',
  database: '***REMOVED***',
  debug:  false
});

const poolSage = mysql.createPool({
  connectionLimit : 20,
  host: '***REMOVED***',
  user: '***REMOVED***',
  password: '***REMOVED***',
  database: '***REMOVED***',
  debug:  false
});

function handle_db(query, callback){
  pool.query(query, function(err, data){
    if(err) {
      console.log(err);
      return callback({'error': true, 'data': 'Error occurred - ' + err});
    } else {
      return callback({'error': false, 'data': data});
    }
   });
};

function handle_db_sageDB(query, callback){
  poolSage.query(query, function(err, data){
    if(err) {
      console.log(err);
      return callback({'error': true, 'data': 'Error occurred - ' + err});
    } else {
      return callback({'error': false, 'data': data});
    }
   });
};

module.exports = {
  handle_db,
  handle_db_sageDB
};

