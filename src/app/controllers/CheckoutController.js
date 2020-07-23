const {
  Router
} = require('express')
const router = Router()
const authMiddleware = require('../middlewares/auth')
router.use(authMiddleware)

router.post('/create-payment-intent', async (req, res) => {
  const stripe = require("stripe")("sk_test_51H7wkvGHhRYZj7pYmWxDTUBu6LpyAAwn0hVB1lrACKkURVCPZjEb6WCU3q7EEwdWXioaKxSFyLKTxhcWreKwxikM00uekeWZwa");
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 50,
    currency: "brl"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
})

module.exports = app => app.use(router)
