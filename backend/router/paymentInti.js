const express= require('express');
const prisma = require('../utils/prisma');
const router = express.Router();
const stripe = require('stripe')
(process.env.STRIPE_SECRATE_KEY);
const verificatio = require('../middle-wear/verification');
const roleAuthriz = require('../middle-wear/roleAuthriz');
const bodyParser = require('body-parser');







//Stipe-intigration
router.post('/create-checkout-session',verificatio,roleAuthriz('USER'), async (req, res) => {
 
 

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'php',
            product_data: {
              name: 'Premium Access'
            },
            unit_amount: 10000
            
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: req.user?.id?.toString() || '0',
      },
      mode: 'payment',
      success_url: 'http://localhost:5173/home/paymentsuccess',
      cancel_url: 'http://localhost:5173/home/paymentfaild',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Session Error:', err.message);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
});


//WEBHOOK STRIP
router.post('/webhook',bodyParser.raw({type:'application/json'}), async (req, res) => {

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = Number(session.metadata.userId);

    if (!userId) {
      return res.status(400).send("Invalid user ID in metadata.");
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { isPremium: true },
      });

      console.log('✅ Premium user upgraded:', userId);
    } catch (err) {
      console.error('❌ Failed to update user:', err.message);
    }
  }

  res.json({ received: true });
});



module.exports=router