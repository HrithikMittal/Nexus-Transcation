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
      var ledgera = new Ledger();
      casht.fromname = req.body.fromname;
      casht.toname = req.body.toname;
      casht.date = req.body.date;
      casht.transmode = req.body.transmode;
      casht.creditamount = req.body.creditamount;
      casht.debitamount = req.body.debitamount;
      casht.amount = req.body.creditamount;
      flag = 0;
      flagagain = 0;
      step1 = 0;
      step2 = 0;
      step3 = 0;
      step4 = 0;
      var value1 = casht.fromname;
      var value2 = casht.toname;
      var value3 = casht.date;
      var value4 = casht.transmode;
      var value5 = casht.creditamount;
      var value6 = casht.debitamount;
      var setamountintial = parseInt(value5);
      // insertion in the database of jounal
      dbo.collection("journals").insertOne(casht, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
      });

      res.send("Insertion done successfully in journals");

      // insertion in the database of ledger
      dbo
        .collection("ledger")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;
          var valueto = 0;

          // "to" from the ledger
          for (i = 0; i < result.length; i++) {
            if (result[i].nameledger == casht.fromname) {
              for (k = 0; k < result[i].gotoledger.tomoney.length; k++) {
                valueto = valueto + parseInt(result[i].gotoledger.tomoney[k]);
              }


              console.log(valueto);
              if (isNaN(result[i].creditamount) == true) {
                // result[i].creditamount = valueto;
                setamount = setamountintial;
                console.log("I am NaN");
              } else {
                // result[i].creditamount =
                //   parseInt(result[i].creditamount) + valueto;
                setamount = setamountintial + parseInt(result[i].creditamount);
                console.log("I am not NaN");
              }

              console.log(setamount);

              var valuefl1 = result[i].nameledger;
              var myorg = {
                nameledger: valuefl1
              };
              var mynew = {
                "gotoledger.toname": value2,
                "gotoledger.tomoney": value5
              };
              dbo.collection("ledger").updateOne(
                myorg, {
                  $push: mynew
                }, {
                  upsert: true
                }
              );
              dbo.collection("ledger").updateOne(myorg, {
                $set: {
                  creditamount: setamount
                }
              });
              console.log("Everything is cool!!!");
              flag = 1;
              break;
            }
          }

          // if ledger do not present previsouly
          if (flag == 0) {
            console.log("Everything works fine....");
            ledgera.nameledger = value1;
            ledgera.gotoledger.toname = value2;
            ledgera.gotoledger.tomoney = value5;
            ledgera.creditamount = value5;
            dbo.collection("ledger").insertOne(ledgera, function (err, res) {
              if (err) throw err;
              console.log("1 document inserted");
            });
            var valuefl2 = value1;
            var myorga = {
              nameledger: valuefl2
            };
            dbo.collection("ledger").updateOne(myorga, {
              $set: {
                creditamount: setamountintial
              }
            });
          }
        });
    });
  }
);

// Fire up server
app.listen(port);

// print friendly message to console
console.log("Server listening on port " + port);