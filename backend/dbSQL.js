const mysql = require('mysql');

const pool = mysql.createPool({
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




//   authSelectByEmail (email, callback) {
//     return this.db.get(
//       `SELECT * FROM user WHERE email = ?`,
//       [email], function (err, row) {
//         callback(err, row)
//       })
//   }

//   authInsertAdmin (user, callback) {
//     return this.db.run(
//       'INSERT INTO user (name,email,user_pass,is_admin) VALUES (?,?,?,?)',
//       user, (err) => {
//         callback(err)
//       })
//   }

//   authSelectAll (callback) {
//     return this.db.all(`SELECT * FROM user`, function (err, rows) {
//       callback(err, rows)
//     })
//   }

//   authInsert (user, callback) {
//     return this.db.run(
//       'INSERT INTO user (name,email,user_pass) VALUES (?,?,?)',
//       user, (err) => {
//         callback(err)
//       })
//   }
  
//   // ---------------------- Working sector

//   // ---------------------- Working steps

//   // ---------------------- Orders
// }

module.exports = {
  handle_db,
};

