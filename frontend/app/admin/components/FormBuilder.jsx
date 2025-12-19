"use client"
import { useState } from "react";

export default function FormBuilder({ activeEvent, setShowFormBuilder }) {
  const [formFields, setFormFields] = useState([
    {
      id: Date.now(),
      label: "",
      field_name: "",
      field_type: "text",
      is_required: false,
      options: [],
    },
  ]);

  return (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-3xl rounded-lg p-6 overflow-y-auto max-h-[90vh]">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Create Registration Form – {activeEvent?.title}
        </h2>
        <button onClick={() => setShowFormBuilder(false)}>✕</button>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {formFields.map((field, index) => (
          <div
            key={field.id}
            className="border p-4 rounded-lg space-y-3 bg-gray-50"
          >
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Field Label"
                value={field.label}
                onChange={(e) => {
                  const updated = [...formFields];
                  updated[index].label = e.target.value;
                  updated[index].field_name = e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "_");
                  setFormFields(updated);
                }}
                className="flex-1 border px-3 py-2 rounded"
              />

              <select
                value={field.field_type}
                onChange={(e) => {
                  const updated = [...formFields];
                  updated[index].field_type = e.target.value;
                  updated[index].options = [];
                  setFormFields(updated);
                }}
                className="border px-3 py-2 rounded"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
                <option value="file">File</option>
              </select>
            </div>

            {/* Options */}
            {(field.field_type === "select" ||
              field.field_type === "radio") && (
              <div className="space-y-2">
                {field.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    placeholder="Option"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...formFields];
                      updated[index].options[optIndex] = e.target.value;
                      setFormFields(updated);
                    }}
                    className="w-full border px-3 py-2 rounded"
                  />
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const updated = [...formFields];
                    updated[index].options.push("");
                    setFormFields(updated);
                  }}
                  className="text-sm text-blue-600"
                >
                  + Add Option
                </button>
              </div>
            )}

            {/* Required */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={field.is_required}
                onChange={(e) => {
                  const updated = [...formFields];
                  updated[index].is_required = e.target.checked;
                  setFormFields(updated);
                }}
              />
              Required
            </label>

            <button
              onClick={() =>
                setFormFields(formFields.filter((_, i) => i !== index))
              }
              className="text-sm text-red-600"
            >
              Delete Field
            </button>
          </div>
        ))}
      </div>

      {/* Add Field */}
      <button
        onClick={() =>
          setFormFields([
            ...formFields,
            {
              id: Date.now(),
              label: "",
              field_name: "",
              field_type: "text",
              is_required: false,
              options: [],
            },
          ])
        }
        className="mt-4 px-4 py-2 border rounded"
      >
        + Add Field
      </button>

      {/* Save */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowFormBuilder(false)}
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            console.log({
              event_id: activeEvent.id,
              fields: formFields,
            });
            setShowFormBuilder(false);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Form
        </button>
      </div>
    </div>
  </div>
    );
}
