"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

export default function OurEvent() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  const stats = [
    { label: "Events Organized", value: 20, icon: "🎉", color: "from-amber-400 to-amber-500" },
    { label: "Active Members", value: 50, icon: "👥", color: "from-blue-500 to-blue-600" },
    { label: "Workshops", value: 12, icon: "💡", color: "from-green-500 to-green-600" },
    { label: "Competitions", value: 8, icon: "🏆", color: "from-purple-500 to-purple-600" },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6 md:px-20 bg-gradient-to-b from-gray-50 to-white"
    >
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
          Our Impact
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Club <span className="text-blue-600">Achievements</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Numbers that reflect our dedication and community growth
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
          >
            {/* Card */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {/* Icon with gradient background */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              
              {/* Counter */}
              {isInView ? (
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  suffix="+"
                  className="text-3xl md:text-4xl font-extrabold text-gray-900"
                />
              ) : (
                <span className="text-3xl md:text-4xl font-extrabold text-gray-900">0+</span>
              )}
              
              {/* Label */}
              <p className="mt-2 text-gray-600 font-medium text-sm md:text-base text-center">
                {stat.label}
              </p>
            </div>
            
            {/* Decorative gradient blur */}
            <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
