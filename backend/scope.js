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
    let insertQuery = 'INSERT INTO Scope (Name,Description,ColorBackground,ColorText,Icon) VALUES (?,?,?,?,?)';
    let query = mysql.format(insertQuery,[
        req.body.name,
        req.body.description,
        req.body.colorBackground,
        req.body.colorText,
        req.body.icon,
    ]);

    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('There was a problem creating the scope.')
        } else {
            res.status(200).send(result.data)
        }
    });
});

router.post('/edit', function (req, res) {
    var data = {email: "e@example.com", status: 2} // consider some dummy data
    var formattedQ = SqlString.format("UPDATE users SET ? WHERE id = 34", data);

    // formattedQ would be:
    // "UPDATE users SET `email` = 'e@example.com', `status` = 2 WHERE id = 34"

    let insertQuery = 'INSERT INTO Scope (Name,Description,ColorBackground,ColorText,Icon) VALUES (?,?,?,?,?)';
    let query = mysql.format(insertQuery,[
        req.body.name,
        req.body.description,
        req.body.colorBackground,
        req.body.colorText,
        req.body.icon,
    ]);

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
    let selectQuery = 'SELECT * FROM Scope';
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
    res.send("Pong Scope");
    // let insertQuery = 'INSERT INTO Scope (Name,Description,ColorBackground,ColorText,Icon) VALUES (?,?,?,?,?)';
    // let query = mysql.format(insertQuery,[
    //     'Scope C',
    //     'Desc',
    //     'black',
    //     'white',
    //     'check-bold',
    // ]);

    // DB.handle_db(query, (result) => {
    //     console.log(result)
    //     if (result.data.error){
    //         return res.send('There was a problem creating the Task.')
    //     } else {
    //         res.send(result.data)
    //     }
    // });
});

router.post('/test', (req, res) => {
    let a = req.body.name
    let b = req.body.description

    a.toUpperCase()
    b.toLowerCase()

    res.send({a, b})
})

module.exports = router;
