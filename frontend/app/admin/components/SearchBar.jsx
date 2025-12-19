"use client";

export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search events..."
      value={search}
      onChange={(e) => { setSearch(e.target.value); }}
      className="w-full border px-4 py-2 rounded-lg"
    />
  );
}
