const Post = require('../models/postbussines')

class LikeController {
  async toggle (req, res, next) {
    try {
      const Postb = await Post.findById(req.params.id)

      if (!Postb) {
        return res.status(400).json({ error: 'Postb não exist' })
      }
      const liked = Postb.likes.indexOf(req.userId)

      if (liked === -1) {
        Postb.likes.push(req.userId)
      } else {
        Postb.likes.splice(liked, 1)
      }

      await Postb.save()
      return res.json(Postb)
    } catch (err) {
      return next(err)
    }
  }
}
module.exports = new LikeController()