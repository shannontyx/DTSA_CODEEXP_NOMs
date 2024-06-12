const express = require('express');
const router = express.Router();
const stripe = require('stripe')(
  'sk_test_51PQluUJWme9UJ0mvLvNS9wqwEWT2ChIdhiGWzVDsY4RWOORAVoQVQ85PP8FaUUIL4rgFJEYwWWlefZf1jlQTFUbW00CmaSw1oU'
);

// router endpoints
router.post('/intent', async (req, res) => {
  try {
    // create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount, 
      currency: 'sgd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    // Return the secret
    res.json({ paymentIntent: paymentIntent.client_secret });
    console.log(res)
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

module.exports = router;