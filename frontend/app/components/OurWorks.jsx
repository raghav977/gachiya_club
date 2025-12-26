"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import clubLogo from "../../public/gachiya_club.png";
import work from "@/public/work1.jpeg"
import work2 from "@/public/work3.jpeg"

export default function OurWork() {
  const sections = [
    {
      title: "Uniting for good",
      description:
        "Our members make a difference every day, everywhere we serve. With the support of our community and dedicated volunteers, we are changing lives and building a better future for all.",
      image: work,
      imageLeft: true,
    },
    {
      title: "Serving with purpose",
      description:
        "We serve our local communities in so many ways, and we're uniting to serve broader causes and special initiatives to address some of the greatest challenges facing our society today.",
      image: work2,
      imageLeft: false,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Making a global impact
          </h2>
          <div className="w-12 h-1 bg-amber-500 mt-3" />
        </motion.div>

        {/* Alternating Sections */}
        <div className="space-y-16 md:space-y-24">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col ${
                section.imageLeft ? "md:flex-row" : "md:flex-row-reverse"
              } gap-8 md:gap-12 items-center`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {section.description}
                </p>
                <Link
                  href="/about"
                  className="inline-block px-6 py-2.5 bg-blue-900 text-white text-sm font-medium rounded hover:bg-blue-800 transition-colors"
                >
                  Learn more
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
