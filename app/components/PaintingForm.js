"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddressAutoComplete from "./AddressAutocomplete";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/navigation';

const PaintingServiceForm = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [zones, setZones] = useState([]);
  const [selectedServicePrice, setSelectedServicePrice] = useState(0);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    // Example data for rooms, in a real scenario this would be fetched from a backend
    setTypes([
      { id: 1, name: 'Interior' },
      { id: 2, name: 'Outdoor' },
    ]);
    
    // Assuming services are fetched here including details like paint type or additional options
    const fetchServices = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/painting-services`);
      setServices(response.data.data); // Adjust according to your API response structure
    };
    fetchServices();

    // Fetch zones from your backend and set them into state
    const fetchZones = async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/zones`,
        );
        setZones(response.data.data); // Adjust according to your API response structure
        console.log(response.data.data);
      };
      fetchZones();
  }, []);

  const formik = useFormik({
    initialValues: {
      address: "",
      date: new Date(),
      time: "",
      serviceId: "",
      roomType: "",
      area: "", // New field for area in square meters
      type: "", // New field for type of paint
      highCeiling: false // New field to indicate if the wall is tall
    },
    validationSchema: Yup.object({
      roomType: Yup.string().required("Room type is required"),
      address: Yup.string().required("Address is required"),
      date: Yup.date().min(new Date(), "Date cannot be in the past").required("Date is required"),
      time: Yup.string().required("Time is required"),
      serviceId: Yup.string().required("Service type is required"),
      area: "", // New field for area in square meters
      type: "", // New field for type of paint
      highCeiling: false // New field to indicate if the wall is tall
    }),
    onSubmit: (values) => {
      // Submit logic with added fields
      console.log("Form values:", values);
      router.push(`/bookpainting?address=${encodeURIComponent(values.address)}&date=${encodeURIComponent(values.date)}&time=${encodeURIComponent(values.time)}&serviceId=${encodeURIComponent(values.serviceId)}&roomType=${encodeURIComponent(values.roomType)}`);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <h3 className="text-2xl font-semibold">Book Painting Service</h3>

      <div>
        <p className="text-x2 font-semibold">Area (in square meters)</p>
        <input
          type="number"
          name="area"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.area}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-500 focus:border-yellow-500"
          placeholder="Enter area in square meters"
        />
      </div>

      <div>
        <p className="text-x2 font-semibold">{t("Where is the wall")}</p>
        <select
          name="zone"
          value={formik.values.type}
          onChange={(event) => {
            formik.handleChange(event); // This maintains existing functionality
          }}
          onBlur={formik.handleBlur}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-500 focus:border-yellow-500"
        >
          <option value="">Select zone</option>
          {types.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-x2 font-semibold">High Ceiling</p>
        <label>
          <input
            type="checkbox"
            name="highCeiling"
            onChange={formik.handleChange}
            checked={formik.values.highCeiling}
            className="mr-2"
          />
          Check if the wall is taller than standard
        </label>
      </div>

      {/* Existing form components (address, date, time, etc.) can stay the same as in the CleaningForm */}

      <div>
        <p className="text-x2 font-semibold">Select Service</p>
        <select
          name="serviceId"
          value={formik.values.serviceId}
          onChange={(event) => {
            formik.handleChange(event);
            const selectedService = services.find(service => service.id === Number(event.target.value));
            setSelectedServicePrice(selectedService ? selectedService.attributes.cost : 0);
          }}
          onBlur={formik.handleBlur}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-500 focus:border-yellow-500"
        >
          <option value="">Select Service</option>
          {services.map(service => (
            <option key={service.id} value={service.id}>{service.attributes.type}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-x2 font-semibold">{t("Zone")}</p>
        <select
          name="zone"
          value={formik.values.zone}
          onChange={(event) => {
            formik.handleChange(event); // This maintains existing functionality
          }}
          onBlur={formik.handleBlur}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-500 focus:border-yellow-500"
        >
          <option value="">Select zone</option>
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.attributes.name}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <p className="text-x2 font-semibold">{t("Address")}</p>
        <AddressAutoComplete
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-500 focus:border-yellow-500"
          onAddressSelect={(suggestion) =>
            formik.setFieldValue("address", suggestion.display_name)
          }
        />
        {formik.touched.address && formik.errors.address && (
          <div className="text-red-500 text-xs">{formik.errors.address}</div>
        )}
      </div>
      <div>
        <p className="text-x2 font-semibold">{t("Date")}</p>
        <DatePicker
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-500 focus:border-yellow-500"
          selected={formik.values.date}
          onChange={(date) => {
            const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD format
            formik.setFieldValue("date", formattedDate);
          }}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div>
        <p className="text-x2 font-semibold">{t("Time")}</p>
        <input
          type="time"
          name="time"
          onChange={formik.handleChange}
          value={formik.values.time}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>
      <div>
        <p className="text-x2 font-semibold">Total amount to pay:</p>
        <p>${selectedServicePrice}</p> {/* Display the price here */}
      </div>

      <button type="submit">Book Painting</button>
    </form>
  );
};

export default PaintingServiceForm;
