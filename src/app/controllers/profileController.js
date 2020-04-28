const {
  Router
} = require('express')

const Profile = require('../models/profile')
const Post = require('../models/post')
const Curriculum = require('../models/curriculum')
const authMiddleware = require('../middlewares/auth')
const multer = require("multer")
const multerConfig = require("../../config/multer")

const router = Router();

router.use(authMiddleware)

router.post("/curriculum", multer(multerConfig).single("file"), async (req, res) => {
  try {
    const Text = req.body
    const {Image,location:url} = req.file
    const user = req.userId

    const curriculum = await Curriculum.create({
      Text,
      Image,
      user,
      url
    })

    return res.json(curriculum)

  } catch (e) {
    console.log(e)
    return res.status(400).send({
      error: 'Error in creating new curriculum'
    })
  } 
}); 

router.post('/profile', async (req, res) => {
  try {
    const user = req.userId
    const {
      FacebookUrl,
      about
    } = req.body

     if (await Profile.findOne({
         user
      }))
    return res.status(400).send({
        error: 'Profile already created'
      })

    const profile = await Profile.create({
      user,
      FacebookUrl,
      about
    })

    return res.send(profile)

  } catch (e) {
    console.log(e)
    return res.status(400).send({
      error: 'Error in create a new profile'
    })
  }
})

router.get("/profile/:id", async (req, res) => {
  try {
    const user = req.params.id
    const post = await Post.find({user:user}).populate('post')
    const curriculum = await Curriculum.find({user:user}).populate('curriculum')

    const profile = await Profile.find({
      user: user
    }).populate('user')

    const profileuser = ({
      post,
      profile,
      curriculum,
    })

    if (profile === null)
      return res.send('User does not have a profile')

    return res.send(profileuser)

  } catch (e) {
    console.log(e)
    return res.status(400).send({
      error: 'Error in find user profile'
    })
  }
})

module.exports = app => app.use(router)
