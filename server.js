var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Details = require('./app/models/cash');
var MongoClient = require("mongodb").MongoClient;

// Configure app for bodyParser()
// lets us grab data from the body of POST
app.use(bodyParser.urlencoded({
  extended: true
}));
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
    app.use('/api', router);

    //MIDDLE WARE-
    router.use(function (req, res, next) {
      console.log('FYI...There is some processing currently going down');
      next();
    });

    // test route
    router.get('/', function (req, res) {
      res.json({
        message: 'Welcome !'
      });
    });

    router.route('/trans')
      .post(function (req, res) {
        var casht = new Details();
        casht.bname = req.body.bname,
          casht.pno = req.body.pno,
          casht.date = req.body.date,
          casht.transactiontype = req.body.transactiontype,
          casht.amount = req.body.amount,

          var myobj = {
            casht.pno,
            casht.pno,
            casht.date,
            casht.transactiontype,
            casht.amount
          }

        dbo.collection("transt").insertOne(myobj, function (err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      })
      .get(function (req, res) {
        Details.find(function (err, details) {
          if (err) {
            res.send(err);
          }
          res.json(details);
        });
      });

    router.route('/cash/pno/:pno')
      .get(function (req, res) {
        Details.find({
          pno: req.params.bname
        }, function (err, detail) {
          if (err) {
            res.send(err);
          }
          res.json(detail.bname);
        });
      });
  });

// Fire up server
app.listen(port);

// print friendly message to console
console.log('Server listening on port ' + port);