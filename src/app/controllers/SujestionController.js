const {
    Router
  } = require('express')
  
  const authMiddleware = require('../middlewares/auth')
  const User = require('../models/user')
  const router = Router()
  
  router.use(authMiddleware)
  
  router.get('/sujestions', async (req, res) => {
    const {
      longitude,
      latitude
    } = req.query
  
    const users = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000
        }
      }
    }).limit(5).sort('-createdAt')
  
    res.json(users)
  })
  
  module.exports = app => app.use(router)
  