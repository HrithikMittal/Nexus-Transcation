var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LedgerSchema = new Schema({
    nameledger: String,
    gotoledger: {
        toname: String,
        tomoney: String,
    },
    getfromledger: {
        getname: String,
        getmoney: String,
    },
    balance: String,

});

module.exports = mongoose.model('Ledger', LedgerSchema);