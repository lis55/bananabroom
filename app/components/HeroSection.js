'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import BookingForm from './BookingForm';

// Assuming you have environment variables for your Google Form URLs
const cleaningFormUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM;
const paintingFormUrl = process.env.NEXT_PUBLIC_GOOGLE_FORM;

const s3Images = {
  cleaning2: '/img/cleaning2.jpg',
  painting2: '/img/painting2.jpg',
};

// Simple Modal Component
const Modal = ({ isOpen, close, children }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: 20, borderRadius: 5, maxWidth: '90%', width: '600px', maxHeight: '90%', overflowY: 'auto' }}>
        {children}
        <button onClick={close} style={{ marginTop: 20 }}>Close</button>
      </div>
    </div>
  );
};

export default function HeroSection() {
  const { t } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentFormUrl, setCurrentFormUrl] = useState('');

  const openModalWithForm = (formUrl) => {
    setCurrentFormUrl(formUrl);
    setModalIsOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-16 mt-8">
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{t('welcome')}</h1>
          <p className="mt-6 max-w-lg mx-auto text-xl">
            {t('Slogan')}
          </p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:flex md:flex-1">
            <Image src={s3Images.cleaning2} alt="Cleaning Service" width={600} height={400} objectFit="cover" layout="intrinsic" />
          </div>
          <div className="p-4 space-y-2 md:flex-1">
            <h3 className="text-2xl font-semibold">{t('Cleaning')}</h3>
            <p>{t('Slogan cleaning')}</p>
            <button onClick={() => openModalWithForm(cleaningFormUrl)}>
              {t('Book Cleaning')}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row-reverse items-center">
          <div className="md:flex md:flex-1">
            <Image src={s3Images.painting2} alt="Painting Service" width={600} height={400} objectFit="cover" layout="intrinsic" />
          </div>
          <div className="p-4 space-y-2 md:flex-1">
            <h3 className="text-2xl font-semibold">{t('Expert Painting')}</h3>
            <p>{t('Slogan painting')}</p>
            <button onClick={() => openModalWithForm(paintingFormUrl)}>
              {t('Book Painting')}
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={modalIsOpen} close={() => setModalIsOpen(false)}>
        <BookingForm/>
      </Modal>
    </div>
  );
}
