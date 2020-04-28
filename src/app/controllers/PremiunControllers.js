const Profile = require('../models/profile');

module.exports = {
  async store(req, res) {
    const {
      booking_id
    } = req.params;
    const booking = await Profile.findById(booking_id);
    booking.premiun = true;
    await booking.save();

    const bookingUserSocket = req.connectedUsers[booking .user];

    if (bookingUserSocket) {
      req.io.to(bookingUserSocket).emit('booking_response', booking);
    }
    return res.json(booking);
  }
};
