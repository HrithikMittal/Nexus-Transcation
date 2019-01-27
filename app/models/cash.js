var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetailSchema = new Schema({
  fromname: String,
  toname: String,
  date: String,
  transmode: String,
  amount: String,
});

module.exports = mongoose.model('Details', DetailSchema);