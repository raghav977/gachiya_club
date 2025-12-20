"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import EventRegistrationForm from "./EventRegistrationForm";
import { getAllEvents, getEventDetail } from "../api/eventRegister";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function EventList() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [search, setSearch] = useState("");
  // local input state for debouncing
  const [searchTerm, setSearchTerm] = useState(search);
  const DEBOUNCE_DELAY = 350; // ms


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", page, limit, search],
    queryFn: () => getAllEvents({ page, limit, search }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, 
  });

  const events = data?.data || [];
  console.log("Events data:", data);
  const totalEvents = data?.totalEvents || 0;
  const totalPages = Math.max(1, Math.ceil(totalEvents / limit));

  // debounce searchTerm -> search to avoid rapid API calls while typing
  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== searchTerm) {
        setSearch(searchTerm);
        setPage(1);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(t);
  }, [searchTerm]);

  const handleOpenModal = async (event) => {
    try {
      const resp = await getEventDetail(event.id);
      const detail = resp?.data || event;
      setSelectedEvent(detail);

      const cats = detail.Categories || detail.categories || detail.Category || [];
      setSelectedCategory(cats.length > 0 ? cats[0].id || cats[0].title : null);

      setOpenModal(true);
    } catch (err) {
      console.error("Failed to fetch event details:", err);
      setSelectedEvent(event);
      setSelectedCategory(null);
      setOpenModal(true);
    }
  };

  const getEventImageUrl = (event) => event.imageURL || event.imageUrl || event.imageURl || null;

  return (
    <section className="py-20 px-6 md:px-20 bg-gray-50">
      {/* Section Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Upcoming Events
      </motion.h1>

      {/* Search & Pagination Controls */}
      <div className="max-w-5xl mx-auto mb-6 px-4 flex flex-col md:flex-row gap-4 items-center">
        <input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          placeholder="Search events..."
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value, 10) || 6);
            setPage(1);
          }}
          className="ml-auto rounded-xl border border-gray-300 px-4 py-2.5 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {[3, 6, 9, 12].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>

      {/* Event Cards */}
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {isLoading && <div className="text-center">Loading...</div>}
        {isError && <div className="text-center text-red-600">{error?.message}</div>}
        {!isLoading && events.length === 0 && (
          <div className="text-center text-gray-500">No events found.</div>
        )}

        {events.map((event, index) => (
          <motion.div
            key={event.id || index}
            className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            {/* Image */}
            <div className="relative w-full md:w-32 h-48 md:h-32 flex-shrink-0 rounded-lg overflow-hidden">
              {getEventImageUrl(event) ? (
                <img
                  src={getEventImageUrl(event)}
                  alt={event.title || event.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col text-center md:text-left">
              <h2 className="text-2xl font-semibold">{event.title || event.name}</h2>
              <span className="text-sm text-gray-500 mt-1">
                {new Date(event.startDate || event.date || "").toLocaleDateString()}
              </span>
              <p className="mt-3 text-gray-700 leading-relaxed">{event.description}</p>

              {/* CTA */}
              <div className="flex gap-3 mt-4">
                <Link
                  className="self-center md:self-start px-5 py-2 rounded-full border border-black text-sm font-medium hover:bg-black hover:text-white transition duration-300"
                  href={`/events/${event.id}`}
                >
                  View Details
                </Link>
                <button
                  className="self-center md:self-start px-5 py-2 rounded-full border border-black text-sm font-medium hover:bg-black hover:text-white transition duration-300 disabled:opacity-50" 
                  onClick={() => handleOpenModal(event) }
                  disabled={!(event.isPublish)}
                >
                  Be a Part of it
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {openModal && selectedEvent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenModal(false)}
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
                  onClick={() => setOpenModal(false)}
                  className="absolute right-5 top-5 text-gray-400 hover:text-black text-xl"
                  aria-label="Close modal"
                >
                  ✕
                </button>
                <h2 className="text-2xl md:text-3xl font-bold text-center">Event Registration</h2>
                <p className="text-center text-sm text-gray-500 mt-1">
                  {selectedEvent.title || selectedEvent.name} —{" "}
                  {new Date(selectedEvent.startDate || selectedEvent.date || "").toLocaleDateString()}
                </p>
              </div>

              {/* Form */}
              <EventRegistrationForm
                selectedEvent={selectedEvent}
                categories={selectedEvent.Categories || selectedEvent.categories || selectedEvent.Category || []}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onClose={() => setOpenModal(false)}
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
    </section>
  );
}
