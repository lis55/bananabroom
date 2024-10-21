'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import StarRatingComponent from 'react-star-rating-component';
import Image from 'next/image';

const ProvidersPage = () => {
  const [providers, setProviders] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/service-providers?populate[services]=*&populate[zones]=*&populate[reviews]=*&populate[profile_picture]=*`);
        setProviders(response.data.data);
        console.log("Providers", response.data.data)
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchProviders();
  }, []);

  const cities = [...new Set(providers.map(provider => provider.attributes.zones.data.map(zone => zone.attributes.City)).flat())];

  const handleCityClick = city => {
    setSelectedCity(city);
  };

  const groupedByCategory = () => {
    return providers
      .filter(provider => provider.attributes.zones.data.some(zone => zone.attributes.City === selectedCity))
      .reduce((acc, provider) => {
        provider.attributes.services.data.forEach(service => {
          const category = service.attributes.type;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({
            ...provider,
            serviceDetail: service.attributes
          });
        });
        return acc;
      }, {});
  };

  const providersByCategory = groupedByCategory();

  return (
    <div className="container mx-auto px-4 py-10" style={{ marginTop: '10rem' }}>
      <div className="mb-4 flex space-x-2 justify-center">
        {cities.map((city, index) => (
          <button key={index} onClick={() => handleCityClick(city)} >
            {city}
          </button>
        ))}
      </div>
      {Object.keys(providersByCategory).map((category, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-3xl font-bold mb-4 text-center">{t(category)}</h2>
          <div className="grid grid-cols-3 gap-4 justify-center">
            {providersByCategory[category].map((provider, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4 flex flex-col">
                <div className="flex items-center">
                  <Image src={provider.attributes.profile_picture ? provider.attributes.profile_picture.data.attributes.url : '/img/default-pic.jpg'} alt={provider.attributes.name} width={150} height={150} className="rounded-full mr-4" />
                  <div>
                    <h3 className="text-2xl font-semibold">{t(provider.attributes.name)}</h3>
                    <ul>
                      {provider.attributes.services.data.map((service, serviceIndex) => (
                        <li key={serviceIndex}>{t(service.attributes.type)}</li>
                      ))}
                    </ul>
                    <ul>
                      {provider.attributes.languages.map((language, languageIndex) => (
                        <li key={languageIndex}>{t(language)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <p>{t(provider.attributes.about)}</p>
                  <StarRatingComponent 
                    name={`rate${index}`}
                    starCount={5}
                    value={provider.attributes.reviews.data[0]?.attributes.rating || 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProvidersPage;
