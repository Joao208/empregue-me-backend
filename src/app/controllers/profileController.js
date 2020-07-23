const {
  Router
} = require('express')

const Profile = require('../models/profile')
const Post = require('../models/post')
const Curriculum = require('../models/curriculum')
const authMiddleware = require('../middlewares/auth')
const multer = require("multer")
const multerConfig = require("../../config/multerprofile")
const User = require('../models/user')
const Bussines = require('../models/bussines')
const Add = require('../models/add')
const PostB = require('../models/postbussines')
const Vacancies = require('../models/vacancies')
const ProfileB = require('../models/profilebussines')
const router = Router()

router.use(authMiddleware)

router.post('/profile', multer(multerConfig).single("avatar"), async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.userId
    })
    const profile = await Profile.findOne({
      user: user
    })

    if (!user)
      return res.status(400).send({
        error: 'User not found'
      })

    const {
      location: avatar = ""
    } = req.file || {location:user.avatar}

    const {
      FacebookUrl,
      InstagramUrl,
      TwitterUrl,
      YouTubeUrl,
      GithubUrl,
      bio,
      profession
    } = req.body

    if (profile === null) {
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
          profession:profession.split(',').map(tech => tech.trim()),
        }
      })
    } else {
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
    }
    return res.send(user)

  } catch (err) {
    console.log(err)
    res.status(400).send({
      error: 'Error on updte profile, try again'
    })
  }
})
router.post('/profilebussines', multer(multerConfig).single("avatar"), async (req, res) => {
  try {
    const bussines = await Bussines.findOne({
      _id: req.userId
    })
    const profile = await ProfileB.findOne({
      bussines: bussines
    })
    if (!bussines)
      return res.status(400).send({
        error: 'Bussines not found'
      })

    const {
      location: avatar = ""
    } = req.file || {location:bussines.avatar}

    const {
      bio,
      site,
    } = req.body

    if (profile === null) {
      await ProfileB.create({
        bussines,
      })

      await Bussines.findByIdAndUpdate(bussines.id, {
        '$set': {
          avatar,
          bio,
          site,
        }
      })
    } else {
      await Bussines.findByIdAndUpdate(bussines.id, {
        '$set': {
          avatar,
          bio,
          site,
        }
      })

    }
    return res.send(bussines)

  } catch (err) {
    console.log(err)
    res.status(400).send({
      error: 'Error on updte profile, try again'
    })
  }
})
router.get("/profilebussinesv", async (req, res) => {
  try {
    const bussines = await Bussines.findById(req.userId)
    const post = await PostB.find({
      bussines: bussines
    }).sort('-createdAt').populate('post').populate('bussines')
    const profile = await ProfileB.find({
      bussines: bussines
    }).populate('bussines').populate('profile')
    const add = await Add.find({
      bbussines: bussines
    }).populate('add').populate('bussines').sort('-createdAt')
    const vacancies = await Vacancies.find({
      bussines: bussines
    }).populate('vacancies')

    const profileuser = ({
      bussines,
      post,
      profile,
      add,
      vacancies,
      followersCount: bussines.followers.length + bussines.followersbussines.length,
      followingCount: bussines.following.length + bussines.followingbussines.length,
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
router.get("/profilebussinesv/:id", async (req, res) => {
  try {
    const bussines = await Bussines.findById(req.params.id)
    const post = await PostB.find({
      bussines: bussines
    }).sort('-createdAt').populate('post').populate('bussines')
    const profile = await ProfileB.find({
      bussines: bussines
    }).populate('bussines').populate('profile')
    const add = await Add.find({
      bussines: bussines
    }).sort('-createdAt').populate('add').populate('bussines')
    const vacancies = await Vacancies.find({
      bussines: bussines
    }).populate('vacancies')

    const profileuser = ({
      bussines,
      post,
      profile,
      add,
      vacancies,
      followersCount: bussines.followers.length + bussines.followersbussines.length,
      followingCount: bussines.following.length + bussines.followingbussines.length,
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
router.get("/profileview", async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    const post = await Post.find({
      user: user
    }).sort('-createdAt').populate('post').populate('user').populate('comments')
    const profile = await Profile.find({
      user: user
    }).populate('user').populate('profile')
    const curriculum = await Curriculum.find({
      user: user
    }).populate('curriculum')

    if (profile === null)
      return res.send('User does not have a profile')

    return res.json({
      user,
      curriculum,
      post,
      profile,
      followersCount: user.followers.length + user.followersbussines.length,
      followingCount: user.following.length + user.followingbussines.length,
    })

  } catch (e) {
    console.log(e)
    return res.status(400).send({
      error: 'Error in find user profile'
    })
  }
})
router.get("/profileview/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const post = await Post.find({
      user: user
    }).sort('-createdAt').populate('post').populate('user')
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
      followersCount: user.followers.length + user.followersbussines.length,
      followingCount: user.following.length + user.followingbussines.length,
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
