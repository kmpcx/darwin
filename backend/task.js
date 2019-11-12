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

// Tasks

router.post('/create', function (req, res) {
    let insertQuery = 'INSERT INTO Task (Name,Description,ColorBackground,ColorText,Icon,ScopeId) VALUES (?,?,?,?,?,?)';
    let query = mysql.format(insertQuery,[
        req.body.name,
        req.body.description,
        req.body.colorBackground,
        req.body.colorText,
        req.body.icon,
        req.body.scopeId,
    ]);

    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('There was a problem creating the Task.')
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
                res.status(200).send( result.data[0] )
            }
        }
    })
})


// ---------- Task Attributes

router.post('/addAttribute', function (req, res) {
    let insertQuery = 'INSERT INTO TaskAttribute (Name,Description,IsStart,IsEnd,Type,Values,TaskId) VALUES (?,?,?,?,?,?,?)';
    let query = mysql.format(insertQuery,[
        req.body.name,
        req.body.description,
        req.body.isStart,
        req.body.isEnd,
        req.body.type,
        req.body.values,
        req.body.taskId,
    ]);

    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('There was a problem creating the Task Attribute.')
        } else {
            res.status(200).send(result.data)
        }
    });
});

router.get('/ping', function (req, res) {
    res.send("Pong Task");
    // let insertQuery = 'INSERT INTO Task (Name,Description,ColorBackground,ColorText,Icon,ScopeId) VALUES (?,?,?,?,?,?)';
    // let query = mysql.format(insertQuery,[
    //     'Scope A',
    //     'Desc',
    //     'white',
    //     'black',
    //     'check',
    //     '1',
    // ]);

    // DB.handle_db(query, (result) => {
    //     if (result.error){
    //         return res.send('There was a problem creating the Task.')
    //     } else {
    //         res.send(result.data)
    //     }
    // });
});

module.exports = router;
