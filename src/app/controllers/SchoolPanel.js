const {
    Router
  } = require('express')
  const multer = require("multer")
  const multerConfig = require("../../config/multer")
  const multerClass = require("../../config/multerclass")
  const authMiddleware = require('../middlewares/auth')
  const User = require('../models/user')
  const Class = require('../models/classrom')
  const router = Router();
  
  router.use(authMiddleware)
  
  

  module.exports = app => app.use(router)
  