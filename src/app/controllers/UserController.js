const {
  Router
} = require('express')
const authMiddleware = require('../middlewares/auth')
const User = require('../models/user')
const router = Router();
const crypto = require('crypto')
const Nexmo = require('nexmo')

router.use(authMiddleware)

router.get("/user", async (req, res) => {
  const userid = req.userId
  const user = await User.find({
    _id: userid
  });

  return res.send(user);
});
router.post('/user/confirmate/:token', async (req, res) => {
  try {
    const {
      token
    } = req.params
    const user = await User.findOne({
      _id: req.userId
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
router.get('/userregister', async (req, res) => {
  const user = await User.find();

  return res.json({
    user,
    followersCount: user.followers.length,
    followingCount: user.following.length
  });
})
router.post('/addphone', async (req, res) => {
  const {
    phone
  } = req.body

  try {

    const user = await User.findOne({
      _id: req.userId
    })

    if (!user)
      return res.status(400).send({
        error: 'User not found'
      })

    const token = Math.floor(Math.random() * 999999);
    console.log(token)
    const now = new Date();
    now.setHours(now.getHours() + 1)

    await User.findByIdAndUpdate(user.id, {
      '$set': {
        phone: phone,
        phonetoken: token,
        phonetokenexpiress: now,
      }
    })


   const nexmo = new Nexmo({
      apiKey: '7c58d252',
      apiSecret: 'p1k7cHMvzZ1ts1B4',
    });

    const from = 'Empregue.me';
    const to = phone;
    const text = `Seu token Empregue.me: ${token}`;

    await nexmo.message.sendSms(from, to, text, (err, responseData) => {
      if (err) {
        console.log(err);
      } else {
        if (responseData.messages[0]['status'] === "0") {
          console.log("Message sent successfully.");
        } else {
          console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
      }
    })

    return res.send()

  } catch (err) {
    console.log(err)
    res.status(400).send({
      error: 'Error on add phone, try again'
    })
  }

})
router.post('/confirmphone', async (req, res) => {
  const {
    phone,
    token,
  } = req.body

  try {
    const user = await User.findOne({
        phone
      })

    if (!user)
      return res.status(400).send({
        error: 'User does not exist'
      })

    if (token !== user.phonetoken){
      console.log(user.phonetoken)
      console.log(user)
      console.log(token)
      res.status(400).send({
        error: 'Token invalid'
      })
    }
    const now = new Date()

    if (now > user.phonetokenexpiress)
      return res.status(400).send({
        error: 'Token expired, generated a new one'
      })

    user.phoneConfirme = true

    await user.save()

    res.send()
  } catch (err) {
    res.status(400).send({
      error: 'Cannot confirm phone try again'
    })
  }
})
router.post('/user/premiun/create', async (req, res) => {
try {
  const user = await User.findById(req.userId)

  user.Premium = true
  await user.save()

  res.send()

} catch (error) {
  console.log(error)
}
})

module.exports = app => app.use(router)

