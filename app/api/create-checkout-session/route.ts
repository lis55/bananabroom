import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  typescript: true,
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  const { data } = await req.json();
  try {
    //const stripe = require('stripe')('sk_test_Y17KokhC3SRYCQTLYiU5ZCD2');

   /*  const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Restaurant delivery service',
            },
            unit_amount: 10000,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        transfer_group: 'ORDER100',
      },
      mode: 'setup',
      success_url: 'https://www.google.com',
    }) */
    const session = await stripe.checkout.sessions.create({
      mode: 'setup',
      currency: 'usd',
      customer_creation: 'always',  
      success_url: `${process.env.NEXTAUTH_URL}/successfulbooking?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        bookingData: JSON.stringify(data.bookingData), // Add your booking data here
      },
    });

    return NextResponse.json(session, { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, {
      status: 400,
    });
  }
}