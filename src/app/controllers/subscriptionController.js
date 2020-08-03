const {
  Router
} = require('express')
const router = Router()
const User = require('../models/user')
const authMiddleware = require('../middlewares/auth')
const stripe = require("stripe")(process.env.SECURITY_KEY_STRIPE);
router.use(authMiddleware)

router.post('/subscription/user', async (req, res) => {
  const user = await User.findById(req.userId)
  const customerId = user.customer
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items:[{
      price: 'price_1H9TF0GHhRYZj7pY5ldEUxGq',
      quantity:1,
    }],
    subscription_data:{
      trial_period_days:60,
    },
    mode: 'subscription',
    success_url: `https://light-empregue-me.herokuapp.com/premium/user/${user.id}`,
    cancel_url: 'https://light-empregue-me.herokuapp.com',
    customer: customerId,
  });

  user.sessionId = session.id

  await user.save()
  res.send({
    sessionId: session.id,
  })
})
module.exports = app => app.use(router)
