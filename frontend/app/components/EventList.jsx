"use client";


import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import EventRegistrationForm from "./EventRegistrationForm";
import Skeleton from "./Skeleton";
import LoadingOverlay from "./LoadingOverlay";
import { getAllEvents, getEventDetail } from "../api/eventRegister";
import { useDebounce } from "../hooks/useDebounce";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function EventList() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Debounce search term
  const search = useDebounce(searchTerm, 350);


  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["events", page, limit, search],
    queryFn: () => getAllEvents({ page, limit, search }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, 
  });

  // Show overlay when fetching but not initial load (we use skeleton for initial)
  const showFetchingOverlay = isFetching && !isLoading;

  const events = data?.data || [];
  console.log("Events data:", data);
  const totalEvents = data?.totalEvents || 0;
  const totalPages = Math.max(1, Math.ceil(totalEvents / limit));

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
    <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-gray-50 to-white">
      {/* Section Title */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
          What's Coming
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Upcoming <span className="text-blue-600">Events</span>
        </h1>
      </motion.div>

      {/* Search & Pagination Controls */}
      <div className="max-w-5xl mx-auto mb-8 px-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            placeholder="Search events..."
            className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2.5 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors bg-white shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-600 px-2">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2.5 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors bg-white shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <select
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value, 10) || 6);
            setPage(1);
          }}
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
        >
          {[3, 6, 9, 12].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
      </div>

      {/* Event Cards */}
      <div className="max-w-5xl mx-auto flex flex-col gap-8 relative min-h-[200px]">
        {/* Overlay for refetching (pagination, search, etc.) */}
        <LoadingOverlay
          isLoading={showFetchingOverlay}
          message="Updating events..."
          variant="dots"
        />

        {isLoading && (
          <div className="space-y-6">
            <Skeleton variant="card" count={3} className="max-w-5xl mx-auto px-4" />
          </div>
        )}
        {isError && <div className="text-center text-red-600">{error?.message}</div>}
        {!isLoading && events.length === 0 && (
          <div className="text-center text-gray-500">No events found.</div>
        )}

        {events.map((event, index) => (
          <motion.div
            key={event.id || index}
            className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            {/* Image */}
            <div className="relative w-full md:w-40 h-48 md:h-40 flex-shrink-0 rounded-xl overflow-hidden ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all">
              {getEventImageUrl(event) ? (
                <img
                  src={getEventImageUrl(event)}
                  alt={event.title || event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-amber-50 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{event.title || event.name}</h2>
              <span className="inline-flex items-center gap-1.5 text-sm text-amber-600 font-medium mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(event.startDate || event.date || "").toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
              <p className="mt-3 text-gray-600 leading-relaxed line-clamp-2">{event.description}</p>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mt-5 justify-center md:justify-start">
                <Link
                  className="px-6 py-2.5 rounded-full border-2 border-blue-600 text-blue-600 text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                  href={`/events/${event.id}`}
                >
                  View Details
                </Link>
                <button
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 text-sm font-semibold hover:from-amber-300 hover:to-amber-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-amber-200" 
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
