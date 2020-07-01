const {
    Router
  } = require('express')
  const Post = require("../models/post")
  const PostB = require("../models/postbussines")
  const Add = require('../models/add')
  const Vacancies = require('../models/vacancies')
  const authMiddleware = require('../middlewares/auth')
  const Bussines = require('../models/bussines')
  const User = require('../models/user')
  const Check = require('../models/check')
  const router = Router();
  
  router.use(authMiddleware)
  
  router.get("/feed", async (req, res) => {
    try{
    const user = await User.findById(req.userId)
    const {following} = user
    const {followingbussines} = user
    const posts = await Post.find({
        user: {
          $in: [user.id, ...following]
        }
      }).populate('user').populate('comments').limit(30)
      .sort('-createdAt')
      const checkuser = await Check.find({
        user: {
          $in: [user.id, ...following]
        }
      }).populate('user').limit(2)
      .sort('-createdAt')
      const checkbussines = await Check.find({
        bussines: {
          $in: [user.id, ...followingbussines]
        }
      }).populate('bussines').limit(2)
      .sort('-createdAt')
  
    const adds = await Add.find({}).limit(4).sort('-createdAt').populate('bussines').populate('comments')
    const postbussines = await PostB.find({
      bussines:{
        $in:[user.id, ...followingbussines]
      } 
    }).populate('bussines').populate('comments').sort('-createdAt').limit(30)
    const jobs = await Vacancies.find({}).limit(4).sort('-createdAt').populate('bussines')
  
    const feed = ({
      posts,
      checkuser,
      adds,
      postbussines,
      checkbussines,
      jobs
    })
  
    return res.send(feed)
  }catch(error){
    console.log(error)
  }
  })
  router.get("/bussines/feed", async (req, res) => {
    const user = await Bussines.findById(req.userId)
    const {following} = user
    const {followingbussines} = user
    const posts = await Post.find({
        user: {
          $in: [user.id, ...following]
        }
      }).populate('user').populate('comments').limit(30)
      .sort('-createdAt')
      const checkuser = await Check.find({
        user: {
          $in: [user.id, ...following]
        }
      }).populate('user').limit(2)
      .sort('-createdAt')
      const checkbussines = await Check.find({
        bussines: {
          $in: [user.id, ...followingbussines]
        }
      }).populate('bussines').limit(2)
      .sort('-createdAt')
  
    const adds = await Add.find({}).limit(4).sort('-createdAt').populate('bussines').populate('comments')
    const postbussines = await PostB.find({
      bussines:{
        $in:[user.id, ...followingbussines]
      } 
    }).populate('bussines').populate('comments').sort('-createdAt').limit(30)
    const jobs = await Vacancies.find({}).limit(4).sort('-createdAt').populate('bussines')
  
    const feed = ({
      posts,
      checkuser,
      adds,
      postbussines,
      checkbussines,
      jobs
    })
  
    return res.send(feed)
  })

  module.exports = app => app.use(router)
  