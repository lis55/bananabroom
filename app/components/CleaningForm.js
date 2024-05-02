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
import { useRouter } from "next/navigation";

const CleaningForm = () => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [selectedServicePrice, setSelectedServicePrice] = useState(0);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(0);

  useEffect(() => {
    // Fetch services from your backend and set them into state
    const fetchServices = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/services`,
      );
      setServices(response.data.data); // Adjust according to your API response structure
      console.log(response.data.data);
    };
    // Fetch zones from your backend and set them into state
    const fetchZones = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/zones`,
      );
      setZones(response.data.data); // Adjust according to your API response structure
      console.log(response.data.data);
    };
    fetchServices();
    fetchZones();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formik = useFormik({
    // In useFormik initialization
    initialValues: {
      address: "",
      date: new Date(),
      time: "",
      serviceId: "", // Updated from cleaning_type to serviceId
      zone: "",
    },

    // In validationSchema
    validationSchema: Yup.object({
      zone: Yup.string().required("Zone is required"),
      address: Yup.string().required("Address is required"),
      date: Yup.date()
        .min(today, "Date cannot be in the past")
        .required("Date is required"),
      time: Yup.string().required("Time is required"),
      serviceId: Yup.string().required("Service type is required"), // Updated from cleaning_type to serviceId
    }),

    onSubmit: async (values) => {
      // Combine date and time into a single dateTime value
      const dateTime = `${values.date}T${values.time}`;

      try {
        // Modify the data structure to match your backend expectations
        const bookingData = {
          user: session.user.id, // Replace <user_id> with actual user id obtained from your auth context
          service: values.serviceId, // Use the selected service
          zone: values.zone,
          address: values.address, // Assuming this includes all necessary address details
          dateTime,
        };
        /* 
        const response = await axios.post(
          "http://localhost:1337/api/bookings",
          bookingData,
        );
        console.log("Booking successful", response.data); */
        console.log("Form values:", values);
        router.push(
          `/bookcleaning?address=${encodeURIComponent(values.address)}&date=${encodeURIComponent(values.date)}&time=${encodeURIComponent(values.time)}&serviceId=${encodeURIComponent(values.serviceId)}&dateTime=${encodeURIComponent(
            dateTime,
          )}&zone=${encodeURIComponent(values.zone)}&servicePrice=${encodeURIComponent(selectedServicePrice)}`,
        );
      } catch (error) {
        console.error("Error making the booking:", error.response || error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <h3 className="text-2xl font-semibold">{t("Form title")}</h3>
      <div>
        <p className="text-x2 font-semibold">{t("Service type")}</p>
        <select
          name="serviceId"
          value={formik.values.serviceId}
          onChange={(event) => {
            formik.handleChange(event); // This maintains existing functionality
            console.log("BBBBBBBBBBBBBBBBBBBBBBBB");
            console.log(event.target);
            // Find the selected service and update the price state
            const selectedService = services.find(
              (service) => service.id === Number(event.target.value),
            );
            setSelectedServicePrice(
              selectedService ? selectedService.attributes.cost : 0,
            ); // Adjust based on your actual data structure
            console.log("AAAAAAAAAAAAAAAAAAAAAA");
            console.log(selectedService?.attributes.cost);
          }}
          onBlur={formik.handleBlur}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-yellow-500 focus:border-yellow-500"
        >
          <option value="">Select Service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.attributes.type}
            </option>
          ))}
        </select>

        {formik.touched.cleaning_type && formik.errors.cleaning_type && (
          <div className="text-red-500 text-xs">
            {formik.errors.cleaning_type}
          </div>
        )}
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

      <button type="submit">Book Cleaning</button>
    </form>
  );
};

export default CleaningForm;
