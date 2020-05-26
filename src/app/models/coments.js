const mongoose = require("mongoose");

const ComentSchema = new mongoose.Schema({
  text: {
    type: {
      type: String
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
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
