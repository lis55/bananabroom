'use client'
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { DropzoneArea } from 'material-ui-dropzone';

const ServiceProviderRegistrationForm = () => {
  const { t } = useTranslation();
  const languagesOptions = ['English', 'German', 'French', 'Turkish', 'Italian', 'Spanish', 'Ukrainian', 'Russian'];

  const formik = useFormik({
    initialValues: {
      name: '',
      about: '',
      city: '',
      languages: [],
      profilePicture: null
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t('Name is required')),
      about: Yup.string()
        .required(t('Please describe yourself briefly'))
        .max(200, t('About must be 200 characters or less')),
      city: Yup.string().required(t('Please select a city')),
      languages: Yup.array().min(1, t('At least one language must be selected')),
      profilePicture: Yup.mixed().required(t('Profile picture is required'))
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('files.profile_picture', values.profilePicture);
      formData.append('data', JSON.stringify({
        name: values.name,
        about: values.about,
        city: values.city,
        languages: { multiSelect: values.languages }
      }));

      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/service-providers`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Service Provider Created: ', response.data);
        alert('Service Provider Registered Successfully!');
      } catch (error) {
        console.error('Error posting data: ', error);
        alert('Failed to register service provider.');
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-10" style={{ marginTop: '10rem' }}>
      <form onSubmit={formik.handleSubmit} className="max-w-xl mx-auto shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">{t('Register as a new service provider')}</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('Name')}</label>
          <input
            id="name"
            type="text"
            {...formik.getFieldProps('name')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-xs">{formik.errors.name}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label htmlFor="about" className="block text-sm font-medium text-gray-700">{t('About you (write a brief comment about yourself)')}</label>
          <textarea
            id="about"
            {...formik.getFieldProps('about')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            rows="3"
          />
          {formik.touched.about && formik.errors.about ? (
            <div className="text-red-500 text-xs">{formik.errors.about}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">{t('City')}</label>
          <select
            id="city"
            {...formik.getFieldProps('city')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">{t('Select a city')}</option>
            <option value="Erlangen">{t('Erlangen')}</option>
            <option value="Nuremberg">{t('Nuremberg')}</option>
            <option value="Furth">{t('Furth')}</option>
          </select>
          {formik.touched.city && formik.errors.city ? (
            <div className="text-red-500 text-xs">{formik.errors.city}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t('Languages')}</label>
          {languagesOptions.map(lang => (
            <div key={lang}>
              <label>
                <input
                  type="checkbox"
                  name="languages"
                  value={lang}
                  checked={formik.values.languages.includes(lang)}
                  onChange={formik.handleChange}
                />
                {t(lang)}
              </label>
            </div>
          ))}
          {formik.touched.languages && formik.errors.languages ? (
            <div className="text-red-500 text-xs">{formik.errors.languages}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{t('Profile Picture')}</label>
          <DropzoneArea
            onDrop={(acceptedFiles) => formik.setFieldValue('profilePicture', acceptedFiles[0])}
            acceptedFiles={['image/*']}
            maxFileSize={5000000}
            filesLimit={1}
            dropzoneText={t('Drag and drop an image here or click')}
          />
          {formik.touched.profilePicture && formik.errors.profilePicture ? (
            <div className="text-red-500 text-xs">{formik.errors.profilePicture}</div>
          ) : null}
        </div>
        <button type="submit">
          {t('Register')}
        </button>
      </form>
    </div>
  );
};

export default ServiceProviderRegistrationForm;
