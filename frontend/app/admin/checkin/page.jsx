"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiSearch, FiCheck, FiUser, FiHash, FiPhone, FiMail, FiFilter } from "react-icons/fi";
import { getAllPlayers } from "@/app/api/player";
import { getAllEvents, getEventDetail } from "@/app/api/eventRegister";
import { useDebounce } from "@/app/hooks/useDebounce";
import Skeleton from "@/app/components/Skeleton";
import { formatBibNumber } from "@/app/utils/formatBib";

export default function CheckInPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bibSearch, setBibSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Debounce searches
  const debouncedSearch = useDebounce(searchTerm, 400);
  const debouncedBib = useDebounce(bibSearch, 400);

  // Fetch events
  const { data: eventsData = [] } = useQuery({
    queryKey: ["eventsList"],
    queryFn: () => getAllEvents({ page: 1, limit: 100 }).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch categories when event changes
  useEffect(() => {
    if (!selectedEvent) {
      setCategories([]);
      setSelectedCategory("");
      return;
    }

    const fetchCategories = async () => {
      try {
        const res = await getEventDetail(selectedEvent);
        const eventCategories = res.data?.Categories || [];
        setCategories(eventCategories);
        setSelectedCategory("");
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [selectedEvent]);

  // Fetch verified players only
  const { data: playersData, isLoading, isFetching } = useQuery({
    queryKey: ["verifiedPlayers", page, limit, debouncedSearch, debouncedBib, selectedEvent, selectedCategory],
    queryFn: () =>
      getAllPlayers({
        page,
        limit,
        search: debouncedSearch || null,
        bibNumber: debouncedBib || null,
        eventId: selectedEvent || null,
        categoryId: selectedCategory || null,
        status: "verified",
      }),
    keepPreviousData: true,
  });

  const players = playersData?.data || [];
  const total = playersData?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Get selected event title
  const selectedEventTitle = eventsData?.find((e) => e.id === parseInt(selectedEvent))?.title || "";
  const selectedCategoryTitle = categories?.find((c) => c.id === parseInt(selectedCategory))?.title || "";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FiCheck className="text-green-600" />
          BIB Check-In
        </h1>
        <p className="text-gray-600 mt-1">
          Verify participants at event check-in by searching BIB number or name
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* BIB Number Search - Primary */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiHash className="inline mr-1" /> BIB Number
            </label>
            <div className="relative">
              <input
                type="number"
                value={bibSearch}
                onChange={(e) => {
                  setBibSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Enter BIB #"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-lg font-semibold"
              />
              <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Name/Email Search */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiSearch className="inline mr-1" /> Name / Email
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search participant..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Event Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiFilter className="inline mr-1" /> Event
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => {
                setSelectedEvent(e.target.value);
                setPage(1);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">All Events</option>
              {eventsData?.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FiFilter className="inline mr-1" /> Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              disabled={!selectedEvent || categories.length === 0}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title} {cat.bibStart && cat.bibEnd ? `(BIB: ${cat.bibStart}-${cat.bibEnd})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex gap-4 mt-4 pt-4 border-t">
          <span className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{players.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{total}</span> verified participants
          </span>
          {selectedEventTitle && (
            <span className="text-sm text-blue-600">
              Event: <span className="font-medium">{selectedEventTitle}</span>
            </span>
          )}
          {selectedCategoryTitle && (
            <span className="text-sm text-green-600">
              Category: <span className="font-medium">{selectedCategoryTitle}</span>
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <Skeleton variant="row" count={5} />
          </div>
        ) : players.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No verified participants found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">BIB #</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Participant</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">T-Shirt</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isFetching ? "opacity-60" : ""}`}>
                  {players.map((player) => (
                    <tr
                      key={player.id}
                      className="hover:bg-green-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-16 h-10 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-lg shadow">
                          {player.bibNumber ? formatBibNumber(player.bibNumber) : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                            {player.fullName?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{player.fullName}</p>
                            <p className="text-sm text-gray-500">{player.email || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{player.Category?.title || "—"}</p>
                          <p className="text-sm text-gray-500">{player.Event?.title || "—"}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FiPhone className="w-4 h-4" />
                          <span>{player.contactNumber || "—"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {player.TshirtSize || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          <FiCheck className="w-4 h-4" />
                          Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 p-4 border-t">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick BIB Lookup Card */}
      {bibSearch && players.length === 1 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-2xl p-6 max-w-sm border-2 border-green-500 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-2xl rounded-xl flex items-center justify-center">
              {formatBibNumber(players[0].bibNumber)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{players[0].fullName}</h3>
              <p className="text-green-600 font-medium">{players[0].Category?.title}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <FiPhone className="w-4 h-4" />
              <span>{players[0].contactNumber}</span>
            </div>
            {players[0].email && (
              <div className="flex items-center gap-2 text-gray-600">
                <FiMail className="w-4 h-4" />
                <span>{players[0].email}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">T-Shirt:</span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">{players[0].TshirtSize}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2 text-green-600 font-semibold">
            <FiCheck className="w-5 h-5" />
            Ready for Check-In
          </div>
        </div>
      )}
    </div>
  );
}
