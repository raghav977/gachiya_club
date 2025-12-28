"use client";

import { useState, useEffect } from "react";
import { FiMail, FiEye, FiCheck, FiX } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserDetailModal from "./UserDetailModal";
import Skeleton from "@/app/components/Skeleton";
import LoadingOverlay from "@/app/components/LoadingOverlay";
import { getAllPlayers, verifyPlayer, rejectPlayer } from "@/app/api/player";
import { getAllEvents, getEventDetail } from "@/app/api/eventRegister";
import { useDebounce } from "@/app/hooks/useDebounce";
import { formatBibNumber } from "@/app/utils/formatBib";

export default function UserList() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectPlayerId, setRejectPlayerId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const queryClient = useQueryClient();

  // Debounce search term
  const search = useDebounce(searchTerm, 500);

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

  const { data: playersData, isLoading, isFetching, isError } = useQuery({
    queryKey: ["playersList", page, limit, search, selectedEvent, selectedCategory, statusFilter],
    queryFn: () =>
      getAllPlayers({
        page,
        limit,
        search,
        eventId: selectedEvent || null,
        categoryId: selectedCategory || null,
        status: statusFilter || null,
      }),
    keepPreviousData: true,
  });

  const players = playersData?.data || [];
  const total = playersData?.total || 0;
  const totals = playersData?.totals || { overall: "-", event: "-", category: "-" };

  // Verify mutation
  const verifyMutation = useMutation({
    mutationFn: verifyPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries(["playersList"]);
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectPlayer(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(["playersList"]);
      setRejectModalOpen(false);
      setRejectPlayerId(null);
      setRejectReason("");
    },
  });

  const handleVerify = (id) => {
    if (confirm("Are you sure you want to verify this player? A BIB number will be assigned and an email will be sent.")) {
      verifyMutation.mutate(id);
    }
  };

  const handleRejectClick = (id) => {
    setRejectPlayerId(id);
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = () => {
    if (rejectPlayerId) {
      rejectMutation.mutate({ id: rejectPlayerId, reason: rejectReason });
    }
  };

  // Show overlay when fetching but not initial load
  const showFetchingOverlay = isFetching && !isLoading;

  const openModal = (id) => {
    setSelectedUserId(id);
    setShowModal(true);
  };

  const getStatusBadge = (status, bibNumber) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <FiCheck className="w-3 h-3" />
            Verified {bibNumber && `• BIB #${formatBibNumber(bibNumber)}`}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <FiX className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Registered Players</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
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

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="text-sm text-gray-500">
        Total registrations: <span className="font-semibold">{total}</span> • Overall: <span className="font-semibold">{totals.overall}</span> • Event: <span className="font-semibold">{totals.event}</span> • Category: <span className="font-semibold">{totals.category}</span>
      </div>

      {/* Player Table */}
      <div className="relative min-h-[300px]">
        {/* Overlay for refetching (filter changes, pagination, search) */}
        <LoadingOverlay
          isLoading={showFetchingOverlay}
          message="Updating player list..."
          variant="dots"
        />

        {isLoading && (
          <div className="space-y-4">
            <Skeleton variant="row" count={8} />
          </div>
        )}
        {isError && <div className="text-red-500">Failed to load players</div>}
        {!isLoading && !isError && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {["ID","Name","Event","Category","Status","Rejection Reason","Contact","Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-sm font-medium text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {players.map(p => (
                  <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.fullName}</div>
                      <div className="text-xs text-gray-500">{p.email || "-"}</div>
                    </td>
                    <td className="px-4 py-3">{p.Event?.title || "-"}</td>
                    <td className="px-4 py-3">{p.Category?.title || "-"}</td>
                    <td className="px-4 py-3">
                      {getStatusBadge(p.verificationStatus, p.bibNumber)}
                    </td>
                    <td className="px-4 py-3">{p.rejectionReason || "-"}</td>
                    <td className="px-4 py-3">{p.contactNumber}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                          onClick={() => openModal(p.id)}
                        >
                          <FiEye className="w-3 h-3" /> View
                        </button>
                        {p.verificationStatus === "pending" && (
                          <>
                            <button
                              className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs disabled:opacity-50"
                              onClick={() => handleVerify(p.id)}
                              disabled={verifyMutation.isPending}
                            >
                              <FiCheck className="w-3 h-3" /> Verify
                            </button>
                            <button
                              className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs disabled:opacity-50"
                              onClick={() => handleRejectClick(p.id)}
                              disabled={rejectMutation.isPending}
                            >
                              <FiX className="w-3 h-3" /> Reject
                            </button>
                          </>
                        )}
                        {p.email && p.verificationStatus !== "pending" && (
                          <button
                            className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs"
                            onClick={() => window.location.href = `mailto:${p.email}`}
                          >
                            <FiMail className="w-3 h-3" /> Email
                          </button>
                        )}
                      </div>
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
                <div className="mb-2">
                  {getStatusBadge(p.verificationStatus, p.bibNumber)}
                </div>
                <p className="text-gray-500 text-sm">Event: {p.Event?.title || "-"}</p>
                <p className="text-gray-500 text-sm">Category: {p.Category?.title || "-"}</p>
                <p className="text-gray-500 text-sm">Contact: {p.contactNumber}</p>
                {p.email && <p className="text-gray-500 text-sm">Email: {p.email}</p>}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                  <button
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    onClick={() => openModal(p.id)}
                  >
                    <FiEye /> View
                  </button>
                  {p.verificationStatus === "pending" && (
                    <>
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50"
                        onClick={() => handleVerify(p.id)}
                        disabled={verifyMutation.isPending}
                      >
                        <FiCheck /> Verify
                      </button>
                      <button
                        className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:opacity-50"
                        onClick={() => handleRejectClick(p.id)}
                        disabled={rejectMutation.isPending}
                      >
                        <FiX /> Reject
                      </button>
                    </>
                  )}
                  {p.email && p.verificationStatus !== "pending" && (
                    <button
                      className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                      onClick={() => window.location.href = `mailto:${p.email}`}
                    >
                      <FiMail /> Email
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      </div>

      {/* User Detail Modal */}
      {showModal && (
        <UserDetailModal
          playerId={selectedUserId}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Reject Reason Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Registration</h3>
            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to reject this registration? You can optionally provide a reason.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={3}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectPlayerId(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={rejectMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {rejectMutation.isPending ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
