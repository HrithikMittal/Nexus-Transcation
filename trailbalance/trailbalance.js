var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Details = require("../app/models/cash");
var Ledger = require("../app/models/ledger");
var Trails = require("./models/casha");
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
var port = process.env.PORT || 3004;

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
            var trail = new Trails();

            casht.fromname = req.body.fromname;
            casht.toname = req.body.toname;
            casht.date = req.body.date;
            casht.transmode = req.body.transmode;
            casht.amount = req.body.amount;

            valueto = 0;
            valueget = 0;
            var value1 = casht.fromname;
            var value2 = casht.toname;
            var value3 = casht.date;
            var value4 = casht.transmode;
            var value5 = casht.amount;

            dbo.collection("ledger").find({}).toArray(function (err, result) {
                if (err) throw err;
                for (i = 0; i < result.length; i++) {
                    if (result[i].nameledger == value1) {
                        for (j = 0; j < result[i].gotoledger.tomoney.length; j++) {
                            valueto = valueto + parseInt(result[i].gotoledger.tomoney[j]);
                        }
                        for (j = 0; j < result[i].getfromledger.getmoney.length; j++) {
                            valueget = valueget + parseInt(result[i].getfromledger.getmoney[j]);
                        }
                    }
                }
            });
        });
    });
// Fire up server
app.listen(port);

// print friendly message to console
console.log("Server listening on port " + port);