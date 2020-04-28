const mongoose = require("mongoose");

const CountSchema = new mongoose.Schema({
  LikeCount:Number
})

const LikedSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  Count: CountSchema,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    require: true,
  }

})

module.exports = mongoose.model("Liked", LikedSchema);
