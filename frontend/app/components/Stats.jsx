"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function CountUp({ end, duration = 1200 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const increment = end / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [inView, end, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Stats() {
  const stats = [
    { number: 20, suffix: "+", label: "Members" },
    { number: 5, suffix: "+", label: "Events organized" },
    { number: 10, suffix: "+", label: "Years of service" },
    { number: 100, suffix: "+", label: "Lives impacted" },
  ];

  return (
    <section className="bg-white py-12 mt-10 border-t border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-gray-900">
                <CountUp end={stat.number} />
                {stat.suffix}
              </div>
              <div className="text-sm md:text-base text-gray-500 mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
