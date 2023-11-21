const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};


app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'tms'
})

app.get('/arrivalsearchList', (req, res) => {
    const sql = "SELECT * FROM arrival";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE u_name = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length === 0) {
            // Authentication failed
            res.status(401).json({ error: 'Authentication failed' });
        } else {

            const role = results[0].u_role;
            const user_compID = results[0].compID;
            const userid = results[0].Uid;
            req.session.user_compID = user_compID;
            req.session.user_role = role;
            req.session.userid = userid;
            console.log('User compID:', user_compID);
            console.log('User Role:', role);
            console.log('userid', userid)
            res.status(200).json({ role, userid, user_compID, });
            return res.json
        }
    });
});


app.get('/logsinformationView', (req, res) => {

    const user_compId = req.headers.authorization.split('Bearer ')[1];
    console.log('User compID1:', user_compId, 'user role:', req.session.user_role);
    const sql = `SELECT * FROM V_TREES WHERE compID=?`;
    db.query(sql, [user_compId], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data);

    });
});


app.post('/test-session', (req, res) => {
    req.session.testData = 'Session Test Data';
    res.send('Session data set.');
});

app.get('/get-session', (req, res) => {
    const testData = req.session.testData;
    res.send(`Session data: ${testData}`);
});


app.get('/scheduledArrivallist', (req, res) => {
    const user_compId = req.headers.authorization.split('Bearer ')[1];

    console.log('user comp id  for sheduledarrivallist:', user_compId);
    const sql = "SELECT * FROM V_ARRIVAL WHERE recvCompanyID = ?";

    db.query(sql, [user_compId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/showAllscheduledArrivallist', (req, res) => {
    const user_compId = req.headers.authorization.split('Bearer ')[1];

    console.log('user comp id  for showallsheduledarrivallist:', user_compId);
    const sql = "SELECT * FROM V_ORDERS WHERE shipCompID = ?";

    db.query(sql, [user_compId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/showonlyintransportcheduledArrivallist', (req, res) => {
    const user_compId = req.headers.authorization.split('Bearer ')[1];

    console.log('user comp id  for onlyin trnasportsheduledarrivallist:', user_compId);
    const sql = "SELECT * FROM V_ORDERS WHERE readSrcID NOT IN (SELECT arrivalID FROM arrival) AND shipCompID = ?";
    db.query(sql, [user_compId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/showonlyitemconfirmedtobeinstockcheduledArrivallist', (req, res) => {
    const user_compId = req.headers.authorization.split('Bearer ')[1];

    console.log('user comp id  for instocksheduledarrivallist:', user_compId);
    const sql = "SELECT * FROM V_ORDERS WHERE readSrcID IN (SELECT arrivalID FROM arrival) AND shipCompID = ?";

    db.query(sql, [user_compId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/shippingInformationList', (req, res) => {
    const user_compId = req.headers.authorization.split('Bearer ')[1];
    console.log('user comp id  for shipment:', user_compId);
    const sql = "SELECT * FROM V_ORDERS WHERE shipCompID= ?";
    db.query(sql, [user_compId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/shippingNameGrower', (req, res) => {
    const logId = req.headers.authorization.split('Bearer ')[1];
    console.log('user compgrower:', logId);
    const sql = "SELECT CONCAT(growDay, '/', growPlace, '/', type, '/', size, '/', shape) as treeName FROM trees WHERE logID=?";

    db.query(sql, [logId], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        if (data.length === 0) {
            return res.status(404).send('No data found');
        }

        const treeName = data[0].treeName;
        console.log("response from server:", treeName);
        return res.type('text/plain').send(treeName);
    });
});
app.get('/showAllshippingInformationList', (req, res) => {
    const user_compId = req.headers.authorization.split('Bearer ')[1];
    console.log('user comp id  for onlyshipment:', user_compId);
    const sql = "SELECT * FROM V_ORDERS WHERE readSrcID IN (SELECT readSrcID FROM arrival) AND shipCompID =?";

    db.query(sql, [user_compId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/onlyunShippedItemshippingInformationList', (req, res) => {
    const user_compId = req.headers.authorization.split('Bearer ')[1];
    console.log('user comp id  for onlyshipment:', user_compId);
    const sql = "SELECT * FROM V_TREES WHERE logID NOT IN (SELECT readSrcID FROM tree_orders ) AND compID =?";

    db.query(sql, [user_compId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/onlyduringtransportiontemshippingInformationList', (req, res) => {
    const user_compId = req.headers.authorization.split('Bearer ')[1];
    console.log('user comp id  for showallshipment:', user_compId);
    const sql = "SELECT * FROM V_ORDERS WHERE readSrcID NOT IN (SELECT arrivalID FROM arrival) AND shipCompID =?";

    db.query(sql, [user_compId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/confirmedTobeinstockitemshippingInformationList', (req, res) => {
    const user_compId = req.headers.authorization.split('Bearer ')[1];
    console.log('user comp id  for showallshipment:', user_compId);
    const sql = "SELECT * FROM V_ORDERS WHERE readSrcID IN (SELECT arrivalID FROM arrival) AND shipCompID =?";

    db.query(sql, [user_compId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/productListinformation', (req, res) => {
    const user_compID = req.headers.authorization.split('Bearer ')[1];
    console.log("User-compidforproduct", user_compID);
    const sql = "SELECT * FROM products WHERE prodCompID =?";
    db.query(sql, [user_compID], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/showAllproductInformationList', (req, res) => {
    const user_compID = req.headers.authorization.split('Bearer ')[1];
    console.log("User-compidforproductshowall", user_compID);

    const sql = "SELECT * FROM products WHERE prodID NOT IN (SELECT readSrcID FROM tree_orders ) AND prodCompID =?";
    db.query(sql, [user_compID], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/showAonlyshippedproductsInformationList', (req, res) => {
    const user_compID = req.headers.authorization.split('Bearer ')[1];
    console.log("User-compidforproductshowall", user_compID);

    const sql = "SELECT * FROM products WHERE prodID IN (SELECT readSrcID FROM tree_orders ) AND prodCompID =?";
    db.query(sql, [user_compID], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/showunshippedproductsInformationList', (req, res) => {
    const user_compID = req.headers.authorization.split('Bearer ')[1];
    console.log("User-compidforproductshowall", user_compID);

    const sql = "SELECT * FROM products WHERE prodID NOT IN (SELECT readSrcID FROM tree_orders ) AND prodCompID =?";
    db.query(sql, [user_compID], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/typeOptions', (req, res) => {
    const sql = "SELECT * FROM mmasters WHERE m_kind = 1 AND delete_flg = 0 ORDER BY m_order";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
});
app.get('/shapeOptions', (req, res) => {
    const sql = "SELECT * FROM mmasters WHERE m_kind = 2 AND delete_flg = 0 ORDER BY m_order";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
});

app.get('/qualityOptions', (req, res) => {
    const sql = "SELECT * FROM mmasters WHERE m_kind = 3 AND delete_flg = 0 ORDER BY m_order";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
});

app.post('/logRegistration', (req, res) => {

    const authorizationHeader = req.headers.authorization; // Get the full Authorization header value
    const [, userid, user_compID] = authorizationHeader.split(' '); // Split the header value to get userid and user_compID
    console.log("before insterting it is okay");
    const {
        growingSite,
        shape,
        plantingDate,
        strength,
        fallingDate,
        quality,
        type,
        size,
        durability,
        note,
        processability
    } = req.body;

    var sql = `INSERT INTO trees (userID,compID,growPlace,shape,growDay,strength,fellDate,quality,type,size,durability,remarks,processability) VALUES (?,?,'${growingSite}', '${shape}', '${plantingDate}', '${strength}', '${fallingDate}', '${quality}', '${type}','${size}', '${durability}', '${note}', '${processability}')`;

    db.query(sql, [userid, user_compID], (err, result) => {
        if (!err) {
            res.status(200).json({ success: "Log Inserted Successfully" });
            console.log("after insterting ");

        } else {
            console.error("Error:", err);
          
        }
    });
});
app.put('/updateLogInformation/:logID', (req, res) => {
    const logID = req.params.logID;
    const updatedData = req.body;
    const sql = `
      UPDATE trees
      SET
        growDay = ?,
        growPlace = ?,
        fellDate = ?,
        type = ?,
        size = ?,
        shape = ?,
        strength = ?,
        quality = ?,
        durability = ?,
        remarks = ?
      WHERE
        logID = ?;
    `;

    db.query(
        sql,
        [
            updatedData.growDay,
            updatedData.growPlace,
            updatedData.fellDate,
            updatedData.type,
            updatedData.size,
            updatedData.shape,
            updatedData.strength,
            updatedData.quality,
            updatedData.durability,
            updatedData.remarks,
            logID,
        ],
        (err, result) => {
            if (err) {
                console.error('Error updating log:', err);
                res.status(500).json({ error: 'Failed to update log' });
            } else {
                console.log('log updated successfully');
                res.status(200).json({ success: true });
            }
        }
    );
});
app.put('/updateshipmentInformation/:logID', (req, res) => {
    const logID = req.params.logID;
    const updatedData = req.body;
    const sql = `
      UPDATE tree_orders
      SET
       
        shipAddress=?,
        shipAddress=?,
        shipDate=?,
        transMethod=?,
        expArrivalDate=?
      WHERE
        logID = ?;
    `;

    db.query(
        sql,
        [
            updatedData.shipAddress,
            updatedData.shipAddress,
            updatedData.shipDate,
            // updatedData.shipment,
            updatedData.transMethod,
            updatedData.expArrivalDate,
            logID,
        ],
        (err, result) => {
            if (err) {
                console.error('Error updating shipment:', err);
                res.status(500).json({ error: 'Failed to update shipment' });
            } else {
                console.log('shipment updated successfully');
                res.status(200).json({ success: true });
            }
        }
    );
});
app.put('/deleteteLogsrowselected/:logID', (req, res) => {
    const logID = req.params.logID;
    const updatedData = req.body;
    const sql = `
      UPDATE trees
      SET
      delete_flg=1
      WHERE
        logID = ?;
    `;
    db.query(
        sql,
        [
            logID,
        ],
        (err, result) => {
            if (err) {
                console.error('Error delete log:', err);
                res.status(500).json({ error: 'Failed to update log' });
            } else {
                console.log('log deleted uccessfully');
                res.status(200).json({ success: true });
            }
        }
    );
});
app.put('/deleteteshipmentrowselected/:logID', (req, res) => {
    const logID = req.params.logID;
    const updatedData = req.body;
    const sql = `
      UPDATE tree_orders
      SET
      deleteflg=1
      WHERE
        logID = ?;
    `;
    db.query(
        sql,
        [
            logID,
        ],
        (err, result) => {
            if (err) {
                console.error('Error delete shipment:', err);
                res.status(500).json({ error: 'Failed to update log' });
            } else {
                console.log('shipment deleted uccessfully');
                res.status(200).json({ success: true });
            }
        }
    );
});

app.delete('/bulkDeletionLogsInformation', (req, res) => {
    const { logIDs } = req.body;
    const query = `UPDATE trees SET delete_flg= 1 WHERE logid IN (${logIDs.join(',')})`;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error during bulk deletion:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Bulk deletion successful');
            res.status(200).json({ success: true });
        }
    });
});
app.delete('/bulkDeletionshipmentInformation', (req, res) => {
    const { logIDs } = req.body;
    const query = `UPDATE tree_orders SET deleteflg=1 WHERE logID IN (${logIDs.join(',')})`;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error during bulk deletion:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Bulk deletion successful');
            res.status(200).json({ success: true });
        }
    });
});
app.post('/shippingRegistration', (req, res) => {
    const {
        shipment,
        shippingDestination,
        contactPerson,
        shippingAddress,
        transportationMethod,
        loadingMethod,
        shippingDate,
        expectedArrivalDate,
        remarks
    } = req.body;

    var sql = `INSERT INTO tree_orders (readSrcID,logID,shipAddress,transMethod,loadMethod,shipDate,expArrivalDate,remarks) VALUES ('1','${shipment}','${shippingAddress}', '${transportationMethod}', '${loadingMethod}', '${shippingDate}', '${expectedArrivalDate}', '${remarks}')`;

    db.query(sql, (err, result) => {
        if (!err) {
            res.status(200).json({ success: "shimpment Inserted Successfully" });
        } else {
            console.log(err);
        }
    });
});

app.post('/arrivalRegistration', (req, res) => {
    const {
        incomingcargo,
        arrivalday,
        receivingcompany,
        storagelocation,
        personalincharge,
        coment,
        quantity,
        remarks
    } = req.body;

    var sql = `INSERT INTO arrival (shipNo, logID,recvCompanyID,recvUserID, quantity, arrivalDay, storageLocation, remarks) VALUES ('2','15','${receivingcompany}','1', '${quantity}', '${arrivalday}', '${storagelocation}', '${remarks}')`;

    db.query(sql, (err, result) => {
        if (!err) {
            res.status(200).json({ success: "Arrivals Inserted Successfully" });
        } else {
            console.log(err);
        }
    });
});

app.post('/productRegistration', (req, res) => {
    const {
        incomingCargoUsed,
        productName,
        quantity,
        manufacturingLocation,
        manufacturingPurpose,
        size,
        shape,
        productionDate,
        strength,
        material,
        productionMethod,
        usedMachine,
        manufacturingManager,
        remarks
    } = req.body;

    var sql = `INSERT INTO products (arrivalID,logID,product_name,qty,manufLocation,manufPurpose,size,shape,production_date,strength,material, machinesUsed,manufaManager,remarks) VALUES ('1','15','${productName}', '${quantity}', '${manufacturingLocation}', '${manufacturingPurpose}', '${size}','${shape}', '${productionDate}', '${strength}', '${material}', '${usedMachine}','${manufacturingManager}','${remarks}')`;


    db.query(sql, (err, result) => {
        if (!err) {
            res.status(200).json({ success: "Log Inserted Successfully" });
        } else {
            console.log(err);
        }
    });
});



app.listen(8081, () => {
    console.log("listening");
})
