// components/ClientStripeWrapper.
'use client'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useEffect } from 'react'; // Import useEffect

console.log('Stripe key:', process.env.NEXT_PUBLIC_STRIPE_KEY); // Ensure the key is being read correctly

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
console.log('stripePromise:', stripePromise);

export default function ClientStripeWrapper({ children }) {
  useEffect(() => {
    stripePromise.then((stripe) => {
      console.log('Stripe initialized:', !!stripe);
      console.log('stripePromise:', stripePromise);
    }).catch((error) => {
      console.log('Error initializing Stripe:', error.message);
    });
  }, []);

  return <Elements stripe={stripePromise} options={{
    mode: 'payment',
    currency: 'usd',
    amount: 1099,
  }}>{children}</Elements>;
}
