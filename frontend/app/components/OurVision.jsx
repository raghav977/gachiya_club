"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import headPhoto from "../../public/srijansilclublogo.jpg"; 
export default function OurVision() {
  // Variants for sliding animation
  const photoVariant = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const textVariant = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="py-20 px-6 md:px-20 bg-white">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">
        
        {/* Left: Animated Photo */}
        <motion.div
          className="flex-1 flex justify-center md:justify-start"
          variants={photoVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
        >
          <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-full overflow-hidden shadow-lg">
            <Image
              src={headPhoto}
              alt="Club Head"
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Right: Animated Vision Text */}
        <motion.div
          className="flex-1"
          variants={textVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our Vision
          </h2>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            Our vision is to inspire creativity, foster innovation, and build a
            strong community where every member can learn, grow, and contribute
            meaningfully. We aim to create opportunities for collaboration,
            learning, and real-world impact through our club activities and
            projects.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
