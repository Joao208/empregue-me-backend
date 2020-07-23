const {
  Router
} = require('express')
const router = Router()
const authMiddleware = require('../middlewares/auth')
const stripe = require("stripe")(process.env.SECURITY_KEY_STRIPE);
router.use(authMiddleware)

router.post('/create-payment-intent', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 500,
    currency: "brl"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
})

module.exports = app => app.use(router)
