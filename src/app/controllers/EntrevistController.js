const Booking = require('../models/booking');
const Notification = require('../models/notification')

module.exports = {
  async store(req, res) {
    const {
      booking_id
    } = req.params;
    const booking = await Booking.findById(booking_id).populate('vacancies');
    booking.approved = true;
    await booking.save();

    const bookingUserSocket = req.connectedUsers[booking.user];

    const notification = await Notification.findOne({user:booking.user}).populate('user').populate('bookings').sort('-createdAt')

    if(!notification)
    return notification = await Notification.create({
      user:booking.user,
    })
    console.log(notification)
    const notificationAlreadyCreated = notification.bookings.some(bookings => bookings == booking.id)

    if (notificationAlreadyCreated) {
      notification.bookings = notification.bookings.filter(bookings => bookings != booking.id)
    } else {
      notification.bookings.push(booking.id)
    }
    notification.save()

    await notification.populate('bookings').populate('user').execPopulate()

    if (bookingUserSocket) {
      req.io.to(bookingUserSocket).emit('booking_response', notification)
    }
    console.log(notification)
    return res.json(booking);
  }
};
