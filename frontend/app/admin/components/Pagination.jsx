"use client";

export default function Pagination({ page, totalPages, onPrev, onNext, limit, onLimitChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button onClick={onPrev} className="px-3 py-1 border rounded" disabled={page <= 1}>
          Prev
        </button>
        <button onClick={onNext} className="px-3 py-1 border rounded" disabled={page >= totalPages}>
          Next
        </button>
        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">Per page:</label>
        <select value={limit} onChange={onLimitChange} className="border px-2 py-1 rounded">
          <option value={3}>3</option>
          <option value={6}>6</option>
          <option value={9}>9</option>
          <option value={12}>12</option>
        </select>
      </div>
    </div>
  );
}
