import React, { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LOCATIONS = [
    "Outpatient Department (OPD)",
    "Laboratory / Diagnostics",
    "Pharmacy",
    "Wards / Nurse Station",
    "OB-GYN Clinic / Maternal Care Services",
    "Dental Clinic",
    "Mental Health Services",
    "Other"
];

export default function ScanningModule() {
    const [selectedLocation, setSelectedLocation] = useState("");
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [cameraActive, setCameraActive] = useState(true);
    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);


    const stopAndClearScanner = async () => {
        if (html5QrCodeRef.current) {
            try {
                if (html5QrCodeRef.current._isScanning) {
                    await html5QrCodeRef.current.stop();
                }
            } catch { /* ignore */ }
            try {
                await html5QrCodeRef.current.clear();
            } catch { /* ignore */ }
        }
    };

    useEffect(() => {
        let isMounted = true;
        let stopScanner = false;
        if (cameraActive && scannerRef.current) {
            html5QrCodeRef.current = new Html5Qrcode(scannerRef.current.id);
            html5QrCodeRef.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                async (decodedText) => {
                    if (stopScanner) return;
                    stopScanner = true;
                    setCameraActive(false);
                    setScanResult(decodedText);
                    setLoading(true);
                    setError("");
                    try {
                        const parsed = JSON.parse(decodedText);
                        const visitorId = parsed.id;
                        const res = await fetch(`http://192.168.123.244:8000/api/visitor-info/${visitorId}/`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ location: selectedLocation }),
                        });
                        if (!res.ok) throw new Error("Failed to log location");
                        setScanResult("Location logged successfully!");
                        toast.success("Location logged successfully!");
                        setCameraActive(false);
                        if (html5QrCodeRef.current && isMounted) {
                            try { await html5QrCodeRef.current.stop(); } catch { /* ignore */ }
                        }
                    } catch {
                        setError("Invalid QR or failed to log location.");
                    } finally {
                        setLoading(false);
                    }
                },
                (errMsg) => {
                    if (typeof errMsg === 'string' && errMsg.includes('No MultiFormat Readers')) return;
                    setError("Camera error: " + errMsg);
                }
            ).catch((err) => {
                setError("Camera error: " + err);
            });
        }
        return () => {
            isMounted = false;
            stopScanner = true;
            stopAndClearScanner();
        };
    }, [cameraActive, selectedLocation]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100">
            <h2 className="text-2xl font-bold mb-4">Visitor QR Scanning Module</h2>
            <select
                className="mb-4 px-4 py-2 border border-green-700 rounded shadow-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-700 transition"
                value={selectedLocation}
                onChange={async e => {
                    setSelectedLocation(e.target.value);
                    setCameraActive(false); // Stop camera to prevent race condition
                    await stopAndClearScanner();
                    setTimeout(() => setCameraActive(true), 100); // Restart camera after dropdown change
                }}
                disabled={loading}
            >
                <option value="">Select Location</option>
                {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                ))}
            </select>
            <div className="w-full flex flex-col items-center relative bg-white rounded-lg shadow-lg border border-green-700" style={{ aspectRatio: '16/9', width: 480, maxWidth: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                {cameraActive && (
                    <>
                        <div id="qr-scanner" ref={scannerRef} style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', background: '#222', position: 'relative', margin: '0 auto', top: 0, left: 0 }} />
                        {/* Overlay square for alignment */}
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: 240,
                                height: 240,
                                transform: 'translate(-50%, -50%)',
                                border: scanResult ? '4px solid #22c55e' : '4px solid #888',
                                borderRadius: 16,
                                boxSizing: 'border-box',
                                pointerEvents: 'none',
                                transition: 'border-color 0.2s',
                                zIndex: 10,
                                background: 'rgba(255,255,255,0.02)'
                            }}
                        />
                    </>
                )}
                {!cameraActive && (
                    <button
                        className="mt-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 shadow"
                        onClick={async () => {
                            setCameraActive(true);
                            setScanResult(null);
                            setError("");
                            await stopAndClearScanner();
                        }}
                    >
                        Scan Another QR
                    </button>
                )}
            </div>
            <div className="mt-4 w-full max-w-xs">
                {loading && <p className="text-green-800 text-center font-semibold">Logging location...</p>}
                {scanResult && <p className="text-green-700 text-center font-semibold">{scanResult}</p>}
                {error && <p className="text-red-600 text-center font-semibold">{error}</p>}
            </div>
            <p className="mt-8 text-gray-600 text-sm text-center">Point the camera at a visitor's QR code to log their location. The camera view is shown above for alignment.</p>
            <ToastContainer />
        </div>
    );
}
