import React, { useState } from "react";
import QRCode from "react-qr-code";
import { toast } from 'react-toastify';

export default function GeneratingQr({ visitor, onClose, onTimeInSuccess }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    if (!visitor) return null;

    const qrValue = JSON.stringify({ id: visitor.id });

    const handleTimeIn = async () => {
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            const res = await fetch(`http://localhost:8000/api/visitor-info/${visitor.id}/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to time in visitor");
            setSuccess(true);
            toast.success("Time in successfully!");
            if (onTimeInSuccess) onTimeInSuccess();
        } catch {
            setError("Failed to time in visitor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative flex flex-col items-center">
                <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">Visitor QR Code</h3>
                <QRCode value={qrValue} />
                <div className="mt-6 flex flex-col items-center gap-2 w-full">
                    {success && <div className="text-green-700 font-semibold">Time in successful!</div>}
                    {error && <div className="text-red-600 font-semibold">{error}</div>}
                    <div className="flex justify-center gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                        >
                            Close
                        </button>
                        <button
                            onClick={handleTimeIn}
                            disabled={loading || success}
                            className={`bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 ${loading || success ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                            {loading ? "Timing In..." : success ? "Timed In" : "Time In"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
