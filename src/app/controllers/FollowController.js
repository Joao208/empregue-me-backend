const {
    Router
  } = require('express')
  
  const Profile = require('../models/profile')
  const authMiddleware = require('../middlewares/auth')
  const User = require('../models/user')
  const Bussines = require('../models/bussines')
  const ProfileB = require('../models/profilebussines')
  const router = Router()
  
  router.use(authMiddleware)
  
  router.post("/follow/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      const profile1 = await Profile.findOne({
        user: req.params.id
      }).populate('user').populate('profile')
      const profile2 = await Profile.findOne({
        user: req.userId
      }).populate('user').populate('profile')
  
      if (!user) {
        return res.status(400).json({
          error: 'usuario não existe '
        })
      }
  
      if (user.followers.indexOf(req.userId) !== -1) {
        return res
          .status(400)
          .json({
            error: `você já está seguindo ${user.name}`
          })
      }
      user.followers.push(req.userId)
      await user.save()
  
      /** following */
      const me = await User.findById(req.userId)
  
      me.following.push(req.userId)
      await me.save()
  
      const FolowUserSocket = req.connectedUsers[user.user];
  
      if (FolowUserSocket) {
        req.io.emit('follow_you', profile1);
        req.io.emit('follow_me', profile2)
      }
  
      return res.json(me)
    } catch (err) {
      console.log(err)
      return res.status(400).send({
        error: "Error in follow user"
      })
    }
  })
  router.delete("/unfollow/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      const profile1 = await Profile.findOne({
        user: req.params.id
      }).populate('user').populate('profile')
      const profile2 = await Profile.findOne({
        user: req.userId
      }).populate('user').populate('profile')
      if (!user) {
        return res.status(400).json({
          error: `usuario não existe`
        })
      }
  
      const following = user.followers.indexOf(req.userId)
  
      if (following === -1) {
        return res
          .status(400)
          .json({
            error: `você não está seguindo ${user.name}`
          })
      }
  
      user.followers.splice(following, 1)
      await user.save()
  
      const me = await User.findById(req.userId)
      console.log(me)
      me.following.splice(me.following.indexOf(user.id), 1)
      await me.save()
  
      const FolowUserSocket = req.connectedUsers[user.user];
  
      if (FolowUserSocket) {
        req.io.emit('follow_you', profile1);
        req.io.emit('follow_me', profile2)
      }
  
      return res.json(me)
    } catch (err) {
      return res.send(err)
    }
  })
  router.post("/user/followb/:id", async (req, res) => {
    try {
      const user = await Bussines.findById(req.params.id)
      const profile1 = await ProfileB.findOne({
        bussines: req.params.id
      }).populate('bussines').populate('profile')
      const profile2 = await Profile.findOne({
        user: req.userId
      }).populate('user').populate('profile')
  
      if (!user) {
        return res.status(400).json({
          error: 'usuario não existe '
        })
      }
  
      if (user.followers.indexOf(req.userId) !== -1) {
        return res
          .status(400)
          .json({
            error: `você já está seguindo ${user.name}`
          })
      }
      user.followers.push(req.userId)
      await user.save()
  
      /** following */
      const me = await User.findById(req.userId)
  
      me.followingbussines.push(req.userId)
      await me.save()
  
      const FolowUserSocket = req.connectedUsers[user.user];
  
      if (FolowUserSocket) {
        req.io.emit('follow_you', profile1);
        req.io.emit('follow_me', profile2)
      }
  
      return res.json(me)
    } catch (err) {
      console.log(err)
      return res.status(400).send({
        error: "Error in follow user"
      })
    }
  })
  router.delete("/user/unfollowb/:id", async (req, res) => {
    try {
      const user = await Bussines.findById(req.params.id)
      const profile1 = await ProfileB.findOne({
        bussines: req.params.id
      }).populate('bussines').populate('profile')
      const profile2 = await Profile.findOne({
        user: req.userId
      }).populate('user').populate('profile')
      if (!user) {
        return res.status(400).json({
          error: `usuario não existe`
        })
      }
  
      const following = user.followers.indexOf(req.userId)
  
      if (following === -1) {
        return res
          .status(400)
          .json({
            error: `você não está seguindo ${user.name}`
          })
      }
  
      user.followers.splice(following, 1)
      await user.save()
  
      const me = await User.findById(req.userId)
  
      me.followingbussines.splice(me.followingbussines.indexOf(user.id), 1)
      await me.save()
  
      const FolowUserSocket = req.connectedUsers[user.user];
  
      if (FolowUserSocket) {
        req.io.emit('follow_you', profile1)
        req.io.emit('follow_me', profile2)
      }
  
      return res.json(me)
    } catch (err) {
      return res.send(err)
    }
  })
  router.post("/bussines/followb/:id", async (req, res) => {
    try {
      const user = await Bussines.findById(req.params.id)
      const profile1 = await ProfileB.findOne({
        bussines: req.params.id
      }).populate('bussines').populate('profile')
      const profile2 = await ProfileB.findOne({
        bussines: req.userId
      }).populate('bussines').populate('profile')
  
      if (!user) {
        return res.status(400).json({
          error: 'usuario não existe '
        })
      }
  
      if (user.followers.indexOf(req.userId) !== -1) {
        return res
          .status(400)
          .json({
            error: `você já está seguindo ${user.name}`
          })
      }
      user.followers.push(req.userId)
      await user.save()
  
      /** following */
      const me = await Bussines.findById(req.userId)
  
      me.followingbussines.push(req.userId)
      await me.save()
  
      const FolowUserSocket = req.connectedUsers[user.user];
  
      if (FolowUserSocket) {
        req.io.emit('follow_you', profile1);
        req.io.emit('follow_me', profile2)
      }
  
      return res.json(me)
    } catch (err) {
      console.log(err)
      return res.status(400).send({
        error: "Error in follow user"
      })
    }
  })
  router.delete("/bussines/unfollowb/:id", async (req, res) => {
    try {
      const user = await Bussines.findById(req.params.id)
      const profile1 = await ProfileB.findOne({
        bussines: req.params.id
      }).populate('bussines').populate('profile')
      const profile2 = await ProfileB.findOne({
        bussines: req.userId
      }).populate('bussines').populate('profile')
      if (!user) {
        return res.status(400).json({
          error: `usuario não existe`
        })
      }
  
      const following = user.followers.indexOf(req.userId)
  
      if (following === -1) {
        return res
          .status(400)
          .json({
            error: `você não está seguindo ${user.name}`
          })
      }
  
      user.followers.splice(following, 1)
      await user.save()
  
      const me = await Bussines.findById(req.userId)
  
      me.followingbussines.splice(me.followingbussines.indexOf(user.id), 1)
      await me.save()
  
      const FolowUserSocket = req.connectedUsers[user.user];
  
      if (FolowUserSocket) {
        req.io.emit('follow_you', profile1);
        req.io.emit('follow_me', profile2)
      }
  
      return res.json(me)
    } catch (err) {
      return res.send(err)
    }
  })
  router.post("/bussines/follow/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      const profile1 = await Profile.findOne({
        user: req.params.id
      }).populate('user').populate('profile')
      const profile2 = await ProfileB.findOne({
        bussines: req.userId
      }).populate('bussines').populate('profile')
  
      if (!user) {
        return res.status(400).json({
          error: 'usuario não existe '
        })
      }
  
      if (user.followers.indexOf(req.userId) !== -1) {
        return res
          .status(400)
          .json({
            error: `você já está seguindo ${user.name}`
          })
      }
      user.followers.push(req.userId)
      await user.save()
  
      /** following */
      const me = await Bussines.findById(req.userId)
  
      me.following.push(req.userId)
      await me.save()
  
      const FolowUserSocket = req.connectedUsers[user.user];
  
      if (FolowUserSocket) {
        req.io.emit('follow_you', profile1);
        req.io.emit('follow_me', profile2)
      }
  
      return res.json(me)
    } catch (err) {
      console.log(err)
      return res.status(400).send({
        error: "Error in follow user"
      })
    }
  })
  router.delete("/bussines/unfollow/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      const profile1 = await Profile.findOne({
        user: req.params.id
      }).populate('user').populate('profile')
      const profile2 = await ProfileB.findOne({
        bussines: req.userId
      }).populate('bussines').populate('profile')
      if (!user) {
        return res.status(400).json({
          error: `usuario não existe`
        })
      }
  
      const following = user.followers.indexOf(req.userId)
  
      if (following === -1) {
        return res
          .status(400)
          .json({
            error: `você não está seguindo ${user.name}`
          })
      }
  
      user.followers.splice(following, 1)
      await user.save()
  
      const me = await Bussines.findById(req.userId)
      console.log(me)
      me.following.splice(me.following.indexOf(user.id), 1)
      await me.save()
  
      const FolowUserSocket = req.connectedUsers[user.user];
  
      if (FolowUserSocket) {
        req.io.emit('follow_you', profile1);
        req.io.emit('follow_me', profile2)
      }
  
      return res.json(me)
    } catch (err) {
      return res.send(err)
    }
  })
  router.get('/followed/:id', async (req,res) => {
    try{
    const user = await User.findById(req.params.id)
    const followed = true
  
    if (user.followers.indexOf(req.userId) !== -1) {
      return res.send({
        followed
      })
    }
  
    return res.send()
    }catch(error){
      return console.log(error)
    }
  })
  router.get('/followedb/:id', async (req,res) => {
    try{
    const user = await Bussines.findById(req.params.id)
    const followed = true
  
    if (user.followers.indexOf(req.userId) !== -1) {
      return res.send({
        followed
      })
    }
  
    return res.send()
    }catch(error){
      return console.log(error)
    }
  })
  
  module.exports = app => app.use(router)
  