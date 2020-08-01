const {
  Router
} = require('express')
const User = require('../models/user')
const router = Router();

router.post('/user/confirmate/:token/:id', async (req, res) => {
  try {
    const {
      token
    } = req.params
    const user = await User.findOne({
      _id: req.params.id
    })
    if (!user)
      return res.status(400).send({
        error: 'User does not exist'
      })

    if (token !== user.usertoken)
      return res.status(400).send({
        error: 'Token invalid'
      })

    const now = new Date()

    if (now > user.usertokenexpiress)
      return res.status(400).send({
        error: 'Token expired, generated a new one'
      })

    user.confirmate = true

    await user.save()

    return res.send(user)
  } catch (error) {
    console.log(error);
  }
})

module.exports = app => app.use(router)

