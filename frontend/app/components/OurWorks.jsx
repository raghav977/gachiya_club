"use client";

import { motion } from "framer-motion";
import clubLogo from "../../public/gachiya_club.png";
import Image from "next/image";

export default function OurWork() {
  const works = [
    {
      title: "Tech Workshop 2025",
      description: "Hands-on workshop on web development.",
      image: clubLogo,
    },
    {
      title: "Community Drive",
      description: "Organized donation and awareness event.",
      image: clubLogo,
    },
    {
      title: "Annual Meetup",
      description: "Networking and fun activities for members.",
      image: clubLogo,
    },
    {
      title: "Coding Competition",
      description: "Competitive coding event for club members.",
      image: clubLogo,
    },
    {
      title: "Hackathon",
      description: "24-hour team challenge to build creative projects.",
      image: clubLogo,
    },
  ];

  return (
    <section className="py-20 px-6 md:px-20 bg-gray-50">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Our Works
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {works.map((work, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
          >
            <div className="relative w-full h-56">
              <Image
                src={work.image}
                alt={work.title}
                className="object-cover rounded-t-xl"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            <div className="p-4">
              <h2 className="text-xl font-semibold">{work.title}</h2>
              <p className="mt-2 text-gray-600">{work.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
