const {
  Router
} = require('express')
const router = Router();
const Booking = require('../models/booking')
const authMiddleware = require('../middlewares/auth')
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

module.exports = app => app.use(router)
