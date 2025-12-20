"use client";

import { useState, useEffect } from "react";
import { FiMail, FiEye } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import UserDetailModal from "./UserDetailModal";
import { getAllPlayers } from "@/app/api/player";
import { getAllEvents, getEventDetail } from "@/app/api/eventRegister";
import debounce from "lodash.debounce";

export default function UserList() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: eventsData = [] } = useQuery({
    queryKey: ["eventsList"],
    queryFn: () => getAllEvents({ page: 1, limit: 100 }).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
  const events = eventsData || [];

  useEffect(() => {
    if (!selectedEvent) {
      setCategories([]);
      setSelectedCategory("");
      return;
    }

    const fetchEventDetail = async () => {
      try {
        const res = await getEventDetail(selectedEvent);
        const eventCategories = res.data?.Categories || [];
        setCategories(eventCategories);
        setSelectedCategory("");
      } catch (err) {
        console.error("Failed to fetch event detail:", err);
        setCategories([]);
      }
    };

    fetchEventDetail();
  }, [selectedEvent]);

  const { data: playersData, isLoading, isError } = useQuery({
    queryKey: ["playersList", page, limit, search, selectedEvent, selectedCategory],
    queryFn: () =>
      getAllPlayers({
        page,
        limit,
        search,
        eventId: selectedEvent || null,
        categoryId: selectedCategory || null,
      }),
    keepPreviousData: true,
  });

  const players = playersData?.data || [];
  const total = playersData?.total || 0;
  const totals = playersData?.totals || { overall: "-", event: "-", category: "-" };

  const handleSearch = debounce(val => {
    setSearch(val);
    setPage(1);
  }, 500);

  const openModal = (id) => {
    setSelectedUserId(id);
    setShowModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Registered Players</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Events</option>
          {events.map(event => (
            <option key={event.id} value={event.id}>{event.title}</option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!selectedEvent || categories.length === 0}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-500">
        Total registrations: <span className="font-semibold">{total}</span> • Overall: <span className="font-semibold">{totals.overall}</span> • Event: <span className="font-semibold">{totals.event}</span> • Category: <span className="font-semibold">{totals.category}</span>
      </div>

      {/* Player Table */}
      {isLoading && <div className="text-gray-500">Loading players...</div>}
      {isError && <div className="text-red-500">Failed to load players</div>}
      {!isLoading && !isError && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {["ID","Name","Event","Category","Contact","Email","Actions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-sm font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map(p => (
                  <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-3">{p.id}</td>
                    <td className="px-6 py-3 font-medium">{p.fullName}</td>
                    <td className="px-6 py-3">{p.Event?.title || "-"}</td>
                    <td className="px-6 py-3">{p.Category?.title || "-"}</td>
                    <td className="px-6 py-3">{p.contactNumber}</td>
                    <td className="px-6 py-3">{p.email || "-"}</td>
                    <td className="px-6 py-3 flex gap-2">
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        onClick={() => openModal(p.id)}
                      >
                        <FiEye /> View
                      </button>
                      <button
                        className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                          p.email ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!p.email}
                        onClick={() => p.email && (window.location.href = `mailto:${p.email}`)}
                      >
                        <FiMail /> Email
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {players.map(p => (
              <div key={p.id} className="bg-white shadow rounded-lg p-4 space-y-2 hover:shadow-md transition">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-lg">{p.fullName}</h2>
                  <span className="text-gray-400 text-sm">ID: {p.id}</span>
                </div>
                <p className="text-gray-500 text-sm">Event: {p.Event?.title || "-"}</p>
                <p className="text-gray-500 text-sm">Category: {p.Category?.title || "-"}</p>
                <p className="text-gray-500 text-sm">Contact: {p.contactNumber}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    onClick={() => openModal(p.id)}
                  >
                    <FiEye /> View
                  </button>
                  <button
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                      p.email ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!p.email}
                    onClick={() => p.email && (window.location.href = `mailto:${p.email}`)}
                  >
                    <FiMail /> Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <UserDetailModal
          playerId={selectedUserId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
