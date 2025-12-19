"use client";
import { useState } from "react";

export default function CreateEventModal({ show, onClose, onCreate }) {
  const [form, setForm] = useState({ title: '', startDate: '', description: '', image: null,note:'', ispublish: false, isActive: true });

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Create Event</h2>

        <form onSubmit={(e) => {
          e.preventDefault();
          onCreate && onCreate(form);
        }} className="space-y-4">
          <input
            type="text"
            placeholder="Event Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="date"
            required
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full border px-4 py-2 rounded"
          />

          <textarea
            placeholder="Description"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border px-4 py-2 rounded"
          />
          <input type="text"
            placeholder="Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full border px-4 py-2 rounded"
          />
          
          <div className="flex items-center gap-2">
            <label className="text-sm">Published:</label>
            <input type="checkbox" checked={!!form.ispublish} onChange={(e) => setForm({ ...form, ispublish: e.target.checked })} />
            <label className="text-sm">Active:</label>
            <input type="checkbox" checked={!!form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          </div>

          <input type="file" className="w-full border px-4 py-2 rounded" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
