"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllResourcesAdmin, createResource, updateResource } from "@/app/api/resources";
import LoadingOverlay, { ButtonLoader } from "@/app/components/LoadingOverlay";
import Skeleton from "@/app/components/Skeleton";
import toast, { Toaster } from "react-hot-toast";
import { useDebounce } from "@/app/hooks/useDebounce";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function AdminResourcesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  
  const queryClient = useQueryClient();

  // Debounce search
  const search = useDebounce(searchTerm, 400);

  // Query
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["adminResources", page, limit, search],
    queryFn: () => getAllResourcesAdmin({ page, limit, search }),
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });

  const resources = data?.data?.resources ?? data?.data ?? [];
  const totalResources = data?.data?.totalResources ?? resources.length;
  const totalPages = Math.max(1, Math.ceil(totalResources / limit));

  // Mutations
  const createMutation = useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminResources"] });
      setShowCreateModal(false);
      toast.success("Resource created successfully!");
    },
    onError: () => {
      toast.error("Failed to create resource");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updateResource(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminResources"] });
      setShowEditModal(false);
      setSelectedResource(null);
      toast.success("Resource updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update resource");
    },
  });

  const showFetchingOverlay = (isFetching && !isLoading) || createMutation.isPending || updateMutation.isPending;

  // Get file URL
  const getFileUrl = (resource) => {
    const url = resource.url || resource.fileUrl || resource.file;
    if (!url) return null;
    if (url.startsWith('http')) return url;
    // Extract filename from path
    const filename = url.split('/').pop();
    return `${BACKEND_URL}/uploads/${filename}`;
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resources Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Resource
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
            placeholder="Search resources..."
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
          <div className="p-6 text-center text-red-600">Failed to load resources</div>
        ) : resources.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No resources found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getFileUrl(resource) ? (
                      <a
                        href={getFileUrl(resource)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View File
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No file</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${resource.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {resource.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(resource.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => { setSelectedResource(resource); setShowEditModal(true); }}
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
          Showing {resources.length} of {totalResources} resources
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
        <ResourceFormModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(formData) => createMutation.mutate(formData)}
          isLoading={createMutation.isPending}
          title="Upload Resource"
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedResource && (
        <ResourceFormModal
          resource={selectedResource}
          onClose={() => { setShowEditModal(false); setSelectedResource(null); }}
          onSubmit={(formData) => updateMutation.mutate({ id: selectedResource.id, formData })}
          isLoading={updateMutation.isPending}
          title="Edit Resource"
        />
      )}
    </div>
  );
}

// Resource Form Modal Component
function ResourceFormModal({ resource, onClose, onSubmit, isLoading, title }) {
  const [form, setForm] = useState({
    name: resource?.name || '',
    isActive: resource?.isActive ?? true,
  });
  const [file, setFile] = useState(null);

  // Get existing file URL for display
  const getExistingFileUrl = () => {
    const url = resource?.url || resource?.fileUrl || resource?.file;
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const filename = url.split('/').pop();
    return `${BACKEND_URL}/uploads/${filename}`;
  };

  const existingFileUrl = resource ? getExistingFileUrl() : null;
  const existingFileName = resource?.url ? resource.url.split('/').pop() : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('isActive', form.isActive);
    if (file) formData.append('file', file);
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={isLoading}
              maxLength={250}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File {resource ? '(leave empty to keep current)' : ''}
            </label>
            
            {/* Show existing file if editing */}
            {resource && existingFileUrl && !file && (
              <div className="mb-2 p-3 bg-gray-50 border rounded-lg flex items-center gap-3">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{existingFileName}</p>
                  <a 
                    href={existingFileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View current file
                  </a>
                </div>
              </div>
            )}
            
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={isLoading}
              required={!resource}
            />
            {file && (
              <p className="text-sm text-green-600 mt-1">New file selected: {file.name}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded"
              disabled={isLoading}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
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