const Ad = require('../models/add')

class LikeController {
  async toggle (req, res, next) {
    try {
      const Add = await Ad.findById(req.params.id)

      if (!Add) {
        return res.status(400).json({ error: 'Add não exist' })
      }
      const liked = Add.likes.indexOf(req.userId)

      if (liked === -1) {
        Add.likes.push(req.userId)
      } else {
        Add.likes.splice(liked, 1)
      }

      await Add.save()
      return res.json(Add)
    } catch (err) {
      return next(err)
    }
  }
}
module.exports = new LikeController()