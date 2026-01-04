"use client";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiUsers, FiMove, FiSave, FiX } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import {
  getAllMembersAdmin,
  createMember,
  updateMember,
  deleteMember,
  toggleMemberStatus,
  reorderMembers,
} from "@/app/api/members";
import LoadingOverlay, { ButtonLoader } from "@/app/components/LoadingOverlay";
import Skeleton from "@/app/components/Skeleton";
import { useDebounce } from "@/app/hooks/useDebounce";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

const MEMBER_TYPES = [
  { value: "executive", label: "Executive Members", color: "bg-purple-100 text-purple-800" },
  { value: "team", label: "Our Team", color: "bg-blue-100 text-blue-800" },
  { value: "member", label: "Members", color: "bg-green-100 text-green-800" },
];

export default function AdminMembersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterActive, setFilterActive] = useState("");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    description: "",
    memberType: "member",
    email: "",
    contactNumber: "",
    displayOrder: 0,
    isActive: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Reorder mode states
  const [reorderMode, setReorderMode] = useState(false);
  const [reorderType, setReorderType] = useState("executive");
  const [orderedMembers, setOrderedMembers] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  const queryClient = useQueryClient();
  const search = useDebounce(searchTerm, 400);

  // Query for main table
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["adminMembers", page, limit, search, filterType, filterActive],
    queryFn: () => getAllMembersAdmin({ page, limit, search, memberType: filterType, isActive: filterActive }),
    staleTime: 1000 * 60,
  });

  // Query for reorder mode - get all members of selected type
  const { data: reorderData, isLoading: reorderLoading } = useQuery({
    queryKey: ["reorderMembers", reorderType],
    queryFn: () => getAllMembersAdmin({ page: 1, limit: 500, memberType: reorderType, isActive: "true" }),
    enabled: reorderMode,
    staleTime: 0,
  });

  const members = data?.data ?? [];
  const totalMembers = data?.totalMembers ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalMembers / limit));

  // Mutations
  const createMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      toast.success("Member created successfully");
      queryClient.invalidateQueries({ queryKey: ["adminMembers"] });
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Failed to create member"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updateMember(id, formData),
    onSuccess: () => {
      toast.success("Member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminMembers"] });
      closeModal();
    },
    onError: (err) => toast.error(err.message || "Failed to update member"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      toast.success("Member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminMembers"] });
    },
    onError: (err) => toast.error(err.message || "Failed to delete member"),
  });

  const toggleMutation = useMutation({
    mutationFn: toggleMemberStatus,
    onSuccess: () => {
      toast.success("Member status updated");
      queryClient.invalidateQueries({ queryKey: ["adminMembers"] });
    },
    onError: (err) => toast.error(err.message || "Failed to toggle status"),
  });

  const reorderMutation = useMutation({
    mutationFn: reorderMembers,
    onSuccess: () => {
      toast.success("Order saved successfully");
      queryClient.invalidateQueries({ queryKey: ["adminMembers"] });
      queryClient.invalidateQueries({ queryKey: ["reorderMembers"] });
      setReorderMode(false);
    },
    onError: (err) => toast.error(err.message || "Failed to save order"),
  });

  const showOverlay = isFetching && !isLoading;

  // Handlers
  const openCreateModal = () => {
    setEditingMember(null);
    setFormData({
      fullName: "",
      role: "",
      description: "",
      memberType: "member",
      email: "",
      contactNumber: "",
      displayOrder: 0,
      isActive: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      fullName: member.fullName || "",
      role: member.role || "",
      description: member.description || "",
      memberType: member.memberType || "member",
      email: member.email || "",
      contactNumber: member.contactNumber || "",
      displayOrder: member.displayOrder || 0,
      isActive: member.isActive ?? true,
    });
    setImageFile(null);
    setImagePreview(member.image ? `${BACKEND_URL}/${member.image}` : null);
    setShowModal(true);
  };

  // Reorder mode handlers
  const enterReorderMode = (type = "executive") => {
    setReorderType(type);
    setReorderMode(true);
  };

  const exitReorderMode = () => {
    setReorderMode(false);
    setOrderedMembers([]);
    setDraggedItem(null);
  };

  // Initialize orderedMembers when reorderData changes
  const initOrderedMembers = useCallback(() => {
    if (reorderData?.data) {
      setOrderedMembers([...reorderData.data].sort((a, b) => a.displayOrder - b.displayOrder));
    }
  }, [reorderData]);

  // Effect to initialize when data loads
  useState(() => {
    if (reorderMode && reorderData?.data) {
      initOrderedMembers();
    }
  }, [reorderMode, reorderData, initOrderedMembers]);

  // Update ordered members when reorder data loads
  if (reorderMode && reorderData?.data && orderedMembers.length === 0 && reorderData.data.length > 0) {
    setOrderedMembers([...reorderData.data].sort((a, b) => a.displayOrder - b.displayOrder));
  }

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newList = [...orderedMembers];
    const draggedMember = newList[draggedItem];
    newList.splice(draggedItem, 1);
    newList.splice(index, 0, draggedMember);
    setOrderedMembers(newList);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const saveReorder = () => {
    const orders = orderedMembers.map((member, index) => ({
      id: member.id,
      displayOrder: index,
    }));
    reorderMutation.mutate(orders);
  };

  const getPositionBadge = (index) => {
    if (index === 0) return <span className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">🥇 1st</span>;
    if (index === 1) return <span className="px-2 py-1 bg-gray-300 text-gray-800 rounded-full text-xs font-bold">🥈 2nd</span>;
    if (index === 2) return <span className="px-2 py-1 bg-amber-600 text-white rounded-full text-xs font-bold">🥉 3rd</span>;
    return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{index + 1}th</span>;
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Submitting form data:", formData);
    const fd = new FormData();
    fd.append("fullName", formData.fullName);
    fd.append("role", formData.role);
    fd.append("description", formData.description);
    fd.append("memberType", formData.memberType);
    fd.append("email", formData.email);
    fd.append("contactNumber", formData.contactNumber);
    fd.append("displayOrder", formData.displayOrder);
    fd.append("isActive", formData.isActive);
    if (imageFile) fd.append("image", imageFile);

    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, formData: fd });
    } else {
      createMutation.mutate(fd);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this member?")) {
      deleteMutation.mutate(id);
    }
  };

  const getMemberTypeStyle = (type) => {
    return MEMBER_TYPES.find((t) => t.value === type)?.color || "bg-gray-100 text-gray-800";
  };

  // Reorder Mode UI
  if (reorderMode) {
    return (
      <div className="space-y-6">
        <Toaster position="top-right" />

        {/* Reorder Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FiMove className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reorder Members</h1>
              <p className="text-sm text-gray-500">Drag and drop to change display order</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exitReorderMode}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiX className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={saveReorder}
              disabled={reorderMutation.isPending}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {reorderMutation.isPending ? <ButtonLoader /> : <FiSave className="w-4 h-4" />}
              Save Order
            </button>
          </div>
        </div>

        {/* Type selector */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Member Type to Reorder</label>
          <select
            value={reorderType}
            onChange={(e) => {
              setReorderType(e.target.value);
              setOrderedMembers([]);
            }}
            className="w-full max-w-xs border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          >
            {MEMBER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Drag and Drop List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {reorderLoading ? (
            <div className="p-6">
              <Skeleton count={5} height={80} />
            </div>
          ) : orderedMembers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FiUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No active members found in this category</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orderedMembers.map((member, index) => (
                <div
                  key={member.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-4 p-4 cursor-grab active:cursor-grabbing transition-all ${
                    draggedItem === index ? "bg-purple-50 scale-[1.02] shadow-lg" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Position Badge */}
                  <div className="w-16 flex-shrink-0">
                    {getPositionBadge(index)}
                  </div>

                  {/* Drag Handle */}
                  <div className="flex-shrink-0 text-gray-400">
                    <FiMove className="w-5 h-5" />
                  </div>

                  {/* Member Image */}
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {member.image ? (
                      <img
                        src={`${BACKEND_URL}/${member.image}`}
                        alt={member.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-semibold">
                        {member.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{member.fullName}</div>
                    <div className="text-sm text-gray-500">{member.role || "No role"}</div>
                  </div>

                  {/* Current Order */}
                  <div className="text-sm text-gray-400">
                    Current: {member.displayOrder}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <h3 className="font-medium text-purple-900 mb-2">💡 How to Reorder</h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Drag members up or down to change their display order</li>
            <li>• The top member will appear first on the public site</li>
            <li>• Click "Save Order" to save your changes</li>
            <li>• Changes only affect the selected member type</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FiUsers className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Manage Members</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => enterReorderMode("executive")}
            className="flex items-center gap-2 border border-purple-300 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <FiMove className="w-4 h-4" />
            Reorder Members
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Types</option>
            {MEMBER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={filterActive}
            onChange={(e) => {
              setFilterActive(e.target.value);
              setPage(1);
            }}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="text-sm text-gray-600">
        Showing {members.length} of {totalMembers} members
      </div>

      {/* Table */}
      <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <LoadingOverlay isLoading={showOverlay} message="Loading..." variant="spinner" />

        {isLoading ? (
          <div className="p-6">
            <Skeleton count={5} height={60} />
          </div>
        ) : isError ? (
          <div className="p-6 text-center text-red-600">Failed to load members</div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FiUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No members found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Member</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Order</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                          {member.image ? (
                            <img
                              src={`${BACKEND_URL}/${member.image}`}
                              alt={member.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-semibold">
                              {member.fullName?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{member.fullName}</div>
                          {member.email && (
                            <div className="text-sm text-gray-500">{member.email}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{member.role || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMemberTypeStyle(member.memberType)}`}>
                        {MEMBER_TYPES.find((t) => t.value === member.memberType)?.label || member.memberType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{member.displayOrder}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleMutation.mutate(member.id)}
                        disabled={toggleMutation.isPending}
                        className="flex items-center gap-1"
                      >
                        {member.isActive ? (
                          <>
                            <FiToggleRight className="w-6 h-6 text-green-600" />
                            <span className="text-sm text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <FiToggleLeft className="w-6 h-6 text-gray-400" />
                            <span className="text-sm text-gray-400">Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingMember ? "Edit Member" : "Add New Member"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FiUsers className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position</label>
                <input
                  type="text"
                  maxLength={100}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., President, Treasurer, Team Lead"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Description / Member Saying */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description / Saying</label>
                <textarea
                  maxLength={500}
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="A quote or message from the member..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description?.length || 0}/500 characters</p>
              </div>

              {/* Member Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member Type *</label>
                <select
                  required
                  value={formData.memberType}
                  onChange={(e) => setFormData({ ...formData, memberType: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  {MEMBER_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email & Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    maxLength={100}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input
                    type="text"
                    maxLength={20}
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Display Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) && <ButtonLoader />}
                  {editingMember ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
