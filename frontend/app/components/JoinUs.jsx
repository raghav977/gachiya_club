"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import clubLogo from "../../public/gachiya_club.png";

export default function JoinUs() {
  const cards = [
    {
      title: "Member experience",
      image: clubLogo,
      link: "/members",
    },
    {
      title: "Club moto and vision",
      image: clubLogo,
      link: "/about",
    },
  ];

  return (
    <section className="py-16 md:py-20 px-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Join us.
          </h2>
          <div className="w-12 h-1 bg-amber-500 mt-3" />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={card.link} className="block group">
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {/* Learn more label */}
                  <div className="absolute bottom-4 left-4">
                    <span className="text-amber-400 text-sm font-medium">
                      Learn more
                    </span>
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                  {card.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Find a club button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/#contact"
            className="inline-block px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded hover:bg-gray-900 hover:text-white transition-colors"
          >
            Find a club
          </Link>
        </motion.div>
      </div>
    </section>
  );
}