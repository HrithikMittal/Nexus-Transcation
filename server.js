var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Details = require("./app/models/cash");
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
      (casht.bname = req.body.bname),
      (casht.pno = req.body.pno),
      (casht.date = req.body.date),
      (casht.transactiontype = req.body.transactiontype),
      (casht.amount = req.body.amount),
      (casht.transmode = req.body.transmode);

      dbo.collection("transt").insertOne(casht, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
  }
);

// Fire up server
app.listen(port);

// print friendly message to console
console.log("Server listening on port " + port);