"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().min(10, "Message must be at least 10 characters").required("Message is required"),
});

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // You can integrate your backend/email API here
  };

  return (
    <section className="py-20 px-6 md:px-20 bg-gray-50 min-h-screen flex flex-col items-center">
      {/* Heading */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Contact Us
      </motion.h1>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg flex flex-col gap-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        {/* Name */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Name</label>
          <input
            type="text"
            {...register("name")}
            className={`border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className={`border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Message */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Message</label>
          <textarea
            {...register("message")}
            rows={5}
            className={`border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black-600 text-black font-semibold px-6 py-3 rounded-lg hover:bg-black-700 transition"
        >
          {isSubmitting ? "Submitting..." : "Send Message"}
        </button>

        {/* Success Message */}
        {isSubmitSuccessful && (
          <p className="text-green-500 font-medium mt-2 text-center">
            Thank you! Your message has been sent.
          </p>
        )}
      </motion.form>
    </section>
  );
}
