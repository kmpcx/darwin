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

// Tasks

router.post('/create', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let insertQuery = 'INSERT INTO Task SET ?'
            let query = mysql.format(insertQuery, req.body.task);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem creating the Task.')
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
            let updateQuery = 'UPDATE Task SET ? WHERE TaskId = ?';
            let query = mysql.format(updateQuery, [req.body.task, req.body.taskId]);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a updating creating the Task.')
                } else {
                    res.status(200).send(result.data)
                }
            });
        } else {
            return res.status(401).send(sec.err)
        }
    });
});

router.post('/update', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let updateQuery = 'UPDATE Task SET ? WHERE TaskId = ?';
            let query = mysql.format(updateQuery, [req.body.task, req.body.taskId]);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a updating creating the Task.')
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
            let selectQuery = 'SELECT * FROM Task WHERE TaskId = ?';
            let query = mysql.format(selectQuery, [req.body.taskId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Task found.')
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

router.post('/getInfo', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT t.Name, t.ColorBackground, t.Icon, s.Name as ScopeName, s.ScopeId FROM Scope s, Task t WHERE t.ScopeId = s.ScopeId and t.TaskId = ?';
            let query = mysql.format(selectQuery, [req.body.taskId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Task found.')
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
            let selectQuery = 'SELECT * FROM Task';
            DB.handle_db(selectQuery, (result) => {
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


// ---------- Task Attributes

// Values: Name, Description, IsStart, IsEnd, Type, Values, TaskId
router.post('/addAttribute', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let insertQuery = 'INSERT INTO TaskAttribute SET ?'
            let query = mysql.format(insertQuery, req.body.taskAttribute);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem creating the Task Attribute.')
                } else {
                    res.status(200).send(result.data)
                }
            });
        } else {
            return res.status(401).send(sec.err)
        }
    });
});

router.post('/editAttribute', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let updateQuery = 'UPDATE TaskAttribute SET ? WHERE TaskAttributeId = ?';
            let query = mysql.format(updateQuery, [req.body.taskAttribute, req.body.taskAttributeId]);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem updating the Task Attribute.')
                } else {
                    res.status(200).send(result.data)
                }
            });
        } else {
            return res.status(401).send(sec.err)
        }
    });
});

router.post('/getAttribute', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {

        } else {
            return res.status(401).send(sec.err)
        }
    });
})

router.post('/getAttributes', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            // let selectQuery = "SELECT * FROM TaskAttribute WHERE TaskId = ? and ?? = '1'";
            let selectQuery = "SELECT ta.TaskAttributeId, ta.Name, ta.Type, ta.Root, ta.Default, GROUP_CONCAT(tav.Value) as ValValues, GROUP_CONCAT(tav.Name) as ValNames, GROUP_CONCAT(tav.Invoke) as ValInvoke, GROUP_CONCAT(tav.TaskAttributeValueId) as ValIds FROM TaskAttribute as ta, TaskAttributeValue as tav WHERE ta.TaskId = ? AND ?? = 1 AND ta.TaskAttributeId = tav.TaskAttributeId GROUP BY ta.TaskAttributeId ORDER BY ta.SortingNumber"
            let query = mysql.format(selectQuery, [req.body.taskId, req.body.time]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        res.status(200).send({})
                    } else {
                        let parameters = []
                        result.data.forEach(element => {
                            let parameter = { id: element.TaskAttributeId, name: element.Name, type: element.Type, root: element.Root, default: element.Default }
                            if (element.Type === 'int') {
                                parameter.values = [{ value: element.Default, invoke: element.ValInvoke, id: element.ValIds }];
                            } else if (element.ValValues){
                                var values = element.ValValues.split(",");
                                var names =  element.ValNames.split(",");
                                var invoke;
                                if(element.ValInvoke !== null){
                                    invoke = element.ValInvoke.split(",");
                                }
                                var ids = element.ValIds.split(",");
                                var keyVal = [];
                                for (var i = 0; i < values.length; i++) {
                                    keyVal.push({ name: names[i], value: values[i], invoke: invoke[i], id: ids[i] });
                                }
                                parameter.values = keyVal;
                            }
                            parameters.push(parameter)
                        });
                        res.status(200).send(parameters)
                    }
                }
            })
        } else {
            return res.status(401).send(sec.err)
        }
    });
})


// ---------- Task Attribute Entries

router.post('/addAttributeEntry', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let insertQuery = 'INSERT INTO TaskAttributeEntry SET ?'
            let query = mysql.format(insertQuery, req.body.taskAttributeEntry);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem creating the Task Attribute Entry.')
                } else {
                    res.status(200).send(result.data)
                }
            });
        } else {
            return res.status(401).send(sec.err)
        }
    });
});

router.post('/editAttributeEntry', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let updateQuery = 'UPDATE TaskAttributeEntry SET ? WHERE TaskAttributeEntryId = ?';
            let query = mysql.format(updateQuery, [req.body.taskAttribute, req.body.taskAttributeEntryId]);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem updating the Task Attribute Entry.')
                } else {
                    res.status(200).send(result.data)
                }
            });
        } else {
            return res.status(401).send(sec.err)
        }
    });
});

router.post('/getAttributeEntry', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT * FROM TaskAttributeEntry WHERE TaskAttributeEntryId = ?';
            let query = mysql.format(selectQuery, [req.body.taskAttributeEntryId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Task Attribute Entry found.')
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

router.post('/getByOrderAndScope', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT * FROM Task WHERE ScopeId = ?';
            let query = mysql.format(selectQuery, [req.body.scopeId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(503).send('No Tasks found.')
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




// ---------- Test


router.get('/ping', function (req, res) {
    res.send("Pong Task");
    // let selectQuery = 'SELECT t.Taskid, t.Name, t.ColorBackground, t.Icon FROM Scope s, Task t, OrderTask ot WHERE ot.OrderId = ? and ot.TaskId = t.TaskId and t.ScopeId = s.ScopeId and s.ScopeId = ?';
    // let query = mysql.format(selectQuery, [1, 1]);
    // DB.handle_db(query, (result) => {
    //     if (result.error){
    //         return res.send('Error on the server.')
    //     } else {
    //         if (!result.data[0]){
    //             return res.send('No Tasks found.')
    //         } else {
    //             res.send( result.data )
    //         }
    //     }
    // })
    // let insertQuery = 'INSERT INTO Task (Name,Description,ColorBackground,Icon,ScopeId) VALUES (?,?,?,?,?)';
    // let query = mysql.format(insertQuery,[
    //     'Task',
    //     'Desc',
    //     '#66BB6A',
    //     'mdi-ninja',
    //     '2',
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
