const mongoose = require("mongoose");

const TextSchema = new mongoose.Schema({
  Text:String
})

const CountSchema = new mongoose.Schema({
  count:Number
})

const ComentsSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  Text: TextSchema,
  Count:CountSchema,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  add: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Add',
  },
  postb: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Postb',
  },


})

module.exports = mongoose.model("Coments", ComentsSchema);
