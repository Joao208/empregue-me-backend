const {
    Router
  } = require('express')
  const authMiddleware = require('../middlewares/auth')
  const Class = require('../models/classrom')
  const School = require('../models/school')
  const router = Router();

  router.use(authMiddleware)

  router.get('/school/view', async (req,res) => {
    try{
    const school = await School.findById(req.userId)

    res.send(school)
    }catch{
        console.log('error')
    }
  })

  router.get('/classes/view', async (req,res) => {
      try {
          const classes = Class.find({
              school:req.userId
          }).populate('school')

          res.send(classes)
      } catch (err) {
          console.log(err)
      }
  })

  module.exports = app => app.use(router)
