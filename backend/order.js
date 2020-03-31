
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const config = require('./config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')

const DB = require('./dbSQL')
const secure = require('./secure');

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

function getOrderFromSage(belID, res) {
    let selectQuery = 'SELECT BelID, Mandant, Belegnummer, A0Name1, A0Matchcode FROM KHKVKBelege WHERE BelID = ?';
    let query = mysql.format(selectQuery, [belID]);
    DB.handle_db_sageDB(query, (result) => {
        if (result.error) {
            res.status(500).send('Error on the server.')
        } else {
            if (!result.data[0]) {
                res.status(404).send('No Order found.')
            } else {
                let data = result.data[0];
                let insertQuery = 'INSERT INTO Orders SET BusinessId = ?, ScanCode = ?, Name = ?, Customer = ?, Note = "Created from Sage"'
                let query = mysql.format(insertQuery, [data.BelID, data.BelID, data.A0Matchcode, data.A0Name1]);

                DB.handle_db(query, (resultCreation) => {
                    if (resultCreation.error) {
                        res.status(500).send('There was a problem creating the Order.')
                    } else {
                        res.status(201).send(resultCreation.data)
                    }
                });
            }
        }
    });
}

router.post('/create', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let insertQuery = 'INSERT INTO Orders SET ?'
            let query = mysql.format(insertQuery, req.body.order);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem creating the Order.')
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
            let updateQuery = 'UPDATE Orders SET ? WHERE OrderId = ?';
            let query = mysql.format(updateQuery, [req.body.order, req.body.orderId]);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem creating the Order.')
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
            let selectQuery = 'SELECT * FROM Orders WHERE BusinessId = ?';
            let query = mysql.format(selectQuery, [req.body.businessId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        if (req.body.import) {
                            getOrderFromSage(req.body.businessId, res);
                        } else {
                            return res.status(404).send('No Order found.')
                        }
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

router.post('/getById', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT * FROM Orders WHERE OrderId = ?';
            let query = mysql.format(selectQuery, [req.body.orderId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        // getOrderFromSage(req.body.orderId, res);
                        return res.status(404).send('No Order found.')
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
            let selectQuery = 'SELECT * FROM Orders';
            DB.handle_db(selectQuery, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Orders found.')
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

router.post('/getAllSage', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT BelID, Mandant, Belegnummer, A0Name1 FROM KHKVKBelege';
            DB.handle_db_sageDB(selectQuery, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Orders found.')
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

router.post('/getActiveTasks', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT o.Name, o.Note, o.Customer, t.Name as TaskName, s.Name as ScopeName, o.OrderId, oe.TaskId, oe.OrderEntryId FROM Orders o, OrderEntry oe, Task t, Scope s WHERE o.OrderID = oe.OrderId AND oe.TaskId = t.TaskId AND t.ScopeId = s.ScopeId AND oe.EndTime IS NULL AND oe.UserId = ?';
            let query = mysql.format(selectQuery, [req.body.userId]);
            console.log(query);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Orders found.')
                    } else {
                        // console.log(result.data)
                        res.status(200).send(result.data)
                    }
                }
            })
        } else {
            return res.status(401).send(sec.err)
        }
    });
})

router.post('/getRecent', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT DISTINCT o.Name, o.Note, o.Customer, o.ScanCode, o.BusinessId, o.OrderId, oe.EndTime FROM Orders o, OrderEntry oe WHERE o.OrderID = oe.OrderId AND oe.UserId = ? ORDER BY oe.EndTime DESC LIMIT 5';
            let query = mysql.format(selectQuery, [req.body.userId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Orders found.')
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

router.post('/getOrderStatus', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT * FROM Orders o, OrderEntry oe WHERE o.OrderID = oe.OrderId AND oe.EndTime IS NULL AND oe.UserId = ?';
            let query = mysql.format(selectQuery, [req.body.userId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Orders found.')
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

router.post('/getOrderDuration', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT StartTime, EndTime FROM OrderEntry WHERE OrderId = ?';
            let query = mysql.format(selectQuery, [req.body.orderId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    let running = false;
                    let duration = 0;
                    if (result.data.length > 0) {
                        let groupLength = result.data.length;
                        for (var i = 0; i < groupLength; i++) {
                            var tmp = result.data[i]
                            if (!tmp.EndTime) {
                                running = true;
                                tmp.EndTime = new Date();
                            }
                            duration += ((tmp.EndTime.getTime() - tmp.StartTime.getTime()) / 1000);
                            if ((i + 1) == (groupLength)) {
                                res.status(200).send({ running, duration })
                            }
                        }
                    } else {
                        res.status(200).send({ running, duration: 0 })
                    }
                }
            })
        } else {
            return res.status(401).send(sec.err)
        }
    });
})

router.post('/getOrderCosts', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT oe.StartTime, oe.EndTime, u.Cost as StaffCost, t.Cost as HardwareCost FROM OrderEntry oe, Task t, User u WHERE oe.OrderId = ? AND oe.TaskId = t.TaskId AND oe.UserId = u.UserId';
            let query = mysql.format(selectQuery, [req.body.orderId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    let staffCost = 0;
                    let hardwareCost = 0;
                    if (result.data.length > 0) {
                        let groupLength = result.data.length;
                        for (var i = 0; i < groupLength; i++) {
                            var tmp = result.data[i]
                            if (!tmp.EndTime) {
                                tmp.EndTime = new Date();
                            }
                            let duration = ((tmp.EndTime.getTime() - tmp.StartTime.getTime()) / 1000);
                            staffCost += duration*tmp.StaffCost/3600;
                            hardwareCost += duration*tmp.HardwareCost/3600;
                            if ((i + 1) == (groupLength)) {
                                console.log({ staffCost, hardwareCost });
                                res.status(200).send({ staffCost, hardwareCost })
                            }
                        }
                    } else {
                        console.log({ staffCost, hardwareCost });
                        res.status(200).send({ staffCost, hardwareCost})
                    }
                }
            })
        } else {
            return res.status(401).send(sec.err)
        }
    });
})

// ---------- Order Entry

router.post('/createEntry', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let insertQuery = 'INSERT INTO OrderEntry SET ?'
            let query = mysql.format(insertQuery, req.body.orderEntry);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem creating the Order Entry.')
                } else {
                    res.status(200).send(result.data)
                }
            });
        } else {
            return res.status(401).send(sec.err)
        }
    });
});

router.post('/editEntry', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let updateQuery = 'UPDATE OrderEntry SET ? WHERE OrderEntryId = ?';
            let query = mysql.format(updateQuery, [req.body.orderEntry, req.body.orderEntryId]);
            console.log(query);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem creating the Order Entry.')
                } else {
                    res.status(200).send(result.data)
                }
            });
        } else {
            return res.status(401).send(sec.err)
        }
    });
});


router.post('/getEntry', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT * FROM OrderEntry WHERE OrderEntryId = ?';
            let query = mysql.format(selectQuery, [req.body.orderEntryId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Order Entry found.')
                    } else {
                        res.status(200).send(result.data[0])
                    }
                }
            })
        } else {
            return res.status(401).send(sec.err)
        }
    });
});

router.post('/getEntryAttributes', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT te.InputValue, te.Timestamp, te.TaskAttributeEntryId, te.TaskAttributeId, ta.IsStart, ta.IsEnd, ta.Type, te.InputValue, ta.Name FROM TaskAttributeEntry te, TaskAttribute ta WHERE te.OrderEntryId = ? AND te.TaskAttributeId = ta.TaskAttributeId';
            let query = mysql.format(selectQuery, [req.body.orderEntryId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Task Attribute Entry found.')
                    } else {
                        res.status(200).send(result.data)
                    }
                }
            })
        } else {
            return res.status(401).send(sec.err)
        }
    });
});

router.post('/getEntries', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT oe.OrderEntryId, oe.StartTime, oe.EndTime, oe.Note, t.Name as TaskName, s.Name as ScopeName, u.Name as Username, u.Cost as StaffCost, t.Cost as HardwareCost FROM OrderEntry oe, Task t, Scope s, User u WHERE oe.OrderId = ? AND oe.TaskId = t.TaskId AND t.ScopeId = s.ScopeId AND oe.UserId = u.UserId';
            let query = mysql.format(selectQuery, [req.body.orderId]);
            console.log(query)
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data) {
                        return res.status(404).send('No Order Entry found.')
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

router.post('/startTask', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            let time = (new Date(Date.now() - tzoffset)).toISOString();
            let insertQuery = 'INSERT INTO OrderEntry (StartTime, Note, UserId, OrderId, TaskId) VALUES (?, ?, ?, ?, ?)'
            let query = mysql.format(insertQuery, [time, null, req.body.userId, req.body.orderId, req.body.taskId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem creating the Order Entry.')
                } else {
                    res.status(200).send(result.data)
                    let insertQuery = '(?, ?, ?, ?),'
                    let query = 'INSERT INTO TaskAttributeEntry (TaskAttributeId, OrderEntryId, Timestamp, InputValue) VALUES';
                    if (req.body.parameters.length >= 0) {
                        req.body.parameters.forEach((val, key, arr) => {
                            var queryTmp = mysql.format(insertQuery, [val.id, result.data.insertId, time, req.body.form.parameters[key]]);
                            query = query.concat(queryTmp)
                            if (Object.is(arr.length - 1, key)) {
                                console.log(query)
                                query = query.substring(0, query.length - 1);
                                DB.handle_db(query, (result) => {
                                    if (result.error) {
                                        console.log('There was a problem creating Order Entry.')
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } else {
            return res.status(401).send(sec.err)
        }
    });
});

router.post('/stopTask', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            let time = (new Date(Date.now() - tzoffset)).toISOString();
            let updateQuery = 'UPDATE OrderEntry SET EndTime = ?, Note = ? WHERE OrderEntryId = ?';
            let query = mysql.format(updateQuery, [time, req.body.note, req.body.orderEntryId]);
            console.log(query)
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem updating the Order Entry.')
                } else {
                    res.status(200).send(result.data)
                    let insertQuery = '(?, ?, ?, ?),'
                    let query = 'INSERT INTO TaskAttributeEntry (TaskAttributeId, OrderEntryId, Timestamp, InputValue) VALUES';
                    if (req.body.parameters.length >= 0) {
                        req.body.parameters.forEach((val, key, arr) => {
                            var queryTmp = mysql.format(insertQuery, [val.id, req.body.orderEntryId, time, req.body.form.parameters[key]]);
                            query = query.concat(queryTmp)
                            if (Object.is(arr.length - 1, key)) {
                                console.log(query)
                                query = query.substring(0, query.length - 1);
                                DB.handle_db(query, (result) => {
                                    if (result.error) {
                                        console.log('There was a problem updating Order Entry.')
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } else {
            return res.status(401).send(sec.err)
        }
    });
});


// ---------- Task

router.post('/getTaskAttributeEntries', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT * FROM TaskAttributeEntry WHERE OrderEntryId = ?';
            let query = mysql.format(selectQuery, [req.body.orderEntryId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Task Attribute Entries found.')
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

// ---------- Task Mapping

router.post('/createTaskMapping', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let insertQuery = 'INSERT INTO OrderTask SET ?'
            let query = mysql.format(insertQuery, req.body.orderTask);

            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('There was a problem creating the Order Task mapping.')
                } else {
                    res.status(200).send(result.data)
                }
            });
        } else {
            return res.status(401).send(sec.err)
        }
    });
});

router.post('/getTaskMapping', function (req, res) {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT * FROM OrderTask WHERE OrderId = ?';
            let query = mysql.format(selectQuery, [req.body.orderId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        return res.status(404).send('No Order Entries found.')
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

router.post('/getBusinessId', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT o.BusinessId FROM Orders o, OrderEntry oe WHERE oe.orderEntryId = ? AND oe.OrderId = o.OrderId';
            let query = mysql.format(selectQuery, [req.body.orderEntryId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        // getOrderFromSage(req.body.orderId, res);
                        return res.status(404).send('No Order found.')
                    } else {
                        res.status(200).send(result.data[0].BusinessId)
                    }
                }
            })
        } else {
            return res.status(401).send(sec.err)
        }
    });
})

router.post('/getByOrderEntry', (req, res) => {
    secure.verify(req.headers.authorization, function (sec) {
        if (sec.auth) {
            let selectQuery = 'SELECT o.BusinessId, o.Name, o.OrderId, o.Note, o.Customer FROM Orders o, OrderEntry oe WHERE oe.orderEntryId = ? AND oe.OrderId = o.OrderId';
            let query = mysql.format(selectQuery, [req.body.orderEntryId]);
            DB.handle_db(query, (result) => {
                if (result.error) {
                    return res.status(500).send('Error on the server.')
                } else {
                    if (!result.data[0]) {
                        // getOrderFromSage(req.body.orderId, res);
                        return res.status(404).send('No Order found.')
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
