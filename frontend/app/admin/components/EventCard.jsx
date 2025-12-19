"use client";
import Image from "next/image";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function EventCard({ event, onEdit, onAddCategory, onCreateForm, onView }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <div>
        <img
          src={`${event?.imageURL}`}
          alt={event.title}
          className="w-full h-40 object-cover rounded-lg mb-4"
          width={400}
          height={160}
        />
      </div>

      <h2 className="text-lg font-semibold">{event.title}</h2>
      <p className="text-sm text-gray-500">{event.startDate}</p>
      <p className="mt-2 text-gray-700">{event.description}</p>

      <div className="mt-4 flex gap-2 flex-col">
        <div className="flex gap-2">
          <button
            className="text-sm px-3 py-1 border rounded hover:bg-gray-100"
            onClick={() => onEdit?.(event)}
          >
            Edit
          </button>
          <button
            className="text-sm px-3 py-1 border text-black-600 rounded hover:bg-black-50"
            onClick={() => onAddCategory?.(event)}
          >
            Add Category
          </button>
        </div>

        <div className="flex gap-2">
          <button
            className="text-sm px-3 py-1 border text-green-600 rounded hover:bg-green-50"
            onClick={() => onCreateForm?.(event)}
          >
            Create a Form for this
          </button>
          <Link
            className="text-sm px-3 py-1 border text-green-600 rounded hover:bg-green-50"
            href={`/admin/events/${event.id}`}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
