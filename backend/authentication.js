
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

router.post('/register', function (req, res) {
    let insertQuery = 'INSERT INTO User (Name,Mail,Username,Password,Language,IsAdmin,IsActive) VALUES (?,?,?,?,?,?,?)';
    let query = mysql.format(insertQuery,[
        req.body.name,
        req.body.email,
        req.body.name,
        bcrypt.hashSync(req.body.password, 8),
        'de',
        false,
        true
    ]);

    DB.handle_db(query, (result) => {
        if (result.data.error){
            return res.status(500).send('There was a problem registering the user.')
        } else {
            let selectQuery = 'SELECT * FROM User WHERE Mail = ?';
            let query = mysql.format(selectQuery,[req.body.email]);
            DB.handle_db(query, (result) => {
                if (result.error) return res.status(500).send('There was a problem getting user')
                let token = jwt.sign({ id: result.data[0]['UserId'] }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                })
                res.status(200).send({ auth: true, token: token, user: result.data[0] })
            })
        }
    });
});


router.post('/login', (req, res) => {
    let selectQuery = 'SELECT * FROM User WHERE Mail = ?';
    let query = mysql.format(selectQuery,[req.body.email]);
    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('Error on the server.')
        } else {
            if (!result.data[0]) return res.status(404).send('No user found.')
            let passwordIsValid = bcrypt.compareSync(req.body.password, result.data[0]['Password'])
            if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })
            let token = jwt.sign({ id: result.data[0]['UserId'] }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            })
            res.status(200).send({ auth: true, token: token, user: result.data[0] })
        }
    })
})

router.post('/info', (req, res) => {
    let selectQuery = 'SELECT BusinessId, Name, Username, Language FROM User WHERE UserId = ?';
    let query = mysql.format(selectQuery,[req.body.userId]);
    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('Error on the server.')
        } else {
            res.status(200).send(result.data)
        }
    })
})

router.get('/ping', function (req, res) {
    res.send("Pong");
    console.log('Ping Auth');
    // let insertQuery = 'INSERT INTO User (Name,Mail,Username,Password,Language,IsAdmin,IsActive) VALUES (?,?,?,?,?,?,?)';
    // let query = mysql.format(insertQuery,[
    //     'Test',
    //     'mail@kmpc.de',
    //     'Test',
    //     bcrypt.hashSync('password', 8),
    //     'de',
    //     true,
    //     true
    // ]);
    // DB.handle_db(query, (result) => {
    //     res.send("Pong");
    // });
});

module.exports = router;
