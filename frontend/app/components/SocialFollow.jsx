"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SocialFollow() {
 const socials = [
  {
    name: "Tiktok",
    icon: "M12.925 0h3.122c.09 1.06.426 2.06 1.004 2.94a6.02 6.02 0 0 0 3.005 2.21v3.3a9.02 9.02 0 0 1-4.009-1.26v7.12c0 3.6-2.92 6.52-6.52 6.52S2.99 18.91 2.99 15.31s2.92-6.52 6.52-6.52c.33 0 .65.03.97.08v3.42a3.07 3.07 0 0 0-.97-.15 3.18 3.18 0 1 0 3.18 3.18V0z",
    href: "https://www.tiktok.com/@srijansilclub?_r=1&_t=ZS-92XuNDtsKil"
  },
  {
    name: "Facebook",
    icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    href: "https://www.facebook.com/srijanshilclub"
  },
];


  return (
    <section className="py-16 px-6 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Follow our progress.
          </h2>
          <p className="text-gray-600 mb-8">
            Join our conversation on <span className="underline">social media</span> and see the difference we're making.
          </p>

          <div className="flex justify-center gap-4">
            {socials.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-blue-900 transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
