"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SocialFollow() {
  const socials = [
    {name:"Tiktok",icon:"M",href:"https://www.tiktok.com/@srijansilclub?_r=1&_t=ZS-92XuNDtsKil&fbclid=IwY2xjawO7ee5leHRuA2FlbQIxMABicmlkETFBV3BqOVNoSU9zcWdRRWo5c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHunhnTNurUeejFXNuuyJcKrMGy63uI188ZMhlSFbfuBdAfC4xWsRkHiQcuNx_aem_02yX6Q4BM-rIvNjukf5zEg"},
    { name: "Facebook", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", href: "https://www.facebook.com/srijanshilclub" },
    // econ: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z", href: "https://youtube.com" },
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
