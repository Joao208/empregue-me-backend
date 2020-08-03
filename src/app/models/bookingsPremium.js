const mongoose = require('mongoose');

const BookingPremiunSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  vacancies: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vacancies'
  },
  approved:Boolean
});

module.exports = mongoose.model('BookingPremiun', BookingPremiunSchema);
