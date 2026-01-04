"use client";
import { getEventDetail } from "@/app/api/eventRegister";
import { categoryRegister, updateCategory } from "@/app/api/category";
import { useState, useEffect } from "react";
import { ButtonLoader } from "@/app/components/LoadingOverlay";
import toast, { Toaster } from "react-hot-toast";

export default function EditEventModal({ show, onClose, event, onSave, isLoading = false }) {
  const [form, setForm] = useState({ title: '', startDate: '', description: '', note: '', ispublish: false, isActive: true });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  
  // Categories state
  const [categories, setCategories] = useState([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  // Edit category state
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryTitle, setEditingCategoryTitle] = useState('');
  const [editingBibStart, setEditingBibStart] = useState('');
  const [editingBibEnd, setEditingBibEnd] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const fetchEventDetail = async(event)=>{
    setIsFetching(true);
    try {
      const data = await getEventDetail(event.id);
      // console.log("Fetched event detail:", data);

      setForm({
        title: data.data.title || '',
        startDate: data.data.startDate ? data.data?.startDate.split('T')[0] : '',
        description: data.data?.description || '',
        note: data.data?.note || '',
        ispublish: !!data.data?.isPublish,
        isActive: data.data?.isActive === undefined ? true : !!data.data?.isActive,
      });
      
      // Set categories
      const cats = data.data?.Categories || data.data?.categories || [];
      setCategories(cats);
      
      // set preview to existing image if present
      if (data.data?.imageURL || data.data?.imageURl || data.data?.image) {
        setPreview(data.data?.imageURL || data.data?.imageURl || data.data?.image);
      } else setPreview(null);
    } catch (error) {
      console.error("Error fetching event detail:", error);
    } finally {
      setIsFetching(false);
    }
  }

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategoryTitle.trim()) return;
    
    setIsAddingCategory(true);
    try {
      const result = await categoryRegister(newCategoryTitle.trim(), event.id);
      // Add the new category to local state
      setCategories(prev => [...prev, { id: result?.data?.id || Date.now(), title: newCategoryTitle.trim(), isActive: true }]);
      setNewCategoryTitle('');
      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Something went wrong while adding category");
    } finally {
      setIsAddingCategory(false);
    }
  };

  // Start editing a category
  const startEditingCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setEditingCategoryTitle(cat.title);
    setEditingBibStart(cat.bibStart || '');
    setEditingBibEnd(cat.bibEnd || '');
  };

  // Cancel editing
  const cancelEditingCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryTitle('');
    setEditingBibStart('');
    setEditingBibEnd('');
  };

  // Save category edit
  const saveEditingCategory = async () => {
    if (!editingCategoryTitle.trim() || !editingCategoryId) return;
    
    const bibStartNum = editingBibStart ? parseInt(editingBibStart) : null;
    const bibEndNum = editingBibEnd ? parseInt(editingBibEnd) : null;
    
    // Validate BIB range
    if ((bibStartNum && !bibEndNum) || (!bibStartNum && bibEndNum)) {
      toast.error("Please enter both BIB start and end, or leave both empty");
      return;
    }
    
    if (bibStartNum && bibEndNum && bibStartNum >= bibEndNum) {
      toast.error("BIB start must be less than BIB end");
      return;
    }
    
    setIsSavingCategory(true);
    try {
      const cat = categories.find(c => c.id === editingCategoryId);
      await updateCategory(editingCategoryId, {
        title: editingCategoryTitle.trim(),
        isActive: cat?.isActive ?? true,
        bibStart: bibStartNum,
        bibEnd: bibEndNum
      });
      
      // Update local state
      setCategories(prev => 
        prev.map(c => 
          c.id === editingCategoryId ? { 
            ...c, 
            title: editingCategoryTitle.trim(),
            bibStart: bibStartNum,
            bibEnd: bibEndNum
          } : c
        )
      );
      setEditingCategoryId(null);
      setEditingCategoryTitle('');
      setEditingBibStart('');
      setEditingBibEnd('');
      toast.success("Category updated successfully!");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Something went wrong while updating category");
    } finally {
      setIsSavingCategory(false);
    }
  };

  // Toggle category active status with API call
  const toggleCategoryActive = async (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return;
    
    const newIsActive = !cat.isActive;
    
    // Optimistic update
    setCategories(prev => 
      prev.map(c => 
        c.id === categoryId ? { ...c, isActive: newIsActive } : c
      )
    );
    
    try {
      await updateCategory(categoryId, { 
        title: cat.title, 
        isActive: newIsActive,
        bibStart: cat.bibStart,
        bibEnd: cat.bibEnd
      });
      toast.success(newIsActive ? "Category activated!" : "Category deactivated!");
    } catch (error) {
      console.error("Error toggling category:", error);
      toast.error("Something went wrong");
      // Revert on error
      setCategories(prev => 
        prev.map(c => 
          c.id === categoryId ? { ...c, isActive: cat.isActive } : c
        )
      );
    }
  };

  useEffect(() => {
    fetchEventDetail(event);
  }, [event]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50 p-4">
      <Toaster position="top-right" />
      <div className="bg-white w-full max-w-2xl rounded-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Event</h2>

        {isFetching ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-200 rounded" />
            <div className="h-28 bg-gray-200 rounded" />
            <div className="flex gap-2 justify-end">
              <div className="h-10 w-20 bg-gray-200 rounded" />
              <div className="h-10 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            // console.log("Submitting form:", form, imageFile);
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
            
            {/* Two column layout for basic fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                  type="text"
                  placeholder="Event Title"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={isLoading}
                  maxLength={250}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Description"
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isLoading}
                maxLength={1500}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <input
                type="text"
                placeholder="Note (optional)"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isLoading}
                maxLength={250}
              />
            </div>

            {/* Image Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <div className="flex items-start gap-4">
                {preview && (
                  <img src={preview} alt="preview" className="w-32 h-24 object-cover rounded border" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={isLoading}
                  className="text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setImageFile(file);
                    if (file) setPreview(URL.createObjectURL(file));
                  }}
                />
              </div>
            </div>

            {/* Categories Section */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories ({categories.length})
              </label>
              
              {/* Existing Categories */}
              {categories.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {categories.map((cat) => (
                    <div 
                      key={cat.id} 
                      className={`flex items-center gap-2 p-2 rounded-lg border ${
                        cat.isActive 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-gray-100 border-gray-200'
                      }`}
                    >
                      {editingCategoryId === cat.id ? (
                        // Editing mode - expanded view
                        <div className="w-full space-y-2">
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={editingCategoryTitle}
                              onChange={(e) => setEditingCategoryTitle(e.target.value)}
                              className="flex-1 border px-3 py-1.5 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              placeholder="Category name"
                              disabled={isSavingCategory}
                              autoFocus
                              maxLength={100}
                            />
                            <button
                              type="button"
                              onClick={saveEditingCategory}
                              disabled={isSavingCategory || !editingCategoryTitle.trim()}
                              className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                            >
                              {isSavingCategory ? <ButtonLoader size="sm" /> : '✓ Save'}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditingCategory}
                              disabled={isSavingCategory}
                              className="px-3 py-1.5 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="flex gap-2 items-center bg-blue-100/50 p-2 rounded">
                            <span className="text-xs text-blue-700 font-medium whitespace-nowrap">BIB Range:</span>
                            <input
                              type="number"
                              value={editingBibStart}
                              onChange={(e) => setEditingBibStart(e.target.value)}
                              className="w-20 border px-2 py-1 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="Start"
                              disabled={isSavingCategory}
                              min="1"
                            />
                            <span className="text-gray-400 text-sm">to</span>
                            <input
                              type="number"
                              value={editingBibEnd}
                              onChange={(e) => setEditingBibEnd(e.target.value)}
                              className="w-20 border px-2 py-1 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="End"
                              disabled={isSavingCategory}
                              min="1"
                            />
                          </div>
                        </div>
                      ) : (
                        // Display mode
                        <>
                          <div className="flex-1">
                            <span className={`text-sm font-medium ${!cat.isActive ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                              {cat.title}
                            </span>
                            {(cat.bibStart || cat.bibEnd) && (
                              <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                                BIB: {cat.bibStart}-{cat.bibEnd}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => startEditingCategory(cat)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Edit category"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleCategoryActive(cat.id)}
                            className={`p-1.5 rounded transition-colors ${
                              cat.isActive 
                                ? 'text-amber-600 hover:bg-amber-100' 
                                : 'text-green-600 hover:bg-green-100'
                            }`}
                            title={cat.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {cat.isActive ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-3">No categories yet</p>
              )}

              {/* Add New Category */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New category title..."
                  value={newCategoryTitle}
                  onChange={(e) => setNewCategoryTitle(e.target.value)}
                  className="flex-1 border px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  disabled={isLoading || isAddingCategory}
                  maxLength={100}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={!newCategoryTitle.trim() || isLoading || isAddingCategory}
                  className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {isAddingCategory ? (
                    <ButtonLoader size="sm" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                  Add
                </button>
              </div>
            </div>

            {/* Status Toggles */}
            <div className="flex items-center gap-6 border-t pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!!form.ispublish} 
                  onChange={(e) => setForm({ ...form, ispublish: e.target.checked })} 
                  disabled={isLoading}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={!!form.isActive} 
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })} 
                  disabled={isLoading}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 border-t pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50" disabled={isLoading}>Cancel</button>
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 min-w-[100px] disabled:opacity-60 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <ButtonLoader size="sm" />
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
