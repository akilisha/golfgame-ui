import { Stripe } from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const stripe = new Stripe(import.meta.env.VITE_STRIPE_PUB_KEY)

async function createPayment(amount){

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd'
  })

}