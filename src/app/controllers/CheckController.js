const {
    Router
  } = require('express')
  const authMiddleware = require('../middlewares/auth')
  const Check = require('../models/check')
  const router = Router();
  
  router.use(authMiddleware)
  
  router.post("/check/location", async (req,res) => {
    try{
      const {latitude,longitude} = req.body
      const user = req.userId
  
      const check = await Check.create({
        user,
        latitude,
        longitude
      })
  
      return res.send(check)
    }catch(e){
      console.log(e)
      return res.send('error')
    }
  })
  router.post("/bussines/check/location", async(req,res) => {
    try{
      const bussines = req.userId
      const {latitude,longitude} = req.body
  
      const check = await Check.create({
        bussines,
        latitude,
        longitude
      })
  
      res.send(check)
    }catch(e){
      res.send('error')
      console.log(e)
    }
  })

  module.exports = app => app.use(router)
  