import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import StarRatings from 'react-star-ratings'; // Assuming you've installed react-star-ratings
import { useTranslation } from 'react-i18next';

const ReviewForm = ({ booking, session }) => {
  const { t } = useTranslation();
  const [serviceProvided, setServiceProvided] = useState(null);

  const formik = useFormik({
    initialValues: {
      comment: '',
      rating: 0, // Set initial rating to 0
    },
    validationSchema: Yup.object({
      rating: Yup.number().required('Rating is required').min(1).max(5),
    }),
    onSubmit: async (values) => {
      if (serviceProvided !== true) {
        alert('Please confirm that the service was provided.');
        await axios.put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/bookings/${booking.id}`, {
          data: {
            status: 'Cancelled'
          }
        }, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
      }
      try {
        // Post review to /api/reviews
        await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/reviews`, {
          data:{
            ...values,
          serviceProvided,
          booking: {
            connect: [booking.id]
        },
          }
          
        }, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });        
        // PUT request to /bookings to update status
        await axios.put(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/bookings/${booking.id}`, {
          data: {
            status: 'completed'
          }
        }, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        
        console.log('Review submitted successfully');
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <h3 className="text-2xl font-semibold">{t('Submit your review')}</h3>
      <div>
        <label className="block mb-2 text-sm font-bold text-gray-700">
          Please tell us if the service was provided:
        </label>
        <div className="flex items-center">
          <button
            type="button"
            className={`p-2 ${serviceProvided === true ? 'bg-banana-600' : 'bg-gray-200'} text-white rounded-l`}
            onClick={() => setServiceProvided(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className={`p-2 ${serviceProvided === false ? 'bg-red-500' : 'bg-gray-200'} text-white rounded-r`}
            onClick={() => setServiceProvided(false)}
          >
            No
          </button>
        </div>
      </div>
      {serviceProvided && (
        <>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Comment (Optional)
            </label>
            <textarea
              name="comment"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.comment}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-banana-500 focus:border-banana-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700">
              Rating
            </label>
            <StarRatings
              rating={formik.values.rating}
              starRatedColor="banana-600"
              changeRating={(newRating) => formik.setFieldValue('rating', newRating)}
              numberOfStars={5}
              name='rating'
            />
          </div>
        </>
      )}
      <button type="submit">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
