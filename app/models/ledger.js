var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LedgerSchema = new Schema({
    nameledger: String,
    toamount: String,
    getamount: String,
    balance: String,
});

module.exports = mongoose.model('Ledger', LedgerSchema);