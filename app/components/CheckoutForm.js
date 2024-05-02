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
      if (!stripe || !elements) return null;
      elements.submit()

      const { data } = await axios.post("/api/create-payment-intent", {
        data: { amount: servicePrice },
      });
      const clientSecret = data;
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
      };
      console.log(data)
      console.log("Session id: ",session.user?.id)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/bookings`, {
        "data": {
          services: {
            connect: [service]
        },
        zone: {
          connect: [3]
          },
          address: address,
          date: "2024-04-09T22:15:00.000Z",
          payment_intent: clientSecret,
          paymentStatus: "pending",
          users_permissions_user: {
            connect: [session.user?.id]
        }
        }
      },  { headers });
      
      console.log("The booking id is: ", response.data.data)

      const paymentResult = await stripe?.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/successfulbooking?id=${response.data.data.id}&address=${encodeURIComponent(address)}&dateTime=${encodeURIComponent(dateTime)}`,
        },      
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false)
  };

    return (
    <form onSubmit={handleSubmit}>
      <PaymentElement/>
      <p>Price: {servicePrice} eur </p>
      <button disabled={loading} >{loading ? "Processing" : "Pay"}</button>
    </form>
  );

};


export default CheckoutForm;