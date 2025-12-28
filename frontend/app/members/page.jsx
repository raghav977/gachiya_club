"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import MemberCard, { MemberCardSkeleton } from "../components/MemberCard";
import Footer from "../components/Footer";
import { getPublicMembers } from "../api/members";
import { getImageUrl } from "../utils/getImage";

const MEMBER_TYPES = [
  { key: "executive", label: "Executive Committee", description: "The leaders who guide our club's vision and initiatives" },
  { key: "team", label: "Our Teams", description: "Dedicated team members working behind the scenes" },
  { key: "member", label: "Members", description: "Every member brings unique skills and perspectives to our community" },
];

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState("executive");
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["publicMembers", activeTab, page, limit],
    queryFn: () => getPublicMembers({ memberType: activeTab, page, limit }),
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  const members = data?.data ?? [];
  const totalMembers = data?.totalMembers ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalMembers / limit));

  // Reset page when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  // Get active type info
  const activeType = useMemo(() => 
    MEMBER_TYPES.find(t => t.key === activeTab), 
    [activeTab]
  );

  // Transform API data to match MemberCard props
  const transformMember = (member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    organization: "Srijansil Club",
    testimonial:member.description,
    avatar: getImageUrl(member.image), 

  });


  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-24 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        
        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-amber-400/20 text-amber-300 rounded-full text-sm font-semibold mb-6 border border-amber-400/30">
            Our Community
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Meet Our <span className="text-amber-400">Amazing</span> Members
          </h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto">
            The passionate individuals who drive Srijansil Club forward. 
            Their dedication and creativity make our community extraordinary.
          </p>
        </motion.div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 px-6 bg-gray-50 border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {MEMBER_TYPES.map((type) => (
              <button
                key={type.key}
                onClick={() => handleTabChange(type.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === type.key
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                <span>{type.label}</span>
                {activeTab === type.key && totalMembers > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-white/20">
                    {totalMembers}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Section Header */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${
              activeTab === 'executive' ? 'bg-blue-100 text-blue-700' :
              activeTab === 'team' ? 'bg-green-100 text-green-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {activeType?.label}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {activeTab === 'executive' && <>Executive <span className="text-blue-600">Committee</span></>}
              {activeTab === 'team' && <>Our <span className="text-green-600">Teams</span></>}
              {activeTab === 'member' && <>Club <span className="text-amber-500">Members</span></>}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              {activeType?.description}
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <MemberCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">Failed to load members</p>
              <p className="text-gray-500 text-sm mt-1">Please try again later</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && members.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* <span className="text-4xl">{activeType?.icon}</span> */}
              </div>
              <p className="text-gray-600 font-medium">No {activeType?.label?.toLowerCase()} found</p>
              <p className="text-gray-400 text-sm mt-1">Check back soon!</p>
            </div>
          )}

          {/* Members Grid */}
          {!isLoading && !isError && members.length > 0 && (
            <motion.div 
              layout 
              className={`grid gap-8 ${
                isFetching ? 'opacity-60' : 'opacity-100'
              } transition-opacity ${
                members.length <= 3 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {members.map((member, index) => (
                  <MemberCard
                    key={member.id}
                    member={transformMember(member)}
                    index={index}
                    compact={true}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-3 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Page numbers */}
              <div className="flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        page === pageNum
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-3 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </motion.div>
      </section>

      {/* Join CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-amber-400/20 text-amber-300 rounded-full text-sm font-semibold mb-6 border border-amber-400/30">
            Join Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to Join Our <span className="text-amber-400">Team</span>?
          </h2>
          <p className="text-lg text-blue-200 mb-8 max-w-xl mx-auto">
            We're always looking for passionate individuals who want to make a difference. 
            Become a part of our growing community today!
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 rounded-full font-semibold hover:from-amber-300 hover:to-amber-400 transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/25"
          >
            Get In Touch
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </section>
      <Footer/>
    </div>
  );
}