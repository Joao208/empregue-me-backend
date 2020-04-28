const mongoose = require('../../database')

const ProfileSchema = new mongoose.Schema({
  Curriculum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curriculum'
  },
  Evolution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evolution'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  createdAd: {
    type: Date,
    default: Date.now
  },
  FacebookUrl:{
    type:String
  },
  about:{
    type:String,
  },
  premiun:Boolean

})

const Profile = mongoose.model('Profile', ProfileSchema)

module.exports = Profile
