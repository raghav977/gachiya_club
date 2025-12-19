"use client";
import { getEventDetail } from "@/app/api/eventRegister";
import { useState, useEffect } from "react";

export default function EditEventModal({ show, onClose, event, onSave }) {
  const [form, setForm] = useState({ title: '', startDate: '', description: '', note: '', ispublish: false, isActive: true });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchEventDetail = async(event)=>{
    try {
      const data = await getEventDetail(event.id);
      console.log("Fetched event detail:", data);

      setForm({
        title: data.data.title || '',
        startDate: data.data.startDate ? data.data?.startDate.split('T')[0] : '',
        description: data.data?.description || '',
        note: data.data?.note || '',
        ispublish: !!data.data?.isPublish,
        isActive: data.data?.isActive === undefined ? true : !!data.data?.isActive,
      });
      // set preview to existing image if present
      if (data.data?.imageURL || data.data?.imageURl || data.data?.image) {
        setPreview(data.data?.imageURL || data.data?.imageURl || data.data?.image);
      } else setPreview(null);
    } catch (error) {
      console.error("Error fetching event detail:", error);
    }
  }

  useEffect(() => {
    fetchEventDetail(event);
  }, [event]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Edit Event</h2>

        <form onSubmit={(e) => {
          e.preventDefault();
          console.log("Submitting form:", form, imageFile);
          const fd = new FormData();
          fd.append('title', form.title);
          fd.append('startDate', form.startDate);
          fd.append('description', form.description);
          fd.append('note', form.note);
          fd.append('isPublish', form.ispublish);
          fd.append('isActive', form.isActive);
          if (imageFile) fd.append('image', imageFile);

          onSave && onSave(fd);
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

          <div>
            <label className="block text-sm mb-1">Image</label>
            {preview && (
              <img src={preview} alt="preview" className="w-40 h-28 object-cover mb-2 rounded" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm">Published:</label>
            <input type="checkbox" checked={!!form.ispublish} onChange={(e) => setForm({ ...form, ispublish: e.target.checked })} />
            <label className="text-sm">Active:</label>
            <input type="checkbox" checked={!!form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
