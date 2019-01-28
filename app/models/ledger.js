var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LedgerSchema = new Schema({
    nameledger: String,
    gotoledger: {
        toname: {
            type: "array"
        },
        tomoney: {
            type: "array"
        },
    },
    getfromledger: {
        getname: {
            type: "array"
        },
        getmoney: {
            type: "array"
        },
    },
    balance: String,
    debitamount: String,
    creditamount: String,
});

module.exports = mongoose.model('Ledger', LedgerSchema);