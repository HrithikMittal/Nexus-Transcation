var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetailSchema = new Schema({
  bname: String,
  pno: String,
  date: String,
  transactiontype: String,
  amount: String,
});

module.exports = mongoose.model('Details', DetailSchema);