const {
    Router
  } = require('express')
  const multer = require("multer")
  const multerConfig = require("../../config/multer")
  const Add = require('../models/add')
  const authMiddleware = require('../middlewares/auth')
  const Bussines = require('../models/bussines')
  const ComentAdd = require('../models/comentAdd')
  const User = require('../models/user')
  const router = Router();
  
  router.use(authMiddleware)
  
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
  router.post("/add", multer(multerConfig).single("avatar"), async (req, res) => {
    try {
      const text = req.body
      const {
        mimetype,
        location: avatar
      } = req.file
      const bussines = req.userId
  
      const add = await Add.create({
          text,
          bussines,
          avatar,
          type:mimetype,
  
        })
        if (add.type === 'video/mp4') {
        add.isVideo = true
        await add.save()
        } else {
        add.isVideo = false
        await add.save()
        }
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
  router.post("/add/coment/:id", async (req, res) => {
    try {
      const post = await Add.findById(req.params.id)
      const user = await User.findById(req.userId)
      const Text = req.body
  
      if (!post) {
        return res.status(400).json({
          error: 'Post não exist'
        })
      }
      if (post.user === req.userId) return res.status(400).send({
        error: "Unable to update post."
      })
  
      const username = user.name
      const avatar = user.avatar
  
      const coments = await ComentAdd.create({
        user,
        post,
        Text,
        avatar,
        username
      })
  
      const postAlreadyLiked = post.comments.some(coment => coment == coments.id)
  
      if (postAlreadyLiked) {
        post.comments = post.comments.filter(coment => coment != coments.id)
        post.set({
          commentCount: post.likeCount - 1
        })
      } else {
        post.comments.push(coments.id)
        post.set({
          commentCount: post.likeCount + 1
        })
      }
  
  
      post.save()
  
      const PostuserSocket = req.connectedUsers[post.user]
  
      const postd = await Add.findById(post._id).populate('bussines').populate('comments').execPopulate()
  
      await post.populate('comments').execPopulate()
  
      return res.json({
        coments,
        post
      })
  
    } catch (e) {
      console.log(e)
      return res.status(400).send({
        error: 'erro in create coment'
      })
    }
  })
  router.post('/likesadd/:id', async (req, res) => {
    try {
      const post = await Add.findById(req.params.id)
  
      if (!post) return res.status(400).send({
        error: "post not found."
      });
  
      if (post.user === req.userId) return res.status(400).send({
        error: "Unable to update post."
      })
  
      const postAlreadyLiked = post.likes.some(like => like == req.userId)
  
      if (postAlreadyLiked) {
        post.likes = post.likes.filter(like => like != req.userId)
        post.set({
          likeCount: post.likeCount - 1
        })
      } else {
        post.likes.push(req.userId)
        post.set({
          likeCount: post.likeCount + 1
        })
      }
  
      post.save()
  
      const PostuserSocket = req.connectedUsers[post.user]
  
      const postd = await Add.findById(post._id).populate('bussines').populate('comments')
      
      if (PostuserSocket) {
        req.io.emit('like', postd)
      }
      res.status(200).send(post)
    } catch (err) {
      return res.status(400).send({
        error: 'Couldnt like this'
      })
    }
  
  })
  router.get('/coments/add/populate/:id', async (req,res) => {
    try {
    const add = await Add.findById(req.params.id).populate('comments').populate('bussines')
      
    res.send(add)
    } catch (error) {
      console.log(error)
    }
  })
  router.post("/bussines/add/coment/:id", async (req, res) => {
    try {
      const post = await Add.findById(req.params.id)
      const user = await Bussines.findById(req.userId)
      const Text = req.body
  
      if (!post) {
        return res.status(400).json({
          error: 'Post não exist'
        })
      }
      if (post.user === req.userId) return res.status(400).send({
        error: "Unable to update post."
      })
  
      const username = user.nome
      const avatar = user.avatar
  
      const coments = await ComentAdd.create({
        user,
        post,
        Text,
        avatar,
        username
      })
  
      const postAlreadyLiked = post.comments.some(coment => coment == coments.id)
  
      if (postAlreadyLiked) {
        post.comments = post.comments.filter(coment => coment != coments.id)
        post.set({
          commentCount: post.likeCount - 1
        })
      } else {
        post.comments.push(coments.id)
        post.set({
          commentCount: post.likeCount + 1
        })
      }
  
  
      post.save()
  
      const PostuserSocket = req.connectedUsers[post.user]
  
      const postd = await post.populate('bussines').populate('comments').execPopulate()
  
      await post.populate('comments').execPopulate()
  
      return res.json({
        coments,
        post
      })
  
    } catch (e) {
      console.log(e)
      return res.status(400).send({
        error: 'erro in create coment'
      })
    }
  })

  module.exports = app => app.use(router)
  