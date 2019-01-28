var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrialSchema = new Schema({
    collectionname: String,
    name: {
        type: "array"
    },
    debit: {
        type: "array"
    },
    credit: {
        type: "array"
    },
    debitamount: String,
    creditamount: String,
});

module.exports = mongoose.model('Trials', TrialSchema);