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
            casht.creditamount = req.body.creditamount;
            casht.debitamount = req.body.debitamount;

            valueto = 0;
            valueget = 0;
            var flag1 = 0;
            var flag2 = 0;
            var value1 = casht.fromname;
            var value2 = casht.toname;
            var value5 = casht.creditamount;
            var value6 = casht.debitamount;
            var value6int = parseInt(value6);
            var value5int = parseInt(value5);
            var tempn = {};
            var tempc = {};
            var tempd = {};
            if (value5 == 0) {
                amount = value6int;
            } else {
                amount = value5int;
            }

            dbo.collection("trail").find({}).toArray(function (err, result) {
                if (err) throw err;
                for (i = 0; i < result.length; i++) {
                    for (j = 0; j < result[i].name.length; j++) {

                        if (result[i].name[j] == value1) {
                            flag1 = 1;

                            var myorga = {
                                collectionname: "trialbalance",
                            };

                            // accessing credit array in database
                            tempn = result[i].name;
                            tempd = result[i].debit;
                            tempc = result[i].credit;
                            tempcn = result[i].collectionname;
                            console.log(tempc);
                            tempc[j] = value5int + tempc[j];
                            console.log(tempc);

                            mynewa = {
                                collectionname: "trialbalance",
                                name: tempn,
                                debit: tempd,
                                credit: tempc,
                            };

                            dbo.collection("trail").updateOne(myorga, {
                                "$set": mynewa,
                            });

                        }



                        if (result[i].name[j] == value2) {
                            flag2 = 1;

                            var myorgb = {
                                collectionname: "trialbalance",
                            };

                            // accessing credit array in database
                            tempn = result[i].name;
                            tempd = result[i].debit;
                            tempc = result[i].credit;
                            tempcn = result[i].collectionname;
                            console.log(tempd);
                            tempd[j] = value6int + tempd[j];
                            console.log(tempd);

                            mynewabx = {
                                collectionname: "trailbalance",
                                name: tempn,
                                debit: tempd,
                                credit: tempc,
                            };

                            dbo.collection("trail").updateOne(myorgb, {
                                "$set": mynewabx,
                            });

                        }
                    }

                }




                // when new trail name comes
                if (flag2 == 0 && flag1 != 0) {
                    console.log("I am he");
                    var mynewaab = {
                        name: value2,
                        credit: 0,
                        debit: amount,
                    };
                    console.log(flag2);
                    var myorgaab = {
                        collectionname: "trialbalance",
                    };

                    dbo.collection("trail").updateOne(myorgaab, {
                        $push: mynewaab
                    }, {
                        upsert: true
                    });

                } else if (flag1 == 0 && flag2 != 0) {
                    console.log("I am here");
                    var mynewsx = {
                        name: value1,
                        credit: amount,
                        debit: 0,
                    };
                    console.log(flag1);
                    var myorgx = {
                        collectionname: "trialbalance",
                    };

                    dbo.collection("trail").updateOne(myorgx, {
                        $push: mynewx
                    }, {
                        upsert: true
                    });

                } else if (flag2 == 0 && flag1 == 0) {


                    console.log("I am he");
                    var mynewaaby = {
                        name: value2,
                        credit: 0,
                        debit: amount,
                    };
                    console.log(flag2);
                    var myorgaaby = {
                        collectionname: "trialbalance",
                    };

                    dbo.collection("trail").updateOne(myorgaaby, {
                        $push: mynewaaby
                    }, {
                        upsert: true
                    });
                    console.log("I am here");
                    var mynewxy = {
                        name: value1,
                        credit: amount,
                        debit: 0,
                    };
                    console.log(flag1);
                    var myorgxy = {
                        collectionname: "trialbalance",
                    };

                    dbo.collection("trail").updateOne(myorgxy, {
                        $push: mynewxy
                    }, {
                        upsert: true
                    });

                }


            });
            res.send("All set");
        });

    });
// Fire up server
app.listen(port);

// print friendly message to console
console.log("Server listening on port " + port);