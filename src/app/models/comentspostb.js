const mongoose = require('../../database')

const textSchema = new mongoose.Schema({
  text:{
    type:String
  },
  textd: Number
})

const ComentBSchema = new mongoose.Schema({
  Text: textSchema,
  username: String,
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Postb'
  },
})

module.exports = mongoose.model("Comentb", ComentBSchema);
