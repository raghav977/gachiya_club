"use client";
import { useState } from "react";
import { ButtonLoader } from "@/app/components/LoadingOverlay";

export default function CreateEventModal({ show, onClose, onCreate, isLoading = false }) {
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
            disabled={isLoading}
            maxLength={250}
          />

          <input
            type="date"
            required
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="w-full border px-4 py-2 rounded"
            disabled={isLoading}
          />

          <textarea
            placeholder="Description"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border px-4 py-2 rounded"
            disabled={isLoading}
            maxLength={1500}
          />
          <input type="text"
            placeholder="Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full border px-4 py-2 rounded"
            disabled={isLoading}
            maxLength={250}
          />
          
          <div className="flex items-center gap-2">
            <label className="text-sm">Published:</label>
            <input type="checkbox" checked={!!form.ispublish} onChange={(e) => setForm({ ...form, ispublish: e.target.checked })} disabled={isLoading} />
            <label className="text-sm">Active:</label>
            <input type="checkbox" checked={!!form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} disabled={isLoading} />
          </div>

          <input type="file" className="w-full border px-4 py-2 rounded" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} disabled={isLoading} />

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded" disabled={isLoading}>Cancel</button>
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 min-w-[100px] disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ButtonLoader size="sm" />
                  <span>Creating...</span>
                </>
              ) : (
                'Create'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
