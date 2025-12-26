"use client";

import Link from "next/link";
import Image from "next/image";
import clubLogo from "../../public/gachiya_club.png";

export default function Footer() {
  const footerLinks = {
    news: [
      { label: "Events", href: "/events" },
      // { label: "The Club Blog", href: "/blog" },
      // { label: "Club Magazine", href: "/magazine" },
    ],
    media: [
      { label: "Notices", href: "/notices" },
      { label: "Gallery", href: "/gallery" },

      
      { label: "Resources", href: "/resources" },
    ],
    connect: [
      // { label: "Careers", href: "/careers" },
      { label: "Contact Us", href: "/#contact" },
      // { label: "Your Privacy", href: "/privacy" },
    ],
  };

  const quickLinks = [
    { label: "Find a Club", href: "/#contact" },
    // { label: "Make a Donation", href: "/donate" },
    // { label: "Volunteer", href: "/volunteer" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* News */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              News
            </h4>
            <ul className="space-y-2">
              {footerLinks.news.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Media */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Media
            </h4>
            <ul className="space-y-2">
              {footerLinks.media.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              {footerLinks.connect.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons (placeholder column) */}
          <div className="hidden md:block" />

          {/* Logo & Address */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={clubLogo}
                alt="Srijansil Club"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-bold">Srijansil Club</span>
            </div>
            <address className="text-sm text-gray-400 not-italic leading-relaxed">
              Gachiya, SundarHariacha
              <br />
              <a href="mailto:info@srijansil.org" className="hover:text-white">
                srijansilclub@gmail.com
              </a>
            </address>
          </div>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="text-amber-500 font-semibold">ALSO OF INTEREST</span>
            {quickLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 leading-relaxed">
          <p>
            © 2025 Srijansil Club. All rights reserved. Srijansil Club is a registered non-profit organization dedicated to community service and youth development.
          </p>
          <p className="text-center mt-4">Created By <a href="https://www.facebook.com/biraj.birajdahal" className="text-amber-500 hover:underline">Raghav Dahal</a></p>
        </div>
      </div>
    </footer>
  );
}
