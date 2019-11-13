const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const config = require('./config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')

const DB = require('./dbSQL')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/create', function (req, res) {
    let insertQuery = 'INSERT INTO Scope SET ?'
    let query = mysql.format(insertQuery, req.body.scope);

    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('There was a problem creating the scope.')
        } else {
            res.status(200).send(result.data)
        }
    });
});

router.post('/edit', function (req, res) {
    let updateQuery = 'UPDATE Scope SET ? WHERE ScopeId = ?';
    let query = mysql.format(updateQuery, [req.body.scope, req.body.scopeId]);

    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('There was a problem creating the scope.')
        } else {
            res.status(200).send(result.data)
        }
    });
});


router.post('/get', (req, res) => {
    let selectQuery = 'SELECT * FROM Scope WHERE ScopeId = ?';
    let query = mysql.format(selectQuery,[req.body.scopeId]);
    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('Error on the server.')
        } else {
            if (!result.data[0]){
                return res.status(404).send('No Scope found.')
            } else {
                res.status(200).send( result.data[0] )
            }
        }
    })
})

router.post('/getAll', (req, res) => {
    let query = 'SELECT * FROM Scope';
    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('Error on the server.')
        } else {
            if (!result.data[0]){
                return res.status(404).send('No Scopes found.')
            } else {
                res.status(200).send( result.data )
            }
        }
    })
})

router.post('/getTasks', (req, res) => {
    let selectQuery = 'SELECT * FROM Task WHERE ScopeId = ?';
    let query = mysql.format(selectQuery,[req.body.scopeId]);
    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('Error on the server.')
        } else {
            if (!result.data[0]){
                return res.status(404).send('No Tasks found.')
            } else {
                res.status(200).send( result.data )
            }
        }
    })
})

router.get('/ping', function (req, res) {
    // res.send("Pong Scope");
    // var data = {name: "Scope A", Description: 'Desc test 1'} // consider some dummy data
    // var query = mysql.format("UPDATE Scope SET ? WHERE ScopeId = ?", [data, '1']);

    let data = {Name: 'Scope F'}
    let insertQuery = 'INSERT INTO Scope SET ?'
    let query = mysql.format(insertQuery, data);

    DB.handle_db(query, (result) => {
        console.log(result)
        if (result.data.error){
            return res.send('There was a problem creating the Task.')
        } else {
            res.send(result.data)
        }
    });
});

router.post('/test', (req, res) => {
    let a = req.body.name
    let b = req.body.description

    a = a.toUpperCase()
    b = b.toLowerCase()

    res.send({a, b})
})

module.exports = router;
