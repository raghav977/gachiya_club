"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import runPhoto from "../../public/runphoto.jpeg";

export default function AdModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 2500); // 2.5 seconds delay

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  const handleClose = () => setOpen(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/80 transition"
          aria-label="Close advertisement"
        >
          ×
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative h-72 md:h-full min-h-[260px]">
            <Image
              src={runPhoto}
              alt="Join our run event"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col gap-4 justify-center">
            <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
              Special highlight
            </p>

            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              Join the run and make an impact.
            </h3>

            <p className="text-gray-600">
              Be part of our upcoming event. Register now to secure your spot and contribute to a great cause.
            </p>

            <div className="flex gap-3">
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-5 py-3 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition"
                onClick={handleClose}
              >
                Register Now
              </Link>

              <button
                onClick={handleClose}
                className="px-5 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
