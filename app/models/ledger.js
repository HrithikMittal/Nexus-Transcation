var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LedgerSchema = new Schema({
    name: String,
    toname: String,

    debitamount: String,
    creditamount: String,
});

module.exports = mongoose.model('Ledger', LedgerSchema);