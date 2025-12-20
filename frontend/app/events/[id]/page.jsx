"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Header from "@/app/components/Header";
import EventRegistrationForm from "@/app/components/EventRegistrationForm";
import { getEventDetail } from "@/app/api/eventRegister";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function EventDetail() {
  const params = useParams();
  const eventId = params.id;

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ["eventDetail", eventId],
    queryFn: () => getEventDetail(eventId).then(res => res.data),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, 
  });

  if (isLoading) return <div>Loading event...</div>;
  if (error) return <div className="text-red-600">Failed to load event.</div>;
  if (!event) return <div>No event found.</div>;

  return (
    <div>
      <Header />

      <div className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-500 mb-2">
          {new Date(event.startDate || event.date || "").toLocaleDateString()}
        </p>
        <img
          src={event.imageURL || event.imageUrl || "/placeholder.png"}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <p className="text-gray-700 mb-6">{event.description}</p>

        {/* Categories */}
        {event.Categories?.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold">Categories:</h3>
            <ul className="list-disc list-inside">
              {event.Categories.map((cat) => (
                <li key={cat.id}>{cat.title}</li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <button
          className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50"
          onClick={() => {
            setShowModal(true);
            // default to first category if exists
            setSelectedCategory(event.Categories?.[0]?.id || null);
          }}
          disabled={!(event.isPublish)}
        >
          Register Now
        </button>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white border-b px-6 md:px-10 py-5">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute right-5 top-5 text-gray-400 hover:text-black text-xl"
                  aria-label="Close modal"
                >
                  ✕
                </button>
                <h2 className="text-2xl md:text-3xl font-bold text-center">Event Registration</h2>
                <p className="text-center text-sm text-gray-500 mt-1">
                  {event.title || event.name} —{" "}
                  {new Date(event.startDate || event.date || "").toLocaleDateString()}
                </p>
              </div>

              {/* Form */}
              <EventRegistrationForm
          selectedEvent={event}
          categories={event.Categories || []}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onClose={() => setShowModal(false)}
                onSubmit={async (formData) => {
                  const response = await fetch(`${BACKEND_URL}/api/player/register`, {
                    method: "POST",
                    body: formData,
                  });
                  const data = await response.json();
                  if (!response.ok) {
                    throw new Error(data?.message || "Registration failed");
                  }
                  return data;
                }}
        />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
