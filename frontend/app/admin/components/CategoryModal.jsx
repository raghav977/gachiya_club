"use client";
import { categoryRegister } from "@/app/api/category";
import { useState } from "react";
import { ButtonLoader } from "@/app/components/LoadingOverlay";


export default function CategoryModal({setCategoryModal,event}) {
    // console.log("Event in CategoryModal:",event);
    const [categoryName, setCategoryName] = useState("");
    const [bibStart, setBibStart] = useState("");
    const [bibEnd, setBibEnd] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        // Validate BIB range
        const bibStartNum = bibStart ? parseInt(bibStart) : null;
        const bibEndNum = bibEnd ? parseInt(bibEnd) : null;
        
        if ((bibStartNum && !bibEndNum) || (!bibStartNum && bibEndNum)) {
            alert("Please enter both BIB start and end, or leave both empty");
            return;
        }
        
        if (bibStartNum && bibEndNum && bibStartNum >= bibEndNum) {
            alert("BIB start must be less than BIB end");
            return;
        }
        
        setIsLoading(true);
        try{
            const response = await categoryRegister(categoryName, event.id, bibStartNum, bibEndNum);
            // console.log("Category registered successfully:",await response);
            setCategoryModal(false);
        }
        catch(err){
            console.error("Error registering category:",err);
        } finally {
            setIsLoading(false);
        }
    }
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Category to {event ? event.title : 'Event'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 text-sm font-medium">Category Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="e.g., 5 KM Run, 10 KM Run"
              value={categoryName}
              onChange={(e)=>setCategoryName(e.target.value)}
              disabled={isLoading}
              maxLength={100}
              required
            />
          </div>
          
          {/* BIB Number Range */}
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <label className="block text-blue-800 mb-2 text-sm font-medium">
              BIB Number Range
              <span className="text-blue-600 font-normal ml-1">(for auto-assignment)</span>
            </label>
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <input
                  type="number"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Start (e.g., 1)"
                  value={bibStart}
                  onChange={(e) => setBibStart(e.target.value)}
                  disabled={isLoading}
                  min="1"
                />
              </div>
              <span className="text-gray-400">to</span>
              <div className="flex-1">
                <input
                  type="number"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="End (e.g., 500)"
                  value={bibEnd}
                  onChange={(e) => setBibEnd(e.target.value)}
                  disabled={isLoading}
                  min="1"
                />
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Example: 5km: 1-500, 10km: 501-1000
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              onClick={() => setCategoryModal(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 min-w-[120px] disabled:opacity-60 transition"
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