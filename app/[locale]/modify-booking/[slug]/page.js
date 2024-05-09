'use client'
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import AddressAutocomplete from '../../../components/AddressAutocomplete';


const BookingUpdateForm = () => {
  const router = useRouter();
  console.log("BookingId: ", useParams().slug);
  const bookingId = useParams().slug;

  const { t } = useTranslation();
  const [initialValues, setinitialValues] = useState({ date: '', time: '', address: ''});
  const [booking, setBooking] = useState({ date: '', time: '', address: ''});
  const { data: session } = useSession();
  const [editableFields, setEditableFields] = useState({ date: false, time: false, address: false });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const result = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/bookings/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        setBooking(result.data.data.attributes);
        console.log("T___________________Tears: ", booking)
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    if (session?.user) {
      fetchBooking();
    }
  }, [session, booking,bookingId]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // Reinitialize form with fetched booking data
    validationSchema: Yup.object({
      date: Yup.date().optional(),
      time: Yup.string().optional(),
      address: Yup.string().optional(),
    }),
    onSubmit: async (values) => {
      // Filter out fields that haven't changed
      const updatedValues = Object.fromEntries(
        Object.entries(values).filter(([key, value]) => value)
      )
      console.log("Update values: ",updatedValues)

      try {
        const response = await axios.put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/bookings/${bookingId}`, {data:updatedValues}, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        console.log('Booking Updated:', response.data);
        alert('Booking Updated Successfully!');
        setEditableFields({ date: false, time: false, address: false });
        setinitialValues(updatedValues)
      } catch (error) {
        console.error('Error updating booking:', error);
        alert('Failed to update booking.');
      }
    }
  });

  const handleEditClick = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: true }));
  };

  return (
    // make the buttons prettier
    
    <div className="container mx-auto px-4 py-10" style={{ marginTop: '10rem' }}>
      <form onSubmit={formik.handleSubmit} className="max-w-xl mx-auto shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">{t('Update Booking')}</h2>
        <div className="mb-4 flex items-center">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mr-2">{t('Booking on: ')}</label>
          {editableFields.date ? (
            <input
              id="date"
              type="date"
              {...formik.getFieldProps('date')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          ) : (
            <div>
              {booking.date.slice(0, 10)}
              <span
                onClick={() => handleEditClick('date')}
                className="cursor-pointer underline text-blue-600 ml-2"
              >
                {t('Click to edit')}
              </span>
            </div>
          )}
          {formik.touched.date && formik.errors.date ? (
            <div className="text-red-500 text-xs">{formik.errors.date}</div>
          ) : null}
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mr-2">{t('at: ')}</label>
          {editableFields.time ? (
            <input
              id="time"
              type="time"
              {...formik.getFieldProps('time')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          ) : (
            <div>
              {booking.date.slice(11, 16)}
              <span
                onClick={() => handleEditClick('time')}
                className="cursor-pointer underline text-blue-600 ml-2"
              >
                {t('Click to edit')}
              </span>
            </div>
          )}
          {formik.touched.time && formik.errors.time ? (
            <div className="text-red-500 text-xs">{formik.errors.time}</div>
          ) : null}
        </div>
        <div className="mb-4 flex items-center">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mr-2">{t('Address')}: </label>
          {editableFields.address ? (
            <AddressAutocomplete
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-500 focus:border-yellow-500"
            onAddressSelect={(suggestion) =>
              formik.setFieldValue("address", suggestion.display_name)
            }
          />

          ) : (
            <div>
              {booking.address}
              <span
                onClick={() => handleEditClick('address')}
                className="cursor-pointer underline text-blue-600 ml-2"
              >
                {t('Click to edit')}
              </span>
            </div>
          )}
          {formik.touched.address && formik.errors.address ? (
            <div className="text-red-500 text-xs">{formik.errors.address}</div>
          ) : null}
        </div>
        <button type="submit">
          {t('Update Booking')}
        </button>
      </form>
    </div>
  );
};

export default BookingUpdateForm;
