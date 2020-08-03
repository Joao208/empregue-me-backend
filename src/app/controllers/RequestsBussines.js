const {
  Router
} = require('express')
const router = Router();
const Booking = require('../models/booking')
const authMiddleware = require('../middlewares/auth')
const BookingPremium = require('../models/bookingsPremium')
const Vacancies = require('../models/vacancies')
router.use(authMiddleware)

router.get('/bussines/requests', async (req,res) => {
  try{
    const vacancies = await Vacancies.find({bussines:req.userId})
    const booking = await Booking.find({vacancies:vacancies}).populate('user').populate('vacancies')

    res.send(booking)
  }catch(e){
    console.log(e)
  }
})
router.get('/bussines/requests/premium', async (req, res) => {
  try {
    const vacancies = await Vacancies.find({bussines:req.userId})
    const booking = await BookingPremium.find({vacancies:vacancies}).populate('user').populate('vacancies')

    res.send(booking)
  } catch (error) {
    console.log(error)
  }
})

module.exports = app => app.use(router)
