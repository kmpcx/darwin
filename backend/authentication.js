const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const config = require('./config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const DB = require('./db')

const db = new DB('sqlitedb')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/register', function (req, res) {
    db.insert([
        req.body.name,
        req.body.email,
        bcrypt.hashSync(req.body.password, 8)
    ],
        function (err) {
            if (err) return res.status(500).send('There was a problem registering the user.')
            db.selectByEmail(req.body.email, (err, user) => {
                if (err) return res.status(500).send('There was a problem getting user')
                let token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                })
                res.status(200).send({ auth: true, token: token, user: user })
            })
        })
})

router.post('/register-admin', function (req, res) {
    db.insertAdmin([
        req.body.name,
        req.body.email,
        bcrypt.hashSync(req.body.password, 8),
        1
    ],
        function (err) {
            if (err) return res.status(500).send('There was a problem registering the user.')
            db.selectByEmail(req.body.email, (err, user) => {
                if (err) return res.status(500).send('There was a problem getting user')
                let token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                })
                res.status(200).send({ auth: true, token: token, user: user })
            })
        })
})

router.post('/login', (req, res) => {
    db.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send('Error on the server.')
        if (!user) return res.status(404).send('No user found.')
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.user_pass)
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })
        let token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        })
        res.status(200).send({ auth: true, token: token, user: user })
    })
})

router.get('/ping', function (req, res) {
    res.send("Pong")
});

module.exports = router;
