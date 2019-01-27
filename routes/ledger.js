var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Details = require("../app/models/cash");
var Ledger = require("../app/models/ledger");
var MongoClient = require("mongodb").MongoClient;


// Configure app for bodyParser()
// lets us grab data from the body of POST
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

// Set up port for server to listen on
var port = process.env.PORT || 3003;

// Connect to DB
var url = "mongodb://localhost:27017/transaction";

MongoClient.connect(
    url,
    (err, db) => {
        const dbo = db.db("trans");
        //API Routes
        var router = express.Router();

        // Routes will all be prefixed with /API
        app.use("/api", router);

        //MIDDLE WARE-
        router.use(function (req, res, next) {
            console.log("FYI...There is some processing currently going down");
            next();
        });

        // test route
        router.get("/", function (req, res) {
            res.json({
                message: "Welcome !"
            });
        });


        // code for ledger
        router.route("/trans").post(function (req, res) {
            var casht = new Details();
            var ledgera = new Ledger();
            casht.fromname = req.body.fromname;
            casht.toname = req.body.toname;
            casht.date = req.body.date;
            casht.transmode = req.body.transmode;
            casht.debitamount = req.body.debitamount;
            casht.creditamount = req.body.creditamount;

            flag = 0;
            flagagain = 0;
            var value1 = casht.fromname;
            var value2 = casht.toname;
            var value3 = casht.date;
            var value4 = casht.transmode;
            var value5 = casht.debitamount;
            var value6 = casht.creditamount;

            dbo.collection("ledger").find({}).toArray(function (err, result) {
                if (err) throw err;
                // "by" from the ledger
                for (i = 0; i < result.length; i++) {
                    if (result[i].nameledger == value2) {

                        var valuefl2 = result[i].nameledger;
                        var myorgagain = {
                            nameledger: valuefl2,
                        };
                        var mynewagain = {
                            "getfromledger.getname": value1,
                            "getfromledger.getmoney": value5,
                        };
                        dbo.collection("ledger").updateOne(myorgagain, {
                            $push: mynewagain
                        }, {
                            upsert: true
                        });
                        console.log("Everything is cool!!!");
                        flagagain = 1;
                        break;
                    }

                }
                if (flagagain == 0) {
                    console.log("Everything works fines ... ");
                    ledgera.nameledger = value2;
                    ledgera.getfromledger.getname = value1;
                    ledgera.getfromledger.getmoney = value5;

                    dbo.collection("ledger").insertOne(ledgera, function (err, res) {
                        if (err) throw err;
                        console.log("1 document insert");
                    });

                }
            });

            res.send("Yo");
        });
    });
// Fire up server
app.listen(port);

// print friendly message to console
console.log("Server listening on port " + port);