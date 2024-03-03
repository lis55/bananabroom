'use client'
import { useState } from 'react';
import Image from 'next/image';
import BookingForm from './BookingForm';

const s3Images = {
  cleaning2: '/img/cleaning2.jpg',
  painting2: '/img/painting2.jpg',

};

export default function HeroSection() {
  const [cleaningFormExpanded, setCleaningFormExpanded] = useState(false);
  const [paintingFormExpanded, setPaintingFormExpanded] = useState(false);

  const toggleCleaningForm = () => setCleaningFormExpanded(!cleaningFormExpanded);
  const togglePaintingForm = () => setPaintingFormExpanded(!paintingFormExpanded);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Adding top margin to the hero section for spacing */}
      <div className="relative mb-16 mt-8"> {/* Adjust mt-8 as needed for more or less space */}

        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Welcome to BananaBroom</h1>
          <p className="mt-6 max-w-lg mx-auto text-xl">
            Your one-stop destination for all home maintenance needs. From professional cleaning to expert painting, we make your spaces shine.
          </p>
        </div>
      </div>

      {/* Services sections... */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:flex md:flex-1">
            <Image src={s3Images.cleaning2} alt="Cleaning Service" width={600} height={400} objectFit="cover" layout="intrinsic" />
          </div>
          <div className="p-4 space-y-2 md:flex-1">
            <h3 className="text-2xl font-semibold">Professional Cleaning</h3>
            <p>Keep your home or office sparkling with our top-notch cleaning services.</p>
            <button  onClick={toggleCleaningForm}>
              Book Cleaning
            </button>
            {cleaningFormExpanded && <BookingForm />}
          </div>
        </div>
      </div>

      {/* Painting Service Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row-reverse items-center">
          <div className="md:flex md:flex-1">
            <Image src={s3Images.painting2} alt="Painting Service" width={600} height={400} objectFit="cover" layout="intrinsic" />
          </div>
          <div className="p-4 space-y-2 md:flex-1">
            <h3 className="text-2xl font-semibold">Expert Painting</h3>
            <p>Transform your space with vibrant colors and expert finishes from our skilled painters.</p>
            <button onClick={togglePaintingForm}>
              Book Painting
            </button>
            {paintingFormExpanded && <BookingForm />}
          </div>
        </div>
      </div>
    </div>
  );
}

