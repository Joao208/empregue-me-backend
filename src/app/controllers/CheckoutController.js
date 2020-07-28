const {
  Router
} = require('express')
const router = Router()
const authMiddleware = require('../middlewares/auth');
const Bussines = require('../models/bussines');
const stripe = require("stripe")("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");
router.use(authMiddleware)

router.post('/payment-intent', async (req, res) => {
  const costumerId = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    customer: costumerId,
    setup_future_usage: 'off_session',
    amount: 70,
    currency: "brl"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
})
router.post('/payment-intent/saved_card/:price', async (req, res) => {
  const price = req.params.price * 100
  const costumerId = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    customer: costumerId,
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
router.post('/subscription/user', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: 'price_1H9TF0GHhRYZj7pY5ldEUxGq',
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: 'https://light-empregue-me.herokuapp.com/profile',
    cancel_url: 'https://light-empregue-me.herokuapp.com',
  });

  res.send(session)
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
router.post('/payment-intent/no/save_card', async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 70,
    currency: "brl"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
})
router.post('/panel/pay', async (req, res) => {
  try {
    const costumerId = req.body

    var session = await stripe.billingPortal.sessions.create({
      customer: costumerId,
      return_url: 'https://light-empregue-me.herokuapp.com/profile',
    });

    res.send(session)
  } catch (error) {
    console.log(error)
  }
})
router.post('/create_customer', async (req, res) => {
  const customer = await stripe.customers.create();

  res.send(customer)
})
module.exports = app => app.use(router)
