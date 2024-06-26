'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import ReviewForm from './ReviewForm';

const defaultProfilePicture = '/img/default-pic.jpg';

export default function AccountManagement() {
  const { t } = useTranslation('MyAccount');
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const openModal = (booking) => {
    setCurrentBooking(booking);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setCurrentBooking(null);
  };  
console.log("Token BBBBBBBBBBBBB", session)
 
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/bookings?populate[users_permissions_user]=*&populate[services]=*&filters[users_permissions_user][id]=${session?.user.id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        setBookings(result.data.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    if (session?.user) {
      fetchBookings();
    }

  }, [session,bookings]);


  const profilePicture = session?.user?.image || defaultProfilePicture;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row items-start">
          <div className="flex flex-1 flex-col items-center md:items-start md:pr-8 p-4">
            <Image src={session?.user?.image || '/img/default-profile.jpg'} alt="Profile Picture" width={90} height={90} className="rounded-full mb-4 object-cover" />
            <h3 className="text-2xl font-semibold">{session?.user?.name || 'User'}</h3>
            <p className="text-sm text-gray-600">{t('Account management description')}</p>
            <button  onClick={() => router.push('/settings')}>
              {t('Manage Settings')}
            </button>
          </div>
          <div className="flex-1 p-4">
            <h4 className="text-lg font-semibold mb-3">{t('Your bookings')}</h4>
            {bookings.length > 0 ? bookings.map(booking => (
              <div key={booking.id} className="p-2 bg-gray-100 rounded-md shadow-sm mb-2">
                <p>
                  {t(booking.attributes.services.data[0].attributes.type)} {t('on')}   
                  {new Date(booking.attributes.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })} {t('at')}
                  {new Date(booking.attributes.date).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit', hour12: true
                  })}
                </p>
                <button onClick={() => router.push(`/modify-booking/${booking.id}`)}>
                  {t('Modify Booking')}
                </button>
                <button onClick={() => openModal(booking)}>
                  {t('Review Booking')}
                </button>
              </div>
            )) : <p>{t('No bookings')}</p>}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-xl font-bold">&times;</button>
            <ReviewForm booking={currentBooking} closeModal={closeModal} session={session} />
          </div>
        </div>
      )}     
    </div> 
  );

}
