const {
  Router
} = require('express')
const multer = require("multer")
const multerConfig = require("../../config/multer")
const Post = require("../models/post")
const PostB = require("../models/postbussines")
const Add = require('../models/add')
// const Liked = require('./src/app/models/liked')
const Coments = require('../models/coments')
const Vacancies = require('../models/vacancies')
const authMiddleware = require('../middlewares/auth')
const Booking = require('../models/booking')
const User = require('../models/user')

const router = Router();

router.use(authMiddleware)

router.get("/posts", async (req, res) => {
  const user = await User.findById(req.userId)
  const {
    following
  } = user
  const posts = await Post.find({
      user: {
        $in: [user.id, ...following]
      }
    }).populate('user').limit(30)
    .sort('-createdAt')

  const comments = await Coments.find({
    post: posts
  }).populate('post').count()

  return res.json({
    posts,
    comments
  });
});

router.post("/posts", multer(multerConfig).single("avatar"), async (req, res) => {
  try {
    const Text = req.body
    const {
      location: avatar = ""
    } = req.file
    const user = req.userId

    const post = await Post.create({
      Text,
      user,
      avatar
    })

    return res.json(post)

  } catch (e) {
    console.log(e)
    return res.status(400).send({
      error: 'Error in creating new post'
    })
  }
});

router.delete("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  await post.remove();

  return res.send();
});

router.get("/user", async (req, res) => {
  const userid = req.userId
  const user = await User.find({
    _id: userid
  });

  return res.send(user);
});


router.get("/add", async (req, res) => {
  const user = await User.findById(req.userId)
  const {
    following
  } = user
  const adds = await Add.find({
      user: {
        $in: [user.id, ...following]
      }
    }).populate('bussines').limit(3)
    .sort('-createdAt')
  const comments = await Coments.find({
    add: adds
  }).populate('add').count()

  return res.json({
    adds,
    comments
  });
});

router.post("/add", multer(multerConfig).single("file"), async (req, res) => {
  try {
    const text = req.body
    const {
      image,
      location: url
    } = req.file
    const bussines = req.userId

    const add = await Add.create({
      text,
      image,
      bussines,
      url
    });

    return res.json(add);
  } catch (e) {
    console.log(e)
    return res.status(400).send({
      error: 'Error in creating new add'
    })
  }
});

router.delete("/add/:id", async (req, res) => {
  const add = await Add.findById(req.params.id);

  await add.remove();

  return res.send();
});

router.get("/vacancies", async (req, res) => {
  const vacancies = await Vacancies.find().populate('bussines');

  return res.json(vacancies);
});

router.post("/vacancies", multer(multerConfig).single("avatar"), async (req, res) => {
  try {
    const text = req.body
    const {
      location: avatar = ""
    } = req.file
    const bussines = req.userId

    const vacancies = await Vacancies.create({
      text,
      bussines,
      avatar
    })
    return res.json(vacancies);
  } catch (e) {
    console.log(e)

    return res.status(400).send({
      error: 'Error in creating new Vacancie'
    })
  }
});
router.get("/vacancie/:id", async (req, res) => {
  const jobs = await Vacancies.findById(req.params.id)

  await jobs.populate('bussines').execPopulate()

  return res.send(jobs)
})
router.delete("/vacancies/:id", async (req, res) => {
  const vacancies = await Vacancies.findById(req.params.id);

  await vacancies.remove();

  return res.send();
});

router.post("/coment/:id", async (req, res) => {
  const post = req.params.id
  const add = req.params.id
  const postb = req.params.id
  const Text = req.body
  const user = req.userId

  try {
    const coments = await Coments.create({
      post,
      add,
      postb,
      Text,
      user
    })

    await coments.populate('post').populate('add').populate('postb').execPopulate()

    return res.send(coments)

  } catch (e) {
    console.log(e)
  }
})
router.post("/vacancies/:id/booking", async (req, res) => {
  try {
    const user = req.userId
    const vacancies = req.params.id

    const booking = await Booking.create({
      vacancies,
      user
    });

    await booking.populate('vacancies').populate('bussines').populate('user').execPopulate();

    const ownerSocket = req.connectedUsers[booking.user];

    if (ownerSocket) {
      req.io.to(ownerSocket).emit('booking_request', booking);
    }

    return res.json(booking);
  } catch (e) {
    console.log(e)
    return res.status(400).send({
      error: 'Erro in create booking'
    })
  }

})

router.get("/postsbussines", async (req, res) => {
  const user = await User.findById(req.userId)
  const {
    following
  } = user
  const posts = await PostB.find({
      user: {
        $in: [user.id, ...following]
      }
    }).populate('user').limit(30)
    .sort('-createdAt')

  const comments = await Coments.find({
    post: posts
  }).populate('post').count()

  return res.json({
    posts,
    comments
  });
});

router.post("/postsbussines", multer(multerConfig).single("file"), async (req, res) => {
  try {
    const Text = req.body
    const {
      Image,
      location: url
    } = req.file
    const bussines = req.userId

    const post = await Post.create({
      Text,
      Image,
      bussines,
      url
    })

    return res.json(post)

  } catch (e) {
    console.log(e)
    return res.status(400).send({
      error: 'Error in creating new post'
    })
  }
});

router.delete("/postsbussines/:id", async (req, res) => {
  const post = await PostB.findById(req.params.id);

  await post.remove();

  return res.send();
});

module.exports = app => app.use(router)
