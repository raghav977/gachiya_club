"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

export default function OurEvent() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true }); // triggers once when visible

  const stats = [
    { label: "Events Organized", value: 20 },
    { label: "Active Members", value: 50 },
    { label: "Workshops", value: 12 },
    { label: "Competitions", value: 8 },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6 md:px-20 bg-gray-50"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Club Achievements
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition"
          >
            {isInView ? (
              <CountUp
                end={stat.value}
                duration={2}
                suffix="+"
                className="text-4xl md:text-5xl font-extrabold text-black"
              />
            ) : (
              <span className="text-4xl md:text-5xl font-extrabold text-black">0+</span>
            )}
            <p className="mt-2 text-gray-600 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
