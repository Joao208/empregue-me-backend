const {
    Router
  } = require('express')
  const multer = require("multer")
  const multerConfig = require("../../config/multer")
  const Vacancies = require('../models/vacancies')
  const authMiddleware = require('../middlewares/auth')
  const Booking = require('../models/booking')
  const BookingPremium = require('../models/bookingsPremium')
  const User = require('../models/user')
  const router = Router();

  router.use(authMiddleware)

  router.get("/vacancies", async (req, res) => {
    const vacancies = await Vacancies.find().populate('bussines');

    return res.json(vacancies);
  });
  router.get("/my/vacancies", async (req, res) => {
    const vacancies = await Vacancies.find({bussines:req.userId}).populate('bussines');

    return res.json(vacancies);
  });
  router.post("/vacancies", multer(multerConfig).single("avatar"), async (req, res) => {
    try {
      const {
        description,
        salary,
        uf,
        city,
        cargo,
        employment,
        title
    } = req.body
      const {
        location: avatar = ""
      } = req.file
      const bussines = req.userId

      const vacancies = await Vacancies.create({
        description,
        salary,
        uf,
        city,
        cargo,
        employment,
        title,
        bussines,
        avatar
      })
      return res.json(vacancies);
    } catch (e) {
      console.log(e)

      return res.status(400).send({
        error: 'Error in creating new Vacancie'
      })
    }
  });
  router.get("/vacancie/:id", async (req, res) => {
    const jobs = await Vacancies.findById(req.params.id)

    await jobs.populate('bussines').execPopulate()

    return res.send(jobs)
  })
  router.delete("/vacancies/:id", async (req, res) => {
    const vacancies = await Vacancies.findById(req.params.id);

    await vacancies.remove();

    return res.send();
  });
  router.post("/vacancies/:id/booking", async (req, res) => {
    try {
      const user = await User.findById(req.userId)
      const vacancies = req.params.id
      console.log(req.userId)
      console.log(user)
      console.log(user.Premium)

      if(user.Premium){
      booking = await BookingPremium.create({
          vacancies,
          user:user.id
        });
      }
      if(!user.Premium){
      booking = await Booking.create({
          vacancies,
          user:user.id
        });
      }

      await booking.populate('vacancies').populate('bussines').populate('user').execPopulate();

      const ownerSocket = req.connectedUsers[booking.vacancies.bussines];
      console.log(booking.vacancies.bussines)
      if (ownerSocket) {
        req.io.to(ownerSocket).emit('booking_request', booking);
      }

      return res.json(booking);
    } catch (e) {
      console.log(e)
      return res.status(400).send({
        error: 'Erro in create booking'
      })
    }

  })

  module.exports = app => app.use(router)
