const Bussines = require('../models/bussines')

class Follow {
  async create (req, res, next) {
    const bussines = await Bussines.findById(req.params.id)

    if (!bussines) {
      return res.status(400).json({ error: 'usuario não existe ' })
    }

    if (bussines.followers.indexOf(req.userId) !== -1) {
      return res
        .status(400)
        .json({ error: `você já está seguindo ${bussines.nome}` })
    }
    bussines.followers.push(req.userId)
    await bussines.save()

    /** following */
    const me = await Bussines.findById(req.userId)

    me.following.push(req.userId)
    await me.save()

    return res.json(me)
  }

  /** metodo unfollow */

  async destroy (req, res, next) {
    try {
      const bussines = await Bussines.findById(req.userId)

      if (!bussines) {
        return res.status(400).json({ error: `usuario não existe` })
      }

      const following = bussines.followers.indexOf(req.userId)

      if (following === -1) {
        return res
          .status(400)
          .json({ error: `você não está seguindo ${bussines.nome}` })
      }

      bussines.followers.splice(following, 1)
      await bussines.save()

      const me = await Bussines.findById(req.userId)
      me.following.splice(me.following.indexOf(bussines.id), 1)
      await me.save()

      return res.json(me)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = new Follow()