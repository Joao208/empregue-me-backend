const mongoose = require("mongoose");

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
  createdAt:{
    type:Date,
    default:Date.now
  }
})

module.exports = mongoose.model("Check", CheckSchema);
