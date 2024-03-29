const {
  Router
} = require('express')
const router = Router()
const User = require('../models/user')
const stripe = require("stripe")(process.env.SECURITY_KEY_STRIPE);

router.post('/payment-intent/save_card', async (req, res) => {
  const customerId = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    customer: customerId,
    setup_future_usage: 'off_session',
    amount: 5000,
    currency: "brl"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
})
router.post('/payment-intent/saved_card/:price', async (req, res) => {
  const price = req.params.price * 100
  const customerId = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    customer: customerId,
    setup_future_usage: 'off_session',
    currency: "brl"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
})
router.post('/payment-intent/:price', async (req, res) => {
  const price = req.params.price * 100
  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: "brl"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
})
router.post('/saved_card/intent', async (req, res) => {
  try {
    const customerId = req.body
    // Lookup the payment methods available for the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card"
    });
    // Charge the customer and payment method immediately
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 70,
      currency: "brl",
      customer: customerId,
      payment_method: paymentMethods.data[0].id,
      off_session: true,
      confirm: true
    });
    if (paymentIntent.status === "succeeded") {
      console.log("✅ Successfully charged card off session");
    }
    res.send({
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.log(error)
  }
})
router.post('/payment-intent', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5000,
    currency: "brl"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
})
router.post('/panel/pay/:customerId', async (req, res) => {
  try {
    const customerId = req.params.customerId

    const session = await stripe.billingPortal.sessions.create({
      customer:customerId,
      return_url: 'https://light-empregue-me.herokuapp.com/profile',
    });

    res.send(session)
  } catch (error) {
    console.log(error)
  }
})
router.post('/create_customer/:email', async (req, res) => {
  const email = req.params.email

  const customer = await stripe.customers.create({
    email:email
  });

  res.send(customer)
})

module.exports = app => app.use(router)
