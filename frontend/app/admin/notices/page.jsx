"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllNoticesAdmin, createNotice, updateNotice } from "@/app/api/notices";
import LoadingOverlay, { ButtonLoader } from "@/app/components/LoadingOverlay";
import Skeleton from "@/app/components/Skeleton";
import toast, { Toaster } from "react-hot-toast";
import { useDebounce } from "@/app/hooks/useDebounce";

export default function AdminNoticesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  
  const queryClient = useQueryClient();

  // Debounce search
  const search = useDebounce(searchTerm, 400);

  // Query
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["adminNotices", page, limit, search],
    queryFn: () => getAllNoticesAdmin({ page, limit, search }),
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });

  const notices = data?.data ?? [];
  const totalNotices = data?.totalNotices ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalNotices / limit));

  // Mutations
  const createMutation = useMutation({
    mutationFn: createNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
      setShowCreateModal(false);
      toast.success("Notice created successfully!");
    },
    onError: () => {
      toast.error("Failed to create notice");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updateNotice(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminNotices"] });
      setShowEditModal(false);
      setSelectedNotice(null);
      toast.success("Notice updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update notice");
    },
  });

  const showFetchingOverlay = (isFetching && !isLoading) || createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notices Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Notice
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <select
          value={limit}
          onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>{n} per page</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden relative">
        <LoadingOverlay isLoading={showFetchingOverlay} message="Loading..." variant="dots" />
        
        {isLoading ? (
          <div className="p-6">
            <Skeleton variant="table" count={5} />
          </div>
        ) : isError ? (
          <div className="p-6 text-center text-red-600">Failed to load notices</div>
        ) : notices.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No notices found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {notices.map((notice) => (
                <tr key={notice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{notice.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">{notice.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${notice.is_active || notice.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {notice.is_active || notice.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => { setSelectedNotice(notice); setShowEditModal(true); }}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Showing {notices.length} of {totalNotices} notices
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <NoticeFormModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(formData) => createMutation.mutate(formData)}
          isLoading={createMutation.isPending}
          title="Create Notice"
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedNotice && (
        <NoticeFormModal
          notice={selectedNotice}
          onClose={() => { setShowEditModal(false); setSelectedNotice(null); }}
          onSubmit={(formData) => updateMutation.mutate({ id: selectedNotice.id, formData })}
          isLoading={updateMutation.isPending}
          title="Edit Notice"
        />
      )}
    </div>
  );
}

// Notice Form Modal Component
function NoticeFormModal({ notice, onClose, onSubmit, isLoading, title }) {
  const [form, setForm] = useState({
    title: notice?.title || '',
    description: notice?.description || '',
    is_active: notice?.is_active ?? notice?.isActive ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('is_active', form.is_active);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={isLoading}
              maxLength={250}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={isLoading}
              maxLength={1500}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
              disabled={isLoading}
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? <><ButtonLoader size="sm" /> Saving...</> : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}