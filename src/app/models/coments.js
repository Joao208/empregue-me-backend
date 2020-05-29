const mongoose = require("mongoose");

const ComentSchema = new mongoose.Schema({
  text: {
    type: {
      type: String
    }
  },
  username:String,
  avatar:String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post'
  },
})

module.exports = mongoose.model("Coment", ComentSchema);
