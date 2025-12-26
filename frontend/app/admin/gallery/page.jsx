"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  getAllGalleryAdmin,
  createGalleryImage,
  updateGalleryImage,
  toggleFeatured,
  updateFeaturedOrder,
  deleteGalleryImage,
} from "../../api/gallery";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [featuredImages, setFeaturedImages] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["adminGallery", page, search],
    queryFn: () => getAllGalleryAdmin({ page, limit: 12, search }),
  });

  const images = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 12);

  const createMutation = useMutation({
    mutationFn: createGalleryImage,
    onSuccess: () => {
      toast.success("Image uploaded successfully");
      queryClient.invalidateQueries(["adminGallery"]);
      setShowUploadModal(false);
      setUploadTitle("");
      setUploadFile(null);
    },
    onError: () => toast.error("Failed to upload image"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isFeatured }) => toggleFeatured(id, isFeatured),
    onSuccess: (_, { isFeatured }) => {
      toast.success(isFeatured ? "Added to home page" : "Removed from home page");
      queryClient.invalidateQueries(["adminGallery"]);
    },
    onError: () => toast.error("Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: () => {
      toast.success("Image deleted");
      queryClient.invalidateQueries(["adminGallery"]);
    },
    onError: () => toast.error("Failed to delete"),
  });

  const orderMutation = useMutation({
    mutationFn: updateFeaturedOrder,
    onSuccess: () => {
      toast.success("Order updated");
      queryClient.invalidateQueries(["adminGallery"]);
      setShowOrderModal(false);
    },
    onError: () => toast.error("Failed to update order"),
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!uploadFile) return toast.error("Please select an image");
    const formData = new FormData();
    formData.append("title", uploadTitle);
    formData.append("image", uploadFile);
    createMutation.mutate(formData);
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const filename = url.split("/").pop();
    return `${BACKEND_URL}/uploads/${filename}`;
  };

  const openOrderModal = () => {
    const featured = images.filter((img) => img.isFeatured);
    setFeaturedImages(featured);
    setShowOrderModal(true);
  };

  const moveImage = (index, direction) => {
    const newOrder = [...featuredImages];
    const [removed] = newOrder.splice(index, 1);
    newOrder.splice(index + direction, 0, removed);
    setFeaturedImages(newOrder);
  };

  const saveOrder = () => {
    const orderedIds = featuredImages.map((img) => img.id);
    orderMutation.mutate(orderedIds);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600">Upload and manage gallery images</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openOrderModal}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reorder Featured
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
          >
            Upload Image
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No images found</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group rounded-lg overflow-hidden border border-gray-200"
            >
              <div className="aspect-square relative">
                <img
                  src={getImageUrl(image.url)}
                  alt={image.title || "Gallery image"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Featured badge */}
              {image.isFeatured && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-xs font-semibold rounded">
                  Featured
                </div>
              )}

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white text-sm font-medium truncate mb-2">
                  {image.title || "Untitled"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      toggleMutation.mutate({
                        id: image.id,
                        isFeatured: !image.isFeatured,
                      })
                    }
                    className={`flex-1 py-1.5 text-xs font-medium rounded ${
                      image.isFeatured
                        ? "bg-gray-200 text-gray-800"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {image.isFeatured ? "Remove from Home" : "Add to Home"}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this image?")) {
                        deleteMutation.mutate(image.id);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="py-2 text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Upload Image</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Image title"
                  maxLength={250}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg disabled:opacity-50"
                >
                  {createMutation.isPending ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reorder Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reorder Featured Images</h2>
            {featuredImages.length === 0 ? (
              <p className="text-gray-500 py-4">No featured images to reorder</p>
            ) : (
              <div className="space-y-2">
                {featuredImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(image.url)}
                        alt={image.title || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{image.title || "Untitled"}</p>
                      <p className="text-sm text-gray-500">Position: {index + 1}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        className="px-2 py-1 text-sm border rounded disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveImage(index, 1)}
                        disabled={index === featuredImages.length - 1}
                        className="px-2 py-1 text-sm border rounded disabled:opacity-30"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3 justify-end mt-4">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveOrder}
                disabled={orderMutation.isPending || featuredImages.length === 0}
                className="px-4 py-2 bg-blue-900 text-white rounded-lg disabled:opacity-50"
              >
                {orderMutation.isPending ? "Saving..." : "Save Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
