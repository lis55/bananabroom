'use client'
import { useState } from 'react';
import { CardElement, useStripe, useElements,PaymentElement } from '@stripe/react-stripe-js';
import { useSession } from "next-auth/react";
import axios from "axios";
import { parseISO, format } from 'date-fns';
// Load your publishable key from your environment variables


const CheckoutForm = ({service,address,dateTime,servicePrice}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { data: session } = useSession();
  const strapiTime = parseISO(String(dateTime));
  const [loading, setLoading] = useState(false);
  console.log("Session :",session)
  console.log("Time: ", strapiTime)
  console.log("Time before: ", dateTime)
  console.log('Stripe initialized:', !!stripe);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('/api/create-checkout-session', {
        bookingData: {
          user: session.user.email,
          service,
          address,
          dateTime: strapiTime,
          servicePrice,
        }
      });

      window.location.href = data.url;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

    return (
    <form onSubmit={handleSubmit}>
      <p>You can only cancel or reschedule your booking upto 3 days before the booking date. You will be charged the following amount 3 days before the booking date. </p>
      <p>Price: {servicePrice} eur </p>
      <button disabled={loading} >{loading ? "Processing" : "Pay"}</button>
    </form>
  );

};


export default CheckoutForm;