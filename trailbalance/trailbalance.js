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
            var value3 = casht.date;
            var value4 = casht.transmode;
            var value5 = casht.creditamount;
            var value6 = casht.debitamount;
            var camount = 0;
            var damount = 0;
            var value6int = parseInt(value6);
            var value5int = parseInt(value5);

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

                            if (result[i].credit[j] == 0) {
                                damount = parseInt(result[i].debit[j]);
                                console.log(damount);
                                damount = damount + value6int;
                                console.log(damount);
                                var mynewa = {
                                    "debit": damount,
                                };
                                dbo.collection("trail").updateOne(myorga, {
                                    "$push": mynewa,
                                });
                            }
                            if (result[i].debit[j] == 0) {
                                camount = parseInt(result[i].credit[j]);
                                console.log(camount);
                                camount = camount + value5int;
                                var mynewc = {
                                    "credit": camount,
                                };
                                dbo.collection("trail").updateOne(myorga, {
                                    "$push": mynewc,
                                });
                            }



                            // update exisiting value in the database

                            // dbo.collection("trail").updateOne(myorga, {
                            //     "$set": {
                            //         "debit.j.content": damount
                            //     }
                            // });

                        }

                        if (result[i].name[j] == value2) {
                            flag2 = 1;

                            var myorgab = {
                                collectionname: "trialbalance",
                            };

                            if (result[i].credit[j] == 0) {
                                damount = parseInt(result[i].debit[j]);
                                console.log(damount);
                                damount = damount + value6int;
                                console.log(damount);
                                var mynewab = {
                                    "debit": damount,
                                };
                                dbo.collection("trail").updateOne(myorgab, {
                                    "$push": mynewab,
                                });
                            }
                            if (result[i].debit[j] == 0) {
                                camount = parseInt(result[i].credit[j]);
                                console.log(camount);
                                camount = camount + value5int;
                                var mynewac = {
                                    "credit": camount,
                                };
                                dbo.collection("trail").updateOne(myorgab, {
                                    "$push": mynewac,
                                });
                            }



                            // update exisiting value in the database

                            // dbo.collection("trail").updateOne(myorga, {
                            //     "$set": {
                            //         "debit.j.content": damount
                            //     }
                            // });

                        }
                    }

                }
                // when new trail name comes
                if (flag1 == 0) {
                    if (value5int == 0) {
                        console.log("I am ");
                        var mynew = {
                            name: value1,
                            credit: amount,
                            debit: 0,
                        };
                        console.log(flag1);
                        var myorg = {
                            collectionname: "trialbalance",
                        };

                        dbo.collection("trail").updateOne(myorg, {
                            $push: mynew
                        }, {
                            upsert: true
                        });
                    } else {
                        console.log("I am here");
                        var mynewb = {
                            name: value1,
                            credit: amount,
                            debit: 0,
                        };
                        console.log(flag1);
                        var myorgb = {
                            collectionname: "trialbalance",
                        };

                        dbo.collection("trail").updateOne(myorgb, {
                            $push: mynewb
                        }, {
                            upsert: true
                        });
                    }

                }
                if (flag2 == 0) {
                    if (value6int == 0) {
                        console.log("I am ");
                        var mynewaa = {
                            name: value2,
                            credit: 0,
                            debit: amount,
                        };
                        console.log(flag1);
                        var myorgaa = {
                            collectionname: "trialbalance",
                        };

                        dbo.collection("trail").updateOne(myorgaa, {
                            $push: mynewaa
                        }, {
                            upsert: true
                        });
                    } else {
                        console.log("I am he");
                        var mynewaab = {
                            name: value2,
                            credit: 0,
                            debit: amount,
                        };
                        console.log(flag1);
                        var myorgaab = {
                            collectionname: "trialbalance",
                        };

                        dbo.collection("trail").updateOne(myorgaab, {
                            $push: mynewaab
                        }, {
                            upsert: true
                        });
                    }

                }

            });
            res.send("All set");
        });

    });
// Fire up server
app.listen(port);

// print friendly message to console
console.log("Server listening on port " + port);