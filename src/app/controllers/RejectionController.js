const Booking = require('../models/booking');

module.exports = {
  async store(req, res) {
    const {
      booking_id
    } = req.params;
    const booking = await Booking.findById(booking_id).populate('vacancies');
    booking.approved = false;
    await booking.save();

    const bookingUserSocket = req.connectedUsers[booking.user];

    if (bookingUserSocket) {
      req.io.to(bookingUserSocket).emit('booking_response', booking);
    }
    return res.json(booking);
  }
};
