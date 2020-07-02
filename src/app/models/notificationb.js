const mongoose = require('../../database')

const NotificationBSchema = new mongoose.Schema({
  bussines: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bussines'
  },
  bookings:[{
      type:mongoose.Schema.ObjectId,
      ref:'Booking'
  }]
})

module.exports = mongoose.model("NotificationB", NotificationBSchema);
