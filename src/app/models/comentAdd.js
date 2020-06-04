const mongoose = require("mongoose");

const textSchema = new mongoose.Schema({
  text:{
    type:String
  },
  textd: Number
})

const ComentAddSchema = new mongoose.Schema({
  Text: textSchema,
  username: String,
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  },
})

module.exports = mongoose.model("ComentAdd", ComentAddSchema);
