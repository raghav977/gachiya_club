"use client";
import { useEffect, useState } from "react";
import FormBuilder from "../components/FormBuilder";
import { eventRegister, getAllEvents, updateEvent } from "@/app/api/eventRegister";
import CategoryModal from "../components/CategoryModal";
import EventCard from "../components/EventCard";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import CreateEventModal from "../components/CreateEventModal";
import EditEventModal from "../components/EditEventModal";
import { useRouter } from "next/navigation";

export default function EventPage() {
  const [activeEvent, setActiveEvent] = useState(null);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalEvents, setTotalEvents] = useState(0);
  const [search, setSearch] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const router = useRouter();

  // Fetch events from server
  const fetchEvents = async () => {
    try {
      const resp = await getAllEvents({ page, limit, search });
      setEvents(resp?.data || []);
      setTotalEvents(resp?.totalEvents || 0);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, limit, search]);

  // Create event
  const handleCreateEvent = async (form) => {
    try {
      await eventRegister(form);
      setShowCreateModal(false);
      setPage(1);
      fetchEvents();
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  // Edit event
  const openEdit = (event) => {
    setSelectedEvent(event);
    setShowEditModal(true);
  };

  const handleEditSave = async (form) => {
    try {
      await updateEvent(selectedEvent.id, form);
      setShowEditModal(false);
      setSelectedEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // Pagination
  const totalPages = Math.max(1, Math.ceil(totalEvents / limit));
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10) || 6);
    setPage(1);
  };

  // View event details
  const handleEventView = (event) => {
    router.push(`/admin/events/${event.id}`);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Events</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Event
        </button>
      </div>

      {/* Search */}
      <SearchBar search={search} setSearch={(val) => { setSearch(val); setPage(1); }} />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="px-3 py-1 border rounded" disabled={page <= 1}>Prev</button>
          <button onClick={handleNext} className="px-3 py-1 border rounded" disabled={page >= totalPages}>Next</button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Per page:</label>
          <select value={limit} onChange={handleLimitChange} className="border px-2 py-1 rounded">
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
          </select>
        </div>
      </div>

      {/* Event Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEdit={() => openEdit(event)}
            onAddCategory={() => { setActiveEvent(event); setCategoryModal(true); }}
            onCreateForm={() => { setActiveEvent(event); setShowFormBuilder(true); }}
            onView={() => handleEventView(event)}
          />
        ))}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateEvent}
        />
      )}

      {showEditModal && (
        <EditEventModal
          show={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedEvent(null); }}
          event={selectedEvent}
          onSave={handleEditSave}
        />
      )}

      {showFormBuilder && (
        <FormBuilder activeEvent={activeEvent} setShowFormBuilder={setShowFormBuilder} />
      )}

      {categoryModal && (
        <CategoryModal setCategoryModal={setCategoryModal} event={activeEvent} />
      )}

    </div>
  );
}
