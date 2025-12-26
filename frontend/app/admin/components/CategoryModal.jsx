"use client";
import { categoryRegister } from "@/app/api/category";
import { useState } from "react";
import { ButtonLoader } from "@/app/components/LoadingOverlay";


export default function CategoryModal({setCategoryModal,event}) {
    console.log("Event in CategoryModal:",event);
    const [categoryName, setCategoryName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        try{
            const response = await categoryRegister(categoryName,event.id);
            console.log("Category registered successfully:",await response);
            setCategoryModal(false);
        }
        catch(err){
            console.error("Error registering category:",err);
        } finally {
            setIsLoading(false);
        }
    }
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add Category to {event ? event.title : 'Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Category Name</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded"
              placeholder="Enter category name"
                value={categoryName}
                onChange={(e)=>setCategoryName(e.target.value)}
                disabled={isLoading}
                maxLength={100}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 border rounded hover:bg-gray-100"
              onClick={() => setCategoryModal(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 min-w-[120px] disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ButtonLoader size="sm" />
                  <span>Adding...</span>
                </>
              ) : (
                'Add Category'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}