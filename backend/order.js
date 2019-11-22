
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
    let insertQuery = 'INSERT INTO Orders SET ?'
    let query = mysql.format(insertQuery, req.body.order);

    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('There was a problem creating the Order.')
        } else {
            res.status(200).send(result.data)
        }
    });
});

router.post('/edit', function (req, res) {
    let updateQuery = 'UPDATE Orders SET ? WHERE OrderId = ?';
    let query = mysql.format(updateQuery, [req.body.order, req.body.orderId]);

    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('There was a problem creating the Order.')
        } else {
            res.status(200).send(result.data)
        }
    });
});


router.post('/get', (req, res) => {
    let selectQuery = 'SELECT * FROM Orders WHERE OrderId = ?';
    let query = mysql.format(selectQuery,[req.body.orderId]);
    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('Error on the server.')
        } else {
            if (!result.data[0]){
                return res.status(404).send('No Order found.')
            } else {
                res.status(200).send( result.data[0] )
            }
        }
    })
})

router.post('/getAll', (req, res) => {
    let selectQuery = 'SELECT * FROM Orders';
    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('Error on the server.')
        } else {
            if (!result.data[0]){
                return res.status(404).send('No Orders found.')
            } else {
                res.status(200).send( result.data )
            }
        }
    })
})


// ---------- Order Entry

router.post('/createEntry', function (req, res) {
    let insertQuery = 'INSERT INTO OrderEntry SET ?'
    let query = mysql.format(insertQuery, req.body.orderEntry);

    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('There was a problem creating the Order Entry.')
        } else {
            res.status(200).send(result.data)
        }
    });
});

router.post('/editEntry', function (req, res) {
    let updateQuery = 'UPDATE OrderEntry SET ? WHERE OrderEntryId = ?';
    let query = mysql.format(updateQuery, [req.body.orderEntry, req.body.orderEntryId]);

    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('There was a problem creating the Order Entry.')
        } else {
            res.status(200).send(result.data)
        }
    });
});


router.post('/getEntry', (req, res) => {
    let selectQuery = 'SELECT * FROM OrderEntry WHERE OrderEntryId = ?';
    let query = mysql.format(selectQuery,[req.body.orderEntryId]);
    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('Error on the server.')
        } else {
            if (!result.data[0]){
                return res.status(404).send('No Order Entry found.')
            } else {
                res.status(200).send( result.data[0] )
            }
        }
    })
})

router.post('/getEntries', (req, res) => {
    let selectQuery = 'SELECT * FROM OrderEntry WHERE OrderId = ?';
    let query = mysql.format(selectQuery,[req.body.orderId]);
    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('Error on the server.')
        } else {
            if (!result.data[0]){
                return res.status(404).send('No Order Entries found.')
            } else {
                res.status(200).send( result.data[0] )
            }
        }
    })
})


// ---------- Task

router.post('/getTaskAttributeEntries', (req, res) => {
    let selectQuery = 'SELECT * FROM TaskAttributeEntry WHERE OrderEntryId = ?';
    let query = mysql.format(selectQuery,[req.body.orderEntryId]);
    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('Error on the server.')
        } else {
            if (!result.data[0]){
                return res.status(404).send('No Task Attribute Entries found.')
            } else {
                res.status(200).send( result.data )
            }
        }
    })
})

// ---------- Task Mapping

router.post('/createTaskMapping', function (req, res) {
    let insertQuery = 'INSERT INTO OrderTask SET ?'
    let query = mysql.format(insertQuery, req.body.orderTask);

    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('There was a problem creating the Order Task mapping.')
        } else {
            res.status(200).send(result.data)
        }
    });
});

router.post('/getTaskMapping', function (req, res) {
    let selectQuery = 'SELECT * FROM OrderTask WHERE OrderId = ?';
    let query = mysql.format(selectQuery,[req.body.orderId]);
    DB.handle_db(query, (result) => {
        if (result.error){
            return res.status(500).send('Error on the server.')
        } else {
            if (!result.data[0]){
                return res.status(404).send('No Order Entries found.')
            } else {
                res.status(200).send( result.data[0] )
            }
        }
    })
})

// ---------- Test

router.get('/ping', function (req, res) {
    res.send("Pong");
    // let insertQuery = 'INSERT INTO Orders (BusinessId,ScanCode,Name,Customer,Note) VALUES (?,?,?,?,?)';
    // let query = mysql.format(insertQuery,[
    //     'B2',
    //     '1338',
    //     'Shirt',
    //     'Telekom',
    //     'DescNote',
    // ]);

    // DB.handle_db(query, (result) => {
    //     if (result.error){
    //         return res.send('There was a problem creating the Order.')
    //     } else {
    //         res.send(result.data)
    //     }
    // });
    // let insertQuery = 'INSERT INTO OrderTask (Mandatory,TaskId,OrderId) VALUES (?,?,?)';
    // let query = mysql.format(insertQuery,[
    //     'false',
    //     '5',
    //     '1',
    // ]);

    // DB.handle_db(query, (result) => {
    //     if (result.error){
    //         return res.send('There was a problem creating the Order.')
    //     } else {
    //         res.send(result.data)
    //     }
    // });
});

module.exports = router;
