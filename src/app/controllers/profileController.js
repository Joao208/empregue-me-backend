const {
  Router
} = require('express')

const Profile = require('../models/profile')
const Post = require('../models/post')
const Curriculum = require('../models/curriculum')
const authMiddleware = require('../middlewares/auth')
const multer = require("multer")
const multerConfig = require("../../config/multer")
const User = require('../models/user')
const Nexmo = require('nexmo')
const crypto = require('crypto')


const router = Router();

router.use(authMiddleware)

router.post("/curriculum", multer(multerConfig).single("file"), async (req, res) => {
  try {
    const Text = req.body
    const {
      Image,
      location: url = ""
    } = req.file
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

router.post('/profile', multer(multerConfig).single("file"), async (req, res) => {
  try {

    const user = await User.findOne({
      _id: req.userId
    })

    if (!user)
      return res.status(400).send({
        error: 'User not found'
      })

    const {
      location: avatar
    } = req.file

    const {
      FacebookUrl,
      InstagramUrl,
      TwitterUrl,
      YouTubeUrl,
      GithubUrl,
      bio,
    } = req.body

    await Profile.create({
      user
    })

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        avatar,
        FacebookUrl,
        InstagramUrl,
        TwitterUrl,
        YouTubeUrl,
        GithubUrl,
        bio,
      }
    })

    return res.send(user)

  } catch (err) {
    console.log(err)
    res.status(400).send({
      error: 'Error on updte profile, try again'
    })
  }
})

router.get("/profileview", async (req, res) => {
  try {
    const user = (req.userId)
    const post = await Post.find({
      user: user
    }).populate('post')
    const profile = await Profile.find({
      user: user
    }).populate('user').populate('profile')
    const curriculum = await Curriculum.find({
      user: user
    }).populate('curriculum')

    const profileuser = ({
      user,
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

router.delete("/profile/:id", async (req, res) => {
  const profile = await Profile.findById(req.params.id);

  await profile.remove();

  return res.send();
});

module.exports = app => app.use(router)
