"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MemberCard, { MemberCardSkeleton } from "./MemberCard";
import president from "@/public/presidentnew.jpg"
import secretary from "@/public/secretary.jpg"
import treasurer from "@/public/treasurer.jpg"
import vicePresident from "@/public/vicepresident.jpg"
import vicesecretary from "@/public/vicesecretary.jpg"



const FEATURED_MEMBERS = [
  {
    id: 1,
    name: "Eak Raj Pokhrel",
    role: "President",
    organization: "Srijansil Club",
    testimonial:
      "Being part of Srijansil Club has been an incredible journey. The collaborative spirit and dedication of our members inspire me every day to push boundaries and create meaningful impact in our community.",
    avatar: president,
  },
  {
    id: 2,
    name: "Anisha Sharma",
    role: "Vice President",
    organization: "Srijansil Club",
    testimonial:
      "The Srijansil Club brings together passionate individuals from diverse backgrounds. Our events and initiatives have helped countless students discover their potential and build lasting connections.",
    avatar: vicePresident,
  },
  {
    id: 3,
    name: "Bikash Thapa",
    role: "General Secretary",
    organization: "Srijansil Club",
    testimonial:
      "What makes Srijansil special is the culture of innovation and mutual support. Every member contributes unique perspectives that help us grow together as a community.",
    avatar: secretary,
  },
  {
    id: 4,
    name: "Priya Poudel",
    role: "Treasurer",
    organization: "Srijansil Club",
    testimonial:
      "Joining Srijansil Club was one of the best decisions I've made. The opportunities for leadership development and community service have been transformative for my personal growth.",
    avatar: treasurer,
  },
];

// console.log(FEATURED_MEMBERS);
/**
 * MemberTestimonials - Home page section showing featured member testimonials
 */
export default function MemberTestimonials({
  members = FEATURED_MEMBERS,
  limit = 4,
  showViewMore = true,
  isLoading = false,
}) {
  const displayMembers = members.slice(0, limit);

  return (
    <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
          Testimonials
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          What Our <span className="text-blue-600">Members</span> Say
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Hear from the amazing people who make Srijansil Club a vibrant community
          of changemakers and innovators.
        </p>
      </motion.div>

      {/* Members Grid */}
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <MemberCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayMembers.map((member, index) => (
              <MemberCard
                key={member.id || index}
                member={member}
                index={index}
                compact={true}
              />
            ))}
          </div>
        )}

        {/* View More Button */}
        {showViewMore && !isLoading && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/members"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-md"
            >
              View All Members
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Export the dummy data for use in other components
export { FEATURED_MEMBERS };
