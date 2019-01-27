var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Details = require("./app/models/cash");
var Ledger = require("./app/models/ledger");
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
var port = process.env.PORT || 3002;

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

    router.route("/trans").post(function (req, res) {
      var casht = new Details();
      casht.fromname = req.body.fronname;
      casht.toname = req.body.toname;
      casht.date = req.body.date;
      casht.transmode = req.body.transmode;
      casht.debitamount = req.body.debitamount;
      casht.creditamount = req.body.creditamount;

      var value1 = casht.fromname;
      var value2 = casht.toname;
      var value3 = casht.date;
      var value4 = casht.transmode;
      var value5 = casht.debitamount;
      var value6 = casht.creditamount;

      dbo.collection("journals").insertOne(casht, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
      });

      res.send("Insertion done successfully in journals");

      dbo.collection("journals").find({}).toArray(function (err, result) {
        if (err) throw err;
        var ledgera = new Ledger();
        for (i = 0; i < result.length; i++) {
          if (result[i].transactiontype == casht.transactiontype && result[i].transmode == casht.transmode) {
            var myorg = {
              transactiontype: value1,
              transmode: value2
            }
            var mynew = {
              transactiontype: value1,
              transmode: value2,
              date: value3,
              amount: value4,
              banme: value5,
              pno: value6,
            }
            dbo.collection("journals").updateOne(myorg, {
              $set: mynew
            }, {
              upsert: true
            })
          }
        }
      });
    });
  }
);

// Fire up server
app.listen(port);

// print friendly message to console
console.log("Server listening on port " + port);