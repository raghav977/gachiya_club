"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Top from "../components/Top";
import clubMember from "@/public/gachiya_club.png";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />

      {/* COMMON HERO */}
      <Top
        title="About Srijansil Club"
        subtitle="Empowering youth and communities through collective action"
      />

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid gap-12 md:grid-cols-2"
        >
          {/* TEXT */}
          <div>
            <p className="mb-6 text-lg leading-relaxed text-[#21345a]">
              Established in 2049 B.S., Srijansil Club was formally registered as a
              non-profit organization in the District Administration Office,
              Morang on 2052 B.S. It was established by enthusiastic youths of
              Dulari Village Development Committee ward no. 6, Lochani, Morang.
            </p>

            <p className="mb-10 text-lg leading-relaxed text-[#21345a]">
              The organization was established to enhance the socio-economic
              disparities that prevailed at the time of establishment through
              various cultural programs, sports, and other awareness campaigns.
            </p>

            <h2 className="mb-4 text-2xl font-semibold text-[#0b1f40]">
              Our Vision
            </h2>

            <p className="text-lg leading-relaxed text-[#21345a]">
              To build a socially inclusive, empowered, and self-reliant community
              where youth leadership and cultural values drive sustainable
              development.
            </p>
          </div>

          {/* IMAGE */}
          <div className="overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={clubMember}
              alt="Srijansil Club activities"
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </motion.div>
      </section>
      <Footer/>
    </div>

  );
}
