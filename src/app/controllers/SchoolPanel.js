const {
    Router
  } = require('express')
  const multer = require("multer")
  const multerConfig = require("../../config/multer")
  const multerClass = require("../../config/multerclass")
  const authMiddleware = require('../middlewares/auth')
  const User = require('../models/user')
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

  router.get()

  module.exports = app => app.use(router)
  