"use client";
import { useState, useEffect } from "react";
import { FiMail, FiEye } from "react-icons/fi";
import UserDetailModal from "./UserDetailModal";
import { getAllPlayers, getPlayerDetail } from "@/app/api/player";
import { getAllEvents } from "@/app/api/eventRegister";

export default function UserList() {
  const [viewModal, setViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [players, setPlayers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totals, setTotals] = useState({ overall: null, event: null, category: null });

  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchEvents = async () => {
    try {
      const resp = await getAllEvents({ page: 1, limit: 100 });
      setEvents(resp?.data || []);
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const resp = await getAllPlayers({ page, limit, search, eventId: selectedEvent || null, categoryId: selectedCategory || null });
      setPlayers(resp?.data || []);
      setTotal(resp?.total || 0);
      setTotals(resp?.totals || { overall: null, event: null, category: null });

      // derive categories from returned players (if categories endpoint missing)
      const cats = [];
      (resp?.data || []).forEach((p) => {
        if (p.Category && !cats.find((c) => c.id === p.Category.id)) cats.push(p.Category);
      });
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load players:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [page, limit, search, selectedEvent, selectedCategory]);

  const openDetail = async (playerId) => {
    try {
      const resp = await getPlayerDetail(playerId);
      const p = resp?.data;
      setSelectedUser(p);
      setViewModal(true);
    } catch (err) {
      console.error("Failed to fetch player detail:", err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Registered Players</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-lg"
        />

        <select
          value={selectedEvent}
          onChange={(e) => {
            setSelectedEvent(e.target.value);
            setSelectedCategory("");
          }}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="">All Events</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm text-gray-600">Total registrations: {total} • Overall: {totals.overall ?? "-"} • Event: {totals.event ?? "-"} • Category: {totals.category ?? "-"}</div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Event</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Contact</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-3">{p.id}</td>
                <td className="px-6 py-3">{p.fullName}</td>
                <td className="px-6 py-3">{p.Event?.title || "-"}</td>
                <td className="px-6 py-3">{p.Category?.title || "-"}</td>
                <td className="px-6 py-3">{p.contactNumber}</td>
                <td className="px-6 py-3">{p.email || "-"}</td>
                <td className="px-6 py-3 flex gap-2">
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    onClick={() => openDetail(p.id)}
                  >
                    <FiEye /> View
                  </button>
                  <button
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                      p.email
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
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

      <div className="md:hidden flex flex-col gap-4">
        {players.map((p) => (
          <div key={p.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{p.fullName}</h2>
              <span className="text-gray-500 text-sm">ID: {p.id}</span>
            </div>
            <p className="text-gray-600">Event: {p.Event?.title || "-"}</p>
            <p className="text-gray-600">Category: {p.Category?.title || "-"}</p>
            <p className="text-gray-600">Contact: {p.contactNumber}</p>
            <div className="flex gap-2 mt-2">
              <button
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                onClick={() => openDetail(p.id)}
              >
                <FiEye /> View
              </button>
              <button
                className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                  p.email
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
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

      {viewModal && <UserDetailModal onClose={() => setViewModal(false)} data={selectedUser} />}
    </div>
  );
}
