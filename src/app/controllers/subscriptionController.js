const {
  Router
} = require('express')
const router = Router()
const User = require('../models/user')
const authMiddleware = require('../middlewares/auth')
const stripe = require("stripe")("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");
router.use(authMiddleware)

router.post('/subscription/user', async (req, res) => {
  const user = await User.findById(req.userId)
  const customerId = user.customer
  const sessionId = await stripe.checkout.sessions.create({
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

  user.sessionId = sessionId.id

  await user.save()
  res.send({sessionId})
})
module.exports = app => app.use(router)
