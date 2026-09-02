const stripe = require('stripe')(process.env.STRIPE_KEY);

// line 21 - Stripe idempotency key prevents duplicate charge on retry
async function processPayment(orderId, amount) {
  const idempotencyKey = `${orderId}-${Date.now()}`;
  const intent = await stripe.paymentIntents.create(
    {
      amount: 5000,
      currency: 'inr',
      metadata: { orderId }
    },
    { idempotencyKey }
  );
  return intent;
}

module.exports = { processPayment };
