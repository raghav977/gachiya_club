"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/app/api/interceptor";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: event, isLoading, isError, error } = useQuery({
    queryKey: ["eventDetail", id],
    queryFn: () =>
      apiGet(`/api/event/admin/view/${id}`).then((res) => res.data),
    enabled: !!id,
    staleTime: 1000 * 60,
  });

  const imageSrc =
    event?.imageURL 

  /* ================= Skeleton ================= */
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-72 bg-gray-200 rounded-lg" />
            <div className="h-8 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-40 bg-gray-200 rounded-lg" />
            <div className="h-32 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">
        {error?.message || "Failed to load event"}
      </div>
    );
  }

  if (!event) return <div className="p-6">No event found.</div>;

  const formattedDate = event.startDate
    ? new Date(event.startDate).toLocaleDateString()
    : "";

  const categories =
    event.Categories || event.categories || event.Category || [];

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-3 gap-10">
        {/* ================= Main Content ================= */}
        <article className="lg:col-span-2">
          {imageSrc ? (
            <div className="w-full h-72 md:h-96 rounded-xl overflow-hidden mb-6 shadow-sm">
              <img
                src={imageSrc}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-72 md:h-96 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 mb-6">
              No image available
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {event.title}
          </h1>

          <p className="text-sm text-gray-500 mb-6">
            {formattedDate}
          </p>

          <div className="text-gray-700 leading-relaxed mb-8 whitespace-pre-line">
            {event.description}
          </div>

          {event.note && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-800 mb-1">
                Note
              </p>
              <p className="text-sm text-yellow-700">
                {event.note}
              </p>
            </div>
          )}
        </article>

        {/* ================= Sidebar ================= */}
        <aside className="space-y-6">
          {/* Event Meta */}
          <div className="border rounded-xl p-4">
            <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-3">
              Event Details
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`ml-1 px-2 py-0.5 rounded text-xs ${
                    event.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {event.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <span className="font-medium">Published:</span>{" "}
                {event.isPublish || event.ispublish ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-medium">Start:</span>{" "}
                {formattedDate}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="border rounded-xl p-4">
            <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-3">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((c) => (
                  <span
                    key={c.id}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                  >
                    {c.title || c.name}
                    <span className="ml-1 text-gray-400">({c.isActive ? "Active" : "Inactive"})</span>
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400">
                  No categories
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.back()}
              className="w-full px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              ← Back
            </button>
            <a
              href="/admin/events"
              className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-center hover:bg-blue-700"
            >
              View All Events
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
