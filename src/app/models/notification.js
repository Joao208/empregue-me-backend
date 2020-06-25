const mongoose = require('../../database')

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  bookings:[{
      type:mongoose.Schema.ObjectId,
      ref:'Booking'
  }]
})

module.exports = mongoose.model("Notification", NotificationSchema);
