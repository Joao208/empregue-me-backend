const {
    Router
  } = require('express')
  const Notification = require('../models/notification')
  const router = Router();
  const authMiddleware = require('../middlewares/auth')

  router.use(authMiddleware)
  
  router.get('/notifications', async (req,res) => {
    try{
      const notification = await Notification.findOne({user:req.userId}).populate('user').populate('bookings').sort('-createdAt')
  
      return res.send(notification) 
      
    }catch(e){
      console.log(e)
    }
  })

  module.exports = app => app.use(router)
  