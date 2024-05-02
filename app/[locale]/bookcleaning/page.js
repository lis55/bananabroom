"use client";
import ClientStripeWrapper from "../../components/StripeWrapper";
import CheckoutForm from "../../components/CheckoutForm";
import { useSearchParams } from "next/navigation";



export default function Home() {
  const searchParams = useSearchParams();
  // Access specific query parameters
  const address = searchParams.get("address");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const serviceId = searchParams.get("serviceId");
  const dateTime = searchParams.get("dateTime");
  const servicePrice =searchParams.get("servicePrice")


  return (
    // The outer div has been given padding and margin similar to HeroSection for consistency
    <div className="container mx-auto  pt-[200px] sm:pt-[240px]">
      {/* Assuming Navbar and Footer are included elsewhere in your app, they are not shown here */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Content Wrapper */}
          <div>
            <p>Address: {address}</p>
            <p>Date: {date}</p>
            <p>Time: {time}</p>
            <p>Service ID: {serviceId}</p>
            {/* Render other parts of your component here */}
          </div>
          <ClientStripeWrapper>
            <CheckoutForm
              service={serviceId}
              address={address}
              dateTime={dateTime}
              servicePrice={servicePrice}
            />
          </ClientStripeWrapper>
        </div>
      </div>
      {/* Additional content can go here */}
    </div>
  );
}
