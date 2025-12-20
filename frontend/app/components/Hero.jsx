"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"
import clubPhoto from "../../public/gachiya_club.png"
import Link from "next/link"

export default function Hero() {
  const backgroundImages = [clubPhoto,clubPhoto]

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background: animated slider on md+; static optimized image on mobile */}
      <div className="absolute inset-0 z-0">
        {/* desktop/tablet: use animated slider */}
        <div className="hidden md:block h-full w-full overflow-hidden">
          <BackgroundSlider images={backgroundImages} />
        </div>

        {/* mobile: simple static background to avoid heavy animation and layout shifts */}
        <div className="block md:hidden absolute inset-0">
          <Image
            src={clubPhoto}
            alt="Club background"
            fill
            priority
            className="object-cover"
            quality={75}
          />
        </div>
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />

      {/* Centered Content */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight"
          >
            SRIJANSIL CLUB
          </motion.h1>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 w-32 mx-auto bg-yellow-400 rounded-full"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-2xl sm:text-3xl md:text-4xl text-white/90 font-light tracking-wide"
          >
            FOR
          </motion.p>

          {/* Big emphasis text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-yellow-400 tracking-tighter leading-none"
          >
            CHANGE
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            Join us in making a difference. Together we create, inspire, and transform.
          </motion.p>

          {/* Call to action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex gap-4 justify-center flex-wrap pt-4"
          >
            <button className="group px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg">
              <span className="flex items-center gap-2">
                Join Now
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <Link className="px-8 py-4 border-2 border-white/80 hover:border-yellow-400 text-white hover:text-yellow-400 rounded-full font-bold text-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105" href="/events">
              Our Events
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/60 text-sm font-medium">Scroll Down</span>
          <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}


function BackgroundSlider({ images, interval = 5000 }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images, interval])

  return (
    <div className="absolute inset-0 z-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 overflow-hidden will-change-transform"
        >
          <Image
            src={images[index] || "/placeholder.svg"}
            alt="Club background"
            fill
            priority
            className="object-cover"
            quality={90}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
