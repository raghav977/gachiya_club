"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import headPhoto from "../../public/srijansilclublogo.jpg";

export default function OurVision() {
  const values = [
    { icon: "🎯", title: "Innovation", desc: "Pushing boundaries with creative solutions" },
    { icon: "🤝", title: "Collaboration", desc: "Working together to achieve more" },
    { icon: "🌟", title: "Excellence", desc: "Striving for the highest standards" },
  ];

  return (
    <section className="py-20 px-6 md:px-20  text-black overflow-hidden">

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          

          <motion.div
            className="relative flex-shrink-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative rings */}
            <div className="absolute inset-0 -m-4">
              <div className="w-full h-full rounded-full border-2 border-amber-400/30 animate-pulse" />
            </div>
            <div className="absolute inset-0 -m-8">
              <div className="w-full h-full rounded-full border border-white/10" />
            </div>
            
            {/* Photo */}
            <div className="w-56 h-56 md:w-72 md:h-72 relative rounded-full overflow-hidden ring-4 ring-amber-400 shadow-2xl shadow-amber-400/20">
              <Image
                src={headPhoto}
                alt="Club Vision"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-2 -right-2 bg-amber-400 text-black-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              Est. 2020
            </motion.div>
          </motion.div>

          {/* Right: Vision Text */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-amber-400/20 text-black-300 rounded-full text-sm font-semibold mb-4 border border-amber-400/30">
              Our Purpose
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-amber-400">Vision</span>
            </h2>
            
            <p className="text-black-100 text-lg md:text-xl leading-relaxed mb-8">
              Our vision is to inspire creativity, foster innovation, and build a
              strong community where every member can learn, grow, and contribute
              meaningfully. We aim to create opportunities for collaboration,
              learning, and real-world impact through our club activities and
              projects.
            </p>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <span className="text-2xl mb-2 block">{value.icon}</span>
                  <h3 className="font-semibold text-black-300 mb-1">{value.title}</h3>
                  <p className="text-black-200 text-sm">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
