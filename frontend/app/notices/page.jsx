"use client"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NoticeCard from "../components/NoticeCard";
import Header from "../components/Header";

export default function NoticesPage() {
const dummyNotices = [
  {
    id: 1,
    title: "Hackathon Registrations Extended",
    summary:
      "Due to high demand, registrations for the Annual Hackathon have been extended till 20th September.",
    priority: "urgent",
    isPinned: true,
    publishAt: "2025-09-15",
  },
  {
    id: 2,
    title: "Club Orientation Program",
    summary:
      "Orientation program for new members will be conducted on 18th September in Seminar Hall A.",
    priority: "important",
    isPinned: true,
    publishAt: "2025-09-14",
  },
  {
    id: 3,
    title: "Photography Contest Results Announced",
    summary:
      "The results of the inter-college photography contest have been published on the events page.",
    priority: "normal",
    isPinned: false,
    publishAt: "2025-09-10",
  },
  {
    id: 4,
    title: "Weekly Club Meeting",
    summary:
      "All members are requested to attend the weekly club meeting scheduled for Friday at 5 PM.",
    priority: "important",
    isPinned: false,
    publishAt: "2025-09-12",
  },
  {
    id: 5,
    title: "Workshop on Web Development",
    summary:
      "A hands-on workshop on modern web development will be conducted using React and Node.js.",
    priority: "normal",
    isPinned: false,
    publishAt: "2025-09-08",
  },
  {
    id: 6,
    title: "Last Date for Membership Registration",
    summary:
      "This is the final reminder for students to complete their club membership registration.",
    priority: "urgent",
    isPinned: false,
    publishAt: "2025-09-16",
  },
];

  useEffect(() => {
    fetch("/api/notices")
      .then((res) => res.json())
      .then((data) => setNotices(data));
  }, []);

  const pinned = dummyNotices.filter((n) => n.isPinned);
  const others = dummyNotices.filter((n) => !n.isPinned);

  return (
    <div>

        <Header/>
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8"
        >
        Notices
      </motion.h1>

      {/* Pinned Notices */}
      {pinned.length > 0 && (
          <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Pinned</h2>
          <div className="space-y-4">
            {pinned.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        </section>
      )}

      {/* All Notices */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Notices</h2>
        <motion.div layout className="space-y-4">
          {others.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
        </motion.div>
      </section>
    </div>
    </div>
  );
}
