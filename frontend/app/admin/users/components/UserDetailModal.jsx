"use client";

import { apiFetch, apiGet } from "@/app/api/interceptor";
import { useQuery } from "@tanstack/react-query";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function UserDetailModal({ playerId, onClose }) {
  // Only fetch if playerId exists
  const { data, isLoading, error } = useQuery({
    queryKey: ["playerDetail", playerId],
    queryFn: async () => {
      if (!playerId) return null;
      const res = await fetch(`${BACKEND_URL}/api/player/${playerId}`,{
        headers: {
          'Content-Type': 'application/json',
          
            'Authorization': `Bearer ${localStorage.getItem('admin_token') }`,
        },
      });    
      if (!res.ok) throw new Error("Failed to fetch player");
      return res.json();
    },
    enabled: !!playerId,
    staleTime: 5 * 60 * 1000,
  });

  if (!playerId) return null;
  console.log("Player detail data:", data);

  // Helper to convert server file path to URL
  const toPublicUrl = (filePath) => {
    if (!filePath) return null;
    const fileName = filePath.split("/").pop();
    return `${BACKEND_URL}/uploads/${fileName}`;
  };

  const paymentVoucherUrl = toPublicUrl(data?.data?.paymentVoucher);
  const authDocUrl = toPublicUrl(data?.data?.authenticateDocument);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg p-6 overflow-auto max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Player Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {isLoading ? (
          <p>Loading player details...</p>
        ) : error ? (
          <p className="text-red-600">Failed to load player details.</p>
        ) : !data ? (
          <p>No data found.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Name</h3>
                <p>{data?.data?.fullName || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>{data?.data?.email || "N/A"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Contact</h3>
                <p>{data?.data?.contactNumber || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Emergency Contact</h3>
                <p>{data?.data?.emergencyContact || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Date of Birth</h3>
                <p>{data?.data?.dateOfBirth || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Gender</h3>
                <p>{data?.data?.gender || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold">T-shirt Size</h3>
                <p>{data?.data?.TshirtSize || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Blood Group</h3>
                <p>{data?.data?.bloodGroup || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Event</h3>
                <p>{data?.data?.Event?.title || "-"}</p>
              </div>
              <div>
                <h3 className="font-semibold">Category</h3>
                <p>{data?.data?.Category?.title || "-"}</p>
              </div>
            </div>

            {/* Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Payment Voucher</h3>
                {paymentVoucherUrl ? (
                  <a
                    className="text-blue-600 underline"
                    href={paymentVoucherUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                ) : (
                  <p>-</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold">Authenticate Document</h3>
                {authDocUrl ? (
                  <a
                    className="text-blue-600 underline"
                    href={authDocUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open
                  </a>
                ) : (
                  <p>-</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
