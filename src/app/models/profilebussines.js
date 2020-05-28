const mongoose = require('../../database')

const ProfileBSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
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
  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Postb',
    require: true
  },


})

const ProfileBuss = mongoose.model('ProfileBuss', ProfileBSchema)

module.exports = ProfileBuss
