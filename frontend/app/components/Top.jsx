"use client";

import { motion } from "framer-motion";

export default function Top({ title, subtitle }) {
  return (
    <section className="bg-blue-900 py-16 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-2xl text-lg text-blue-200">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
