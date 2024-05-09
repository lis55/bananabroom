'use client'
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const dateTime = searchParams.get("dateTime");
  const id = searchParams.get("id");
  const { data: session } = useSession();

  useEffect(() => {
    const updateBookingStatus = async () => {
      if (!id || !session) return;
      try {
        const token = session.accessToken; // Adjust this according to how the token is stored in your session
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        // Fetch the booking to see the current payment status
        const bookingResponse = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/bookings/${id}`, { headers });
        const booking = bookingResponse.data.data;

        if (booking.paymentStatus !== 'paid') {
          // Update booking status to "paid"
          await axios.put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/bookings/${id}`, {
            data: {
              paymentStatus: 'paid',
              // Additional payment details can be updated here if needed
            }
          }, { headers });
        }
      } catch (error) {
        console.error('Failed to update booking status:', error);
      }
    };
    updateBookingStatus();
  }, [id, session]);

  return (
    <div className="container mx-auto pt-12">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Image src="/img/banana.jpg" alt="Booking Successful" width={700} height ={700} className="h-auto" />
          <h1 className="text-2xl font-semibold text-center mb-6">Booking Successful</h1>
          <h2 className="text-1xl font-semibold text-center mb-6">Congratulations! you are one step closer to an impecable home</h2>
          <div className="space-y-4">
            <p className="text-lg">Booking Id: {id}</p>
            <p className="text-lg">Address: {address}</p>
            <p className="text-lg">Date: {dateTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
