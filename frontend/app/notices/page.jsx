"use client"
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import NoticeCard from "../components/NoticeCard";
import Header from "../components/Header";
import Skeleton from "../components/Skeleton";
import { getAllNotices } from "../api/notices";
import { useDebounce } from "../hooks/useDebounce";
import Footer from "../components/Footer";

export default function NoticesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search
  const search = useDebounce(searchTerm, 400);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notices", page, limit, search],
    queryFn: () => getAllNotices({ page, limit, search }),
    staleTime: 1000 * 60 * 5,
  });

  const notices = data?.data ?? [];
  const totalNotices = data?.totalNotices ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalNotices / limit));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-amber-400/20 text-amber-300 rounded-full text-sm font-semibold mb-4 border border-amber-400/30">
            Stay Updated
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Club <span className="text-amber-400">Notices</span>
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Stay informed about the latest announcements, updates, and important information from Srijansil Club.
          </p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search notices..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-10 text-red-600">
            Failed to load notices. Please try again later.
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && notices.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No notices found.
          </div>
        )}

        {/* Notices List */}
        {!isLoading && !isError && notices.length > 0 && (
          <motion.div layout className="space-y-4">
            {notices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <NoticeCard notice={notice} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
