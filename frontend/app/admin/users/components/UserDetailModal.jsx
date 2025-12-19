export default function UserDetailModal({ data, onClose }) {
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "";

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-2xl rounded-lg p-6 overflow-auto max-h-[80vh]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Player Details</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {!data ? (
                    <p>Loading...</p>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold">Name</h3>
                                <p>{data.fullName}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Email</h3>
                                <p>{data.email || "N/A"}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Contact</h3>
                                <p>{data.contactNumber}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Emergency Contact</h3>
                                <p>{data.emergencyContact}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Date of Birth</h3>
                                <p>{data.dateOfBirth}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Gender</h3>
                                <p>{data.gender}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold">T-shirt Size</h3>
                                <p>{data.TshirtSize}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Blood Group</h3>
                                <p>{data.bloodGroup}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold">Event</h3>
                                <p>{data.Event?.title || "-"}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold">Category</h3>
                                <p>{data.Category?.title || "-"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold">Payment Voucher</h3>
                                {data.paymentVoucher ? (
                                    <a
                                        className="text-blue-600 underline"
                                        href={`${BACKEND.replace(/\/$/, "")}/${data.paymentVoucher}`}
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
                                {data.authenticateDocument ? (
                                    <a
                                        className="text-blue-600 underline"
                                        href={`${BACKEND.replace(/\/$/, "")}/${data.authenticateDocument}`}
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