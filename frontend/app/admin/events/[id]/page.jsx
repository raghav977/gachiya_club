"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/app/api/interceptor";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // Fetch event detail
  const { data: event, isLoading, isError, error } = useQuery({
    queryKey: ["eventDetail", id],
    queryFn: () => apiGet(`/api/event/admin/view/${id}`).then(res => res.data),
    enabled: !!id,
    staleTime: 1000 * 60,
  });

  const imageSrc = (event && (event.imageURl || event.imageURL)) ? `${BACKEND_URL}/${(event.imageURl || event.imageURL)}` : null;

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError) return <div className="p-6 text-red-600">{error?.message || "Failed to load event"}</div>;
  if (!event) return <div className="p-6">No event found.</div>;

  const formattedDate = event.startDate ? new Date(event.startDate).toLocaleDateString() : "";
  const categories = event.Categories || event.categories || event.Category || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <article className="lg:col-span-2">
          {imageSrc ? (
            <div className="w-full h-64 md:h-96 overflow-hidden rounded-lg mb-6">
              <img src={imageSrc} alt={event.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-64 md:h-96 bg-gray-100 rounded-lg mb-6 flex items-center justify-center text-gray-400">No image</div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
          <div className="text-sm text-gray-500 mb-6">{formattedDate}</div>
          <div className="prose max-w-none mb-6"><p>{event.description}</p></div>
          {event.note && (
            <div className="bg-yellow-50 border-l-4 border-yellow-300 p-4 rounded mb-6">
              <strong className="block text-sm text-yellow-800">Note</strong>
              <p className="text-sm text-yellow-700">{event.note}</p>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="p-4 border rounded">
            <h3 className="text-sm text-gray-500">Event details</h3>
            <div className="mt-2">
              <div className="text-sm"><strong>Status:</strong> {event.isActive ? 'Active' : 'Inactive'}</div>
              <div className="text-sm"><strong>Published:</strong> {event.isPublish || event.ispublish ? 'Yes' : 'No'}</div>
              <div className="text-sm"><strong>Start:</strong> {formattedDate}</div>
            </div>
          </div>

          <div className="p-4 border rounded">
            <h3 className="text-sm text-gray-500">Categories</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Array.isArray(categories) && categories.length>0) ? categories.map((c) => (
                <span key={c.id || c.title} className="text-xs px-2 py-1 bg-gray-100 rounded">{c.title || c.name}</span>
              )) : <div className="text-sm text-gray-500">No categories</div>}
            </div>
          </div>

          <div className="p-4 border rounded flex flex-col gap-2">
            <button onClick={() => router.back()} className="px-3 py-2 bg-gray-100 rounded">Back</button>
            <a href={`/admin/events`} className="px-3 py-2 text-center bg-blue-600 text-white rounded">All events</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
