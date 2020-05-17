const User = require('../models/user')

class Follow {
  async create(req, res, next) {
    try {
      const user = await User.findById(req.params.id)
      console.log(user)
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

      return res.json(me)
    } catch (err) {
      console.log(err)
      return res.status(400).send({
        error: "Error in follow user"
      })
    }
  }

  /** metodo unfollow */

  async destroy(req, res, next) {
    try {
      const user = await User.findById(req.userId)

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
      me.following.splice(me.following.indexOf(user.id), 1)
      await me.save()

      return res.json(me)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = new Follow()
