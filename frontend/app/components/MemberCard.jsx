"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/**
 * MemberCard - Testimonial card component with golden/blue theme
 */
export default function MemberCard({ member, index = 0, compact = false }) {
  const {
    name = "Member Name",
    role = "Position",
    organization = "Organization",
    testimonial = "",
    avatar = null,
  } = member || {};
  console.log("this is avatar", avatar);

  const maxLength = 180;
  const isLong = testimonial.length > maxLength;
  const displayText = compact && isLong 
    ? testimonial.slice(0, maxLength) + "..." 
    : testimonial;

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Quote Card */}
      <div className="relative bg-white rounded-2xl border-2 border-blue-200 p-6 pb-8 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 group">
        {/* Top accent line */}
        <div className="absolute top-0 left-4 right-4 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-blue-500 rounded-t-lg -translate-y-[2px]" />
        
        {/* Quote icon */}
        <div className="absolute -top-3 left-6 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        
        {/* Quote text */}
        <p className="text-gray-700 text-center leading-relaxed text-sm md:text-base mt-4">
          &ldquo;{displayText}&rdquo;
          {compact && isLong && (
            <span className="text-blue-500 hover:text-blue-600 cursor-pointer ml-1 font-medium">
              read more
            </span>
          )}
        </p>

        {/* Speech bubble pointer */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-b-2 border-r-2 border-blue-200 group-hover:border-amber-300 rotate-45 transition-colors" />
      </div>

      {/* Avatar */}
      <div className="relative -mt-1 z-10">
        <div className="w-40 h-40 border rounded-full overflow-hidden ring-4 ring-amber-400 bg-gradient-to-br from-blue-100 to-amber-100 shadow-lg mt-4">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Member Info */}
      <div className="text-center mt-3">
        <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
        <p className="text-amber-600 text-sm font-medium">{role}</p>
        <p className="text-gray-500 text-sm">{organization}</p>
      </div>
    </motion.div>
  );
}

/**
 * MemberCardSkeleton - Loading skeleton for MemberCard
 */
export function MemberCardSkeleton() {
  return (
    <div className="relative flex flex-col items-center animate-pulse">
      <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-6 pb-8 w-full">
        <div className="space-y-2 mt-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto" />
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-200 rotate-45" />
      </div>
      <div className="w-20 h-20 rounded-full bg-gray-200 mt-4" />
      <div className="text-center mt-3 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-32 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
        <div className="h-4 bg-gray-200 rounded w-28 mx-auto" />
      </div>
    </div>
  );
}
