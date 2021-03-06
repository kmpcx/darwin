const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const config = require('./config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')

const DB = require('./dbSQL')
const secure = require('./secure')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/create', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let insertQuery = 'INSERT INTO Scope SET ?'
            let query = mysql.format(insertQuery, req.body.scope);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem creating the scope.')
                } else {
                    res.status(200).send(result.data)
                }
            });
        } else {
            return res.status(401).send(sec.err)
        }
    });
});

router.post('/edit', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let updateQuery = 'UPDATE Scope SET ? WHERE ScopeId = ?';
            let query = mysql.format(updateQuery, [req.body.scope, req.body.scopeId]);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem creating the scope.')
                } else {
                    res.status(200).send(result.data)
                }
            });
        } else {
            return res.status(401).send(sec.err)
        }
    });
});


router.post('/get', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT * FROM Scope WHERE ScopeId = ?';
            let query = mysql.format(selectQuery, [req.body.scopeId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Scope found.')
                    } else {
                        res.status(200).send(result.data[0])
                    }
                }
            })
        } else {
            return res.status(401).send(sec.err)
        }
    });
})

router.post('/getAll', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let query = 'SELECT * FROM Scope';
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Scopes found.')
                    } else {
                        res.status(200).send(result.data)
                    }
                }
            })
        } else {
            return res.status(401).send(sec.err)
        }
    });
})

router.post('/getTasks', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT * FROM Task WHERE ScopeId = ?';
            let query = mysql.format(selectQuery, [req.body.scopeId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Tasks found.')
                    } else {
                        res.status(200).send(result.data)
                    }
                }
            })
        } else {
            return res.status(401).send(sec.err)
        }
    });
})

router.post('/getByOrder', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let query = 'SELECT * FROM Scope';
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Tasks found.')
                    } else {
                        res.status(200).send(result.data)
                    }
                }
            })
        } else {
            return res.status(401).send(sec.err)
        }
    });
})

router.get('/ping', function (req, res) {
    // res.send("Pong Scope");
    // var data = {name: "Scope A", Description: 'Desc test 1'} // consider some dummy data
    // var query = mysql.format("UPDATE Scope SET ? WHERE ScopeId = ?", [data, '1']);

    // let selectQuery = 'SELECT s.ScopeId, s.Name, s.ColorBackground, s.Icon, t.Name FROM Scope s, Task t, OrderTask ot WHERE ot.OrderId = ? and ot.TaskId = t.TaskId and t.ScopeId = s.ScopeId GROUP BY s.ScopeId';
    // // let query = mysql.format(selectQuery,1);
    // DB.handle_db(selectQuery, (result) => {
    //     if (result.error){
    //         return res.status(500).send('Error on the server.')
    //     } else {
    //         if (!result.data[0]){
    //             return res.send('No Tasks found.')
    //         } else {
    //             res.send( result.data )
    //         }
    //     }
    // })
});

router.post('/test', (req, res) => {
    let a = req.body.name
    let b = req.body.description

    a = a.toUpperCase()
    b = b.toLowerCase()

    res.send({ a, b })
})

module.exports = router;
