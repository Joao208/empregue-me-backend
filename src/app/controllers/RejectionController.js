const Booking = require('../models/booking');
const Notification = require('../models/notification')

module.exports = {
  async store(req, res) {
    const {
      booking_id
    } = req.params;
    const booking = await Booking.findById(booking_id).populate('vacancies');
    booking.approved = false;
    await booking.save();

    const bookingUserSocket = req.connectedUsers[booking.user];

    const notification = Notification.create({
      user:booking.user,
    })

    const notificationAlreadyCreated = notification.bookings.some(bookings => bookings == booking.id)

    if (notificationAlreadyCreated) {
      notification.bookings = notification.bookings.filter(bookings => bookings != booking.id)
    } else {
      notification.bookings.push(booking.id)
    }
    notification.save()

    await notification.populate('vacancies').populate('user').execPopulate()


    if (bookingUserSocket) {
      req.io.to(bookingUserSocket).emit('booking_response', notification);
    }
    return res.json(booking);
  }
};
