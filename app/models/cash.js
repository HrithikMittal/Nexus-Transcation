var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetailSchema = new Schema({
  fromname: String,
  toname: String,
  date: String,
  transmode: String,
  debitamount: String,
  creditamount: String,
});

module.exports = mongoose.model('Details', DetailSchema);