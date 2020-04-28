const mongoose = require('../../database')

const ProfileBSchema = new mongoose.Schema({
  createdAd: {
    type: Date,
    default: Date.now
  },
  AvatarUrl: String,
  ThumbUrl: String,
  Description: String,
  bussines: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bussines',
    require: true
  },
  adds: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Add',
    require: true
  },
  vacancies: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vacancies',
    require: true
  },

})

const ProfileBuss = mongoose.model('ProfileBuss', ProfileBSchema)

module.exports = ProfileBuss
