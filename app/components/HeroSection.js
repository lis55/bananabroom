'use client'
import Image from 'next/image';
import { useState } from 'react';
import BookingForm from './BookingForm';

const s3Images = {
    cleaning: '/img/cleaning.jpg', // Make sure the path starts with a slash for web paths
    cleaning2: '/img/cleaning2.jpg', // Make sure the path starts with a slash for web paths
    painting: '/img/painting.jpg',
    painting2: '/img/painting2.jpg'
  };

export default function HeroSection() {
  const [cleaningFormExpanded, setCleaningFormExpanded] = useState(false);
  const [paintingFormExpanded, setPaintingFormExpanded] = useState(false);
  const googleFormUrl = process.env.GOOGLE_FORM;

    // Function to toggle Google Form for cleaning
    const toggleCleaningForm = () => {
        setCleaningFormExpanded(!cleaningFormExpanded);
      };
    
      // Function to toggle Google Form for painting
      const togglePaintingForm = () => {
        setPaintingFormExpanded(!paintingFormExpanded);
      };

  return (
    <div className="bg-yellow-100 text-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to BananaBroom</h1>
          <p className="text-xl">
            Your one-stop destination for all home maintenance needs. From professional cleaning to expert painting, we make your spaces shine.
          </p>
        </div>

        {/* Services Introduction with Enhanced Design */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Cleaning Service Intro */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden flex items-center">
            <Image src={s3Images.cleaning2} alt="Cleaning Service" width={150} height={150} objectFit="cover" className="w-full md:w-1/2" />
            <div className="p-4">
              <h3 className="text-2xl font-semibold">Professional Cleaning</h3>
              <p>Keep your home or office sparkling with our top-notch cleaning services.</p>
              <button className="mt-4 inline-block bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors" onClick={toggleCleaningForm}>
                Book Cleaning
              </button>
              {cleaningFormExpanded && <BookingForm/>}
            </div>
          </div>

          {/* Painting Service Intro */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden flex items-center">
            <Image src={s3Images.painting2} alt="Painting Service" width={150} height={150} objectFit="cover" className="w-full md:w-1/2" />
            <div className="p-4">
              <h3 className="text-2xl font-semibold">Expert Painting</h3>
              <p>Transform your space with vibrant colors and expert finishes from our skilled painters.</p>
              <button className="mt-4 inline-block bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors" onClick={togglePaintingForm}>
                Book Painting
              </button>

              {paintingFormExpanded && (
            <BookingForm/>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
