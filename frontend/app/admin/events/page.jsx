"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import FormBuilder from "../components/FormBuilder";
import { eventRegister, getAllEvents, updateEvent } from "@/app/api/eventRegister";
import CategoryModal from "../components/CategoryModal";
import EventCard from "../components/EventCard";
import SearchBar from "../components/SearchBar";
import CreateEventModal from "../components/CreateEventModal";
import EditEventModal from "../components/EditEventModal";

export default function EventPage() {
  const [activeEvent, setActiveEvent] = useState(null);
  const [showFormBuilder, setShowFormBuilder] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch events
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminEvents", page, limit, search],
    queryFn: () => getAllEvents({ page, limit, search }),
    staleTime: 1000 * 60, // 1 min
    keepPreviousData: true
  });

  const events = data?.data || [];
  const totalEvents = data?.totalEvents || 0;
  const totalPages = Math.max(1, Math.ceil(totalEvents / limit));

  // Mutations
  const createMutation = useMutation({
    mutationFn: eventRegister,
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
      if (newEvent?.id) queryClient.invalidateQueries({ queryKey: ["eventDetail", newEvent.id] });
      setShowCreateModal(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, form }) => updateEvent(id, form),
    onSuccess: (_, variables) => {
      const { id } = variables;
      queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
      queryClient.invalidateQueries({ queryKey: ["eventDetail", id] });
      setShowEditModal(false);
      setSelectedEvent(null);
    },
  });

  // Handlers
  const handleCreateEvent = (form) => createMutation.mutate(form);
  const handleEditSave = (form) => updateMutation.mutate({ id: selectedEvent.id, form });
  const openEdit = (event) => { setSelectedEvent(event); setShowEditModal(true); };
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const handleLimitChange = (e) => { setLimit(parseInt(e.target.value, 10) || 6); setPage(1); };
  const handleEventView = (event) => router.push(`/admin/events/${event.id}`);

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

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="px-3 py-1 border rounded" disabled={page <= 1}>Prev</button>
          <button onClick={handleNext} className="px-3 py-1 border rounded" disabled={page >= totalPages}>Next</button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Per page:</label>
          <select value={limit} onChange={handleLimitChange} className="border px-2 py-1 rounded">
            {[3, 6, 9, 12].map((n) => (<option key={n} value={n}>{n}</option>))}
          </select>
        </div>
      </div>

      {/* Event Cards */}
      {isLoading && <div>Loading events...</div>}
      {isError && <div className="text-red-600">{error?.message}</div>}
      {!isLoading && !isError && (
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
      )}

      {/* Modals */}
      {showCreateModal && <CreateEventModal show={showCreateModal} onClose={() => setShowCreateModal(false)} onCreate={handleCreateEvent} />}
      {showEditModal && selectedEvent && <EditEventModal show={showEditModal} onClose={() => setShowEditModal(false)} event={selectedEvent} onSave={handleEditSave} />}
      {showFormBuilder && <FormBuilder activeEvent={activeEvent} setShowFormBuilder={setShowFormBuilder} />}
      {categoryModal && <CategoryModal setCategoryModal={setCategoryModal} event={activeEvent} />}
    </div>
  );
}
