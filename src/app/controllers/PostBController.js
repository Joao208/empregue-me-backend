const {
    Router
  } = require('express')
  const multer = require("multer")
  const multerConfig = require("../../config/multer")
  const Post = require("../models/post")
  const PostB = require("../models/postbussines")
  const authMiddleware = require('../middlewares/auth')
  const Bussines = require('../models/bussines')
  const ComentB = require('../models/comentspostb')
  const User = require('../models/user')
  const router = Router();
  
  router.use(authMiddleware)
  
  router.post("/postbussines/coment/:id", async (req, res) => {
    try {
      const post = await PostB.findById(req.params.id)
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
  
      const coments = await ComentB.create({
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
      const postd = await PostB.findById(post._id).populate('bussines').populate('comments')
  
      if (PostuserSocket) {
        req.io.emit('like', postd)
      }
  
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
  })
  router.delete("/postsbussines/:id", async (req, res) => {
    const post = await PostB.findById(req.params.id);
  
    await post.remove();
  
    return res.send();
  })
  router.post('/postb/likes/:id', async (req, res) => {
    try {
      const post = await PostB.findById(req.params.id)
  
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
  
      const postd = await PostB.findById(post._id).populate('bussines').populate('comments')
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
  router.post("/postb/share/:id", async (req,res) => {
    try{
      const post = await PostB.findById(req.params.id)
      const user = req.userId
      const avatar = post.avatar
      const text = post.Text
  
      const share = await Post.create({
        user,
        avatar,
        Text:text
      })
  
     return res.send(share)
    }catch(e){
      console.log(e)
      return res.send('error')
    }
  })
  router.post("/bussines/postb/share/:id", async (req,res) => {
    try{
      const post = await PostB.findById(req.params.id)
      const bussines = req.userId
      const avatar = post.avatar
      const text = post.Text
  
      const share = await PostB.create({
        bussines,
        avatar,
        Text:text
      })
  
     return res.send(share)
    }catch(e){
      console.log(e)
      return res.send('error')
    }
  })
  router.post("/bussines/posts", multer(multerConfig).single("avatar"), async (req, res) => {
    try {
      const Text = req.body
      const {
        location: avatar = "",
        mimetype
      } = req.file
      const bussines = req.userId
  
        const post = await PostB.create({
        Text,
        bussines,
        avatar,
        type: mimetype,
      })
  
      if (post.type === 'video/mp4') {
        post.isVideo = true
        await post.save()
      } else {
        post.isVideo = false
        await post.save()
      }
      return res.json(post)
  
    } catch (e) {
      console.log(e)
      return res.status(400).send({
        error: 'Error in creating new post'
      })
    }
  })
  router.get('/coments/postb/populate/:id', async (req,res) => {
    try {
    const postb = await PostB.findById(req.params.id).populate('comments').populate('bussines')
    
    res.send(postb)
    } catch (error) {
      console.log(error)
    }
  })
  router.post("/bussines/postbussines/coment/:id", async (req, res) => {
    try {
      const post = await PostB.findById(req.params.id)
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
  
      const coments = await ComentB.create({
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
      if (PostuserSocket) {
        req.io.emit('like', postd)
      }
  
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
  