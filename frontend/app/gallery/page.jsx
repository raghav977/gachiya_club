"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllGallery } from "../api/gallery";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function GalleryPage() {
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["gallery", page],
    queryFn: () => getAllGallery({ page, limit: 12 }),
  });

  const images = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 12);


  const getImageUrl = (url) => {
    if (!url) return "";

    // already absolute URL
    if (url.startsWith("http")) return url;

    // convert filesystem path → public URL
    const uploadsIndex = url.indexOf("/uploads/");
    if (uploadsIndex !== -1) {
      console.log(`${BACKEND_URL}${url.slice(uploadsIndex)}`);
      return `${BACKEND_URL}${url.slice(uploadsIndex)}`;
    }

    return "";
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-blue-900 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Gallery
            </h1>
            <p className="text-blue-200 text-lg max-w-2xl">
              Explore moments from our events, activities, and community initiatives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No images in the gallery yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={getImageUrl(image.url)}
                    alt={image.title || "Gallery image"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="py-2 text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white text-3xl hover:bg-white/10 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>

          <div
            className="relative max-w-4xl max-h-[80vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(selectedImage.url)}
              alt={selectedImage.title || "Gallery image"}
              width={1200}
              height={800}
              className="object-contain w-full h-full rounded-lg"
            />

            {selectedImage.title && (
              <p className="text-white text-center mt-4 text-lg">
                {selectedImage.title}
              </p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
