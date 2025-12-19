"use client";
import { useState, useEffect } from "react";

export default function EventRegistrationForm({
  selectedEvent,
  categories = [],
  selectedCategory,
  setSelectedCategory,
  onSubmit,
  onClose,
}) {
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    emergencyContact: "",
    bloodGroup: "",
    tshirtSize: "",
    eventId: selectedEvent?.id || selectedEvent?.eventId || null,
  });

  const [paymentFile, setPaymentFile] = useState(null);
  const [authFile, setAuthFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [form, paymentFile, authFile, selectedCategory]);

  const inputClass = "w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";
  const selectClass = "w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none";

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = "Full name is required";
    if (!form.address.trim()) errs.address = "Address is required";
    if (!form.dob) errs.dob = "Date of birth is required";
    if (!form.gender) errs.gender = "Gender is required";
    if (!form.email) errs.email = "Email is required";
    if (!form.phone) errs.phone = "Phone is required";
    else {
      const cleaned = form.phone.trim();
      if (!/^(98|97)\d{8}$/.test(cleaned)) errs.phone = "Phone must start with 98 or 97 and be 10 digits";
    }
    if (!selectedCategory && (categories && categories.length > 0)) errs.category = "Please select category";
    if (!form.emergencyContact) errs.emergencyContact = "Emergency contact is required";
    if (!form.bloodGroup) errs.bloodGroup = "Blood group is required";
    if (!form.tshirtSize) errs.tshirtSize = "Tshirt size is required";

    // validate files
    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    if (!paymentFile) errs.paymentFile = "Payment voucher is required";
    else if (!allowed.includes(paymentFile.type)) errs.paymentFile = "Payment voucher must be PNG, JPG or PDF";

    if (!authFile) errs.authFile = "Authentic document is required";
    else if (!allowed.includes(authFile.type)) errs.authFile = "Authentic document must be PNG, JPG or PDF";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFile = (fileSetter) => (e) => {
    const f = e.target.files[0];
    fileSetter(f || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Submitting registration:", form, selectedCategory, paymentFile, authFile);
    // prepare FormData to include files
    const fd = new FormData();
    fd.append('TshirtSize', form.tshirtSize);
    fd.append('eventId', form.eventId);
    fd.append('fullName', form.fullName);
    fd.append('address', form.address);
    fd.append('dateOfBirth', form.dob);
    fd.append('gender', form.gender);
    fd.append('email', form.email);
    fd.append('contactNumber', form.phone);
    fd.append('emergencyContact', form.emergencyContact);
    fd.append('bloodGroup', form.bloodGroup);
    if (selectedCategory) fd.append('category', selectedCategory);
    if (paymentFile) fd.append('paymentVoucher', paymentFile);
    if (authFile) fd.append('authenticateDocument', authFile);

    if (onSubmit) await onSubmit(fd);
  };

  const renderPreview = (file) => {
    if (!file) return null;
    if (file.type === 'application/pdf') {
      return (
        <div className="border rounded p-2 text-sm">
          <a href={URL.createObjectURL(file)} target="_blank" rel="noreferrer" className="text-blue-600">Open PDF</a>
        </div>
      );
    }
    // image
    return <img src={URL.createObjectURL(file)} alt="preview" className="w-32 h-20 object-cover rounded" />;
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto px-6 md:px-10 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Full Name</label>
          <input className={inputClass} type="text" value={form.fullName} onChange={(e)=>setForm({...form, fullName: e.target.value})} />
          {errors.fullName && <div className="text-xs text-red-600">{errors.fullName}</div>}
        </div>

        <div>
          <label className={labelClass}>Address</label>
          <input className={inputClass} type="text" value={form.address} onChange={(e)=>setForm({...form, address: e.target.value})} />
          {errors.address && <div className="text-xs text-red-600">{errors.address}</div>}
        </div>

        <div>
          <label className={labelClass}>Date of Birth</label>
          <input className={inputClass} type="date" value={form.dob} onChange={(e)=>setForm({...form, dob: e.target.value})} />
          {errors.dob && <div className="text-xs text-red-600">{errors.dob}</div>}
        </div>

        <div>
          <label className={labelClass}>Gender</label>
          <select className={selectClass} value={form.gender} onChange={(e)=>setForm({...form, gender: e.target.value})}>
            <option value="">Select Gender</option>
            <option value="male">Male (पुरुष)</option>
            <option value="female">Female (महिला)</option>
            <option value="other">Other (अन्य)</option>
          </select>
          {errors.gender && <div className="text-xs text-red-600">{errors.gender}</div>}
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input className={inputClass} type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} />
          {errors.email && <div className="text-xs text-red-600">{errors.email}</div>}
        </div>

        <div>
          <label className={labelClass}>Phone Number</label>
          <input className={inputClass} type="tel" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} placeholder="98xxxxxxxx" />
          {errors.phone && <div className="text-xs text-red-600">{errors.phone}</div>}
        </div>

        <div>
          <label className={labelClass}>Event to Participate</label>
          {categories && categories.length > 0 ? (
            <select className={selectClass} value={selectedCategory || ''} onChange={(e)=>setSelectedCategory(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id || c.title} value={c.id || c.title}>{c.title}</option>)}
            </select>
          ) : (
            <input className={inputClass} value={selectedEvent?.title || selectedEvent?.name || ''} readOnly />
          )}
          {errors.category && <div className="text-xs text-red-600">{errors.category}</div>}
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className={labelClass}>Emergency Contact (Name & Number)</label>
          <input className={inputClass} type="text" value={form.emergencyContact} onChange={(e)=>setForm({...form, emergencyContact: e.target.value})} />
          {errors.emergencyContact && <div className="text-xs text-red-600">{errors.emergencyContact}</div>}
        </div>

        <div>
          <label className={labelClass}>Blood Group</label>
          <select className={selectClass} value={form.bloodGroup} onChange={(e)=>setForm({...form, bloodGroup: e.target.value})}>
            <option value="">Select Blood Group</option>
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
          {errors.bloodGroup && <div className="text-xs text-red-600">{errors.bloodGroup}</div>}
        </div>
        <div>
            <label className={labelClass}>Tshirt size</label>
            <select className={selectClass} value={form.tshirtSize} onChange={(e)=>setForm({...form, tshirtSize: e.target.value})}>
                <option value="">Select Tshirt Size</option>
                {['XS','S','M','L','XL','XXL'].map(size => <option key={size} value={size}>{size}</option>)}
                </select>
                {errors.tshirtSize && <div className="text-xs text-red-600">{errors.tshirtSize}</div>}
        </div>

        <div>
          <label className={labelClass}>Payment Voucher (PNG, JPG or PDF)</label>
          <input type="file" accept="image/png,image/jpeg,application/pdf" onChange={handleFile(setPaymentFile)} className="w-full" />
          <div className="mt-2">{renderPreview(paymentFile)}</div>
          {errors.paymentFile && <div className="text-xs text-red-600">{errors.paymentFile}</div>}
        </div>

        <div>
          <label className={labelClass}>Authentic Document (ID Proof) (PNG, JPG or PDF)</label>
          <input type="file" accept="image/png,image/jpeg,application/pdf" onChange={handleFile(setAuthFile)} className="w-full" />
          <div className="mt-2">{renderPreview(authFile)}</div>
          {errors.authFile && <div className="text-xs text-red-600">{errors.authFile}</div>}
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit Registration</button>
        </div>
      </div>
    </form>
  );
}
