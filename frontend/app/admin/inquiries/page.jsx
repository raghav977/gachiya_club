"use client";

import { useState } from "react";
import { FiEye, FiMail, FiCheck, FiClock, FiLoader, FiX } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllInquiries, getInquiryDetail, updateInquiryStatus } from "@/app/api/inquiries.js";
import { useDebounce } from "@/app/hooks/useDebounce";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
};

const statusIcons = {
  pending: <FiClock className="inline mr-1" />,
  in_progress: <FiLoader className="inline mr-1" />,
  resolved: <FiCheck className="inline mr-1" />,
};

export default function InquiriesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Debounce search term
  const search = useDebounce(searchTerm, 500);

  // Fetch inquiries
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["inquiries", page, limit, statusFilter, search],
    queryFn: () => getAllInquiries({ page, limit, status: statusFilter, search }),
    keepPreviousData: true,
  });
  console.log("Inquiries Data:", data);

  const inquiries = data?.data || [];
  const totalInquiries = data?.totalInquiries || 0;
  const totalPages = Math.ceil(totalInquiries / limit);

  // Fetch inquiry detail
  const { data: detailData, isLoading: detailLoading } = useQuery({
    queryKey: ["inquiryDetail", selectedInquiry],
    queryFn: () => getInquiryDetail(selectedInquiry),
    enabled: !!selectedInquiry,
  });

  const inquiryDetail = detailData?.data;

  // Status update mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateInquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["inquiries"]);
      queryClient.invalidateQueries(["inquiryDetail"]);
    },
  });

  const openModal = (id) => {
    setSelectedInquiry(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInquiry(null);
  };

  const handleStatusChange = (id, newStatus) => {
    statusMutation.mutate({ id, status: newStatus });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Inquiries</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

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
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      <div className="text-sm text-gray-500">
        Total inquiries: <span className="font-semibold">{totalInquiries}</span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-100 h-16 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {isError && <div className="text-red-500">Failed to load inquiries</div>}

      {/* Inquiries Table */}
      {!isLoading && !isError && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow relative">
            {isFetching && !isLoading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiLoader className="animate-spin" />
                  <span>Updating...</span>
                </div>
              </div>
            )}
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {["ID", "Name", "Email", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No inquiries found
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inq) => (
                    <tr key={inq.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-3">{inq.id}</td>
                      <td className="px-6 py-3 font-medium">{inq.name}</td>
                      <td className="px-6 py-3">{inq.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inq.status]}`}>
                          {statusIcons[inq.status]}
                          {inq.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-500">{formatDate(inq.createdAt)}</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                            onClick={() => openModal(inq.id)}
                          >
                            <FiEye /> View
                          </button>
                          <button
                            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                            onClick={() => (window.location.href = `mailto:${inq.email}`)}
                          >
                            <FiMail /> Reply
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {inquiries.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No inquiries found</div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="bg-white shadow rounded-lg p-4 space-y-2 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-lg">{inq.name}</h2>
                      <p className="text-gray-500 text-sm">{inq.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inq.status]}`}>
                      {statusIcons[inq.status]}
                      {inq.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{formatDate(inq.createdAt)}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      onClick={() => openModal(inq.id)}
                    >
                      <FiEye /> View
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      onClick={() => (window.location.href = `mailto:${inq.email}`)}
                    >
                      <FiMail /> Reply
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Inquiry Details</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            {detailLoading ? (
              <div className="p-6 flex items-center justify-center">
                <FiLoader className="animate-spin text-2xl text-blue-600" />
              </div>
            ) : inquiryDetail ? (
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-gray-500">From</label>
                  <p className="font-medium">{inquiryDetail.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{inquiryDetail.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Date</label>
                  <p className="font-medium">{formatDate(inquiryDetail.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    <select
                      value={inquiryDetail.status}
                      onChange={(e) => handleStatusChange(inquiryDetail.id, e.target.value)}
                      disabled={statusMutation.isPending}
                      className={`px-3 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        statusMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    {statusMutation.isPending && <FiLoader className="animate-spin text-blue-600" />}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Message</label>
                  <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                    <p className="whitespace-pre-wrap text-gray-700">{inquiryDetail.message}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={() => (window.location.href = `mailto:${inquiryDetail.email}`)}
                  >
                    <FiMail /> Reply via Email
                  </button>
                  <button
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">Inquiry not found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}