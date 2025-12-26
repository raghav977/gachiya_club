"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedGallery } from "../api/gallery";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function FeaturedGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["featuredGallery"],
    queryFn: () => getFeaturedGallery(6),
    staleTime: 1000 * 60 * 5,
  });

  const images = data?.data || [];

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const filename = url.split("/").pop();
    return `${BACKEND_URL}/uploads/${filename}`;
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8 animate-pulse" />
          <div className="aspect-[16/9] bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null; // Don't render if no featured images
  }

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Our Moments
            </h2>
            <div className="w-12 h-1 bg-amber-500 mt-2" />
          </div>
          <Link
            href="/gallery"
            className="text-blue-900 font-medium hover:underline"
          >
            View all →
          </Link>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-lg">
            <div className="relative aspect-[16/9] md:aspect-[21/9]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={getImageUrl(images[currentIndex]?.url)}
                    alt={images[currentIndex]?.title || "Featured image"}
                    className="object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Title */}
                  {images[currentIndex]?.title && (
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-white text-xl md:text-2xl font-semibold">
                        {images[currentIndex].title}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-blue-900 w-6" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Grid (optional, for desktop) */}
        {images.length > 1 && (
          <div className="hidden md:grid grid-cols-6 gap-2 mt-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex ? "border-amber-500" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={getImageUrl(image.url)}
                  alt={image.title || ""}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
