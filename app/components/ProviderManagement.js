'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import ReviewForm from './ReviewForm';

const defaultProfilePicture = '/img/default-pic.jpg';

export default function ProviderManagement() {
  const { t } = useTranslation('MyAccount');
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  const openModal = (booking) => {
    setCurrentBooking(booking);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setCurrentBooking(null);
  };

  const openConfirmModal = (booking) => {
    setCurrentBooking(booking);
    setShowConfirmModal(true);
  };
  
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setCurrentBooking(null);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/bookings?populate[users_permissions_user]=*&populate[services]=*&populate[service_provider]=*&populate[zone]=*`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        const availableBookings = result.data.data.filter(booking => {
          const serviceProvider = booking.attributes.service_provider?.data;
          const zoneCity = booking.attributes.zone?.data?.attributes?.City;
          return serviceProvider === null && zoneCity === session.user.service_provider.city;
        });

        const acceptedBookings = result.data.data.filter(booking => {
          const serviceProvider = booking.attributes.service_provider?.data;
          return serviceProvider && serviceProvider.id === session.user.service_provider.id;
        });

        setBookings(availableBookings);
        setAcceptedBookings(acceptedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    if (session?.user) {
      fetchBookings();
    }

  }, [session]);

  const acceptJob = async () => {
    if (!currentBooking) return;
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/bookings/${currentBooking.id}`, 
        {
          data: {
            service_provider: {connect: [session.user.service_provider.id]}
          }
        }, 
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );
      // Refresh the bookings after accepting a job
      const updatedBookings = bookings.map(booking => {
        if (booking.id === currentBooking.id) {
          return {
            ...booking,
            attributes: {
              ...booking.attributes,
              service_provider: {
                data: {
                  id: session.user.service_provider.id,
                  attributes: {
                    username: session.user.name
                  }
                }
              }
            }
          };
        }
        return booking;
      });

      const newAcceptedBooking = updatedBookings.find(booking => booking.id === currentBooking.id);
      setBookings(updatedBookings.filter(booking => booking.id !== currentBooking.id));
      setAcceptedBookings([...acceptedBookings, newAcceptedBooking]);
      closeConfirmModal();
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  };

  const profilePicture = session?.user?.image || defaultProfilePicture;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row items-start">
          <div className="flex flex-1 flex-col items-center md:items-start md:pr-8 p-4">
            <Image src={session?.user?.image || '/img/default-profile.jpg'} alt="Profile Picture" width={90} height={90} className="rounded-full mb-4 object-cover" />
            <h3 className="text-2xl font-semibold">{session?.user?.name || 'User'}</h3>
            <p className="text-sm text-gray-600">{t('Account management description')}</p>
            <button onClick={() => router.push('/settings')}>
              {t('Manage Settings')}
            </button>
          </div>
          <div className="flex-1 p-4">
            <h4 className="text-lg font-semibold mb-3">{t('The following jobs are available in ') + session.user.service_provider.city}</h4>
            
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
                <button onClick={() => openConfirmModal(booking)}>
                  {t('Accept Job')}
                </button>
              </div>
            )) : <p>{t('No bookings')}</p>}

            <h4 className="text-lg font-semibold mt-8 mb-3">{t('Jobs you have accepted')}</h4>

            {acceptedBookings.length > 0 ? acceptedBookings.map(booking => (
              <div key={booking.id} className="p-2 bg-green-100 rounded-md shadow-sm mb-2">
                <p>
                  {t(booking.attributes.services.data[0].attributes.type)} {t('on')}   
                  {new Date(booking.attributes.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })} {t('at')}
                  {new Date(booking.attributes.date).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit', hour12: true
                  })}
                </p>
              </div>
            )) : <p>{t('No accepted bookings')}</p>}
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
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg relative">
            <p>{t('Are you sure you want to accept this job?')}</p>
            <button onClick={acceptJob} className="mr-4 bg-blue-500 text-white p-2 rounded">{t('Yes')}</button>
            <button onClick={closeConfirmModal} className="bg-gray-500 text-white p-2 rounded">{t('No')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
