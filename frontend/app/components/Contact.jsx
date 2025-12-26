"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { submitInquiry } from "@/app/api/inquiries";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().max(100, "Name must be at most 100 characters").required("Name is required"),
  email: yup.string().email("Invalid email").max(100, "Email must be at most 100 characters").required("Email is required"),
  message: yup.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be at most 1000 characters").required("Message is required"),
});

export default function Contact() {
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: null });
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setSubmitStatus({ success: false, error: null });
      await submitInquiry(data);
      setSubmitStatus({ success: true, error: null });
      reset(); // Clear form on success
    } catch (err) {
      console.error("Inquiry submission failed:", err);
      setSubmitStatus({ success: false, error: "Failed to send message. Please try again." });
    }
  };

  const contactInfo = [
    { icon: "📧", label: "Email", value: "srijansilclub@gmail.com" },
    { icon: "📍", label: "Location", value: "Gachiya SundarHaraicha, Nepal" },
    { icon: "📱", label: "Phone", value: "+977 98XXXXXXXX" },
  ];

  return (
    <section id="contact" className="py-16 md:py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Contact us
          </h2>
          <div className="w-12 h-1 bg-amber-500 mt-3" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-600 leading-relaxed">
              Have questions about joining our club or upcoming events? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            
            <div className="space-y-4 pt-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-900 rounded flex items-center justify-center text-lg">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-gray-900 font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                {...register("name")}
                className={`w-full border px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                {...register("email")}
                className={`w-full border px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                {...register("message")}
                rows={4}
                placeholder="Your message..."
                className={`w-full border px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.message ? "border-red-400" : "border-gray-300"
                }`}
              />
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-900 text-white font-medium rounded hover:bg-blue-800 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {/* Success Message */}
            {submitStatus.success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 rounded text-center"
              >
                <p className="text-green-600 font-medium">
                  ✓ Thank you! Your message has been sent.
                </p>
              </motion.div>
            )}

            {/* Error Message */}
            {submitStatus.error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded text-center"
              >
                <p className="text-red-600 font-medium">
                  {submitStatus.error}
                </p>
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
