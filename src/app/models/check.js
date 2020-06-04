const mongoose = require("mongoose");
const PointSchema = require('./utils/PointSchema');

const CheckSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  bussines: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bussines',
    require: true
  },
  latitude:String,
  longitude:String,

})

module.exports = mongoose.model("Check", CheckSchema);
