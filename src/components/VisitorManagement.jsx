import React, { useEffect, useState } from 'react';
import { FaUserEdit, FaQrcode, FaSignOutAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import AddAppointmentModal from "./AddAppointmentModal";
import GeneratingQr from "./GeneratingQr";
import UpdateVisitorModal from "./UpdateVisitorModal";

export default function VisitorManagement() {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showQRPrompt, setShowQRPrompt] = useState(false);
    const [qrVisitor, setQrVisitor] = useState(null);
    const [editVisitor, setEditVisitor] = useState(null);
    const [showTimeOutModal, setShowTimeOutModal] = useState(false);
    const [timeOutVisitor, setTimeOutVisitor] = useState(null);

    // Fetch visitors from backend
    const fetchVisitors = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/visitor-list/");
            if (!res.ok) throw new Error("Failed to fetch visitors");
            const data = await res.json();
            setVisitors(data);
        } catch {
            /* ignore error */
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
        // Remove polling for every 5 seconds
        // const interval = setInterval(fetchVisitors, 5000);
        // return () => clearInterval(interval);
    }, []);

    const filteredVisitors = visitors.filter((v) => {
        const name = `${v.last_name} ${v.first_name} ${v.middle_initial}`.toLowerCase();
        const purpose = (v.purpose === 'Other' ? v.purpose_other : v.purpose).toLowerCase();
        const department = (v.department === 'Other' ? v.department_other : v.department).toLowerCase();
        return (
            name.includes(searchTerm.toLowerCase()) ||
            purpose.includes(searchTerm.toLowerCase()) ||
            department.includes(searchTerm.toLowerCase())
        );
    });

    // Handler for AddAppointmentModal success
    const handleAddVisitorSuccess = async () => {
        setShowAddModal(false);
        setShowQRPrompt(true);
        // Immediately fetch updated visitors after registration
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/visitor-list/");
            if (res.ok) {
                const data = await res.json();
                setVisitors(data);
            }
        } catch {
            /* ignore error */
        } finally {
            setLoading(false);
        }
    };

    // Handler for editing a visitor
    const handleEditVisitor = (visitor) => {
        setEditVisitor(visitor);
    };

    const handleEditVisitorSubmit = async (formData) => {
        setLoading(true);
        try {
            const payload = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                middle_initial: formData.middleInitial,
                age: formData.age,
                address: formData.address,
                contact_number: formData.contactNumber,
                purpose: formData.purpose === "Other" ? (formData.purposeOther || "Other") : formData.purpose,
                purpose_other: formData.purpose === "Other" ? (formData.purposeOther || "") : "",
                department: formData.department === "Other" ? (formData.departmentOther || "Other") : formData.department,
                department_other: formData.department === "Other" ? (formData.departmentOther || "") : "",
                date: formData.date,
                time: formData.time,
            };
            const res = await fetch(`http://localhost:8000/api/visitor-info/${editVisitor.id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to update visitor");
            await fetchVisitors();
            setEditVisitor(null);
        } catch {
            // Optionally show error
        } finally {
            setLoading(false);
        }
    };

    // Handler for Time Out
    const handleTimeOut = (visitor) => {
        setTimeOutVisitor(visitor);
        setShowTimeOutModal(true);
    };

    const handleTimeOutConfirm = async () => {
        if (!timeOutVisitor) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/visitor-info/${timeOutVisitor.id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ time_out: new Date().toLocaleTimeString('en-GB', { hour12: false }) }),
            });
            if (!res.ok) throw new Error("Failed to time out visitor");
            toast.success("Visitor timed out successfully!");
            setShowTimeOutModal(false);
            setTimeOutVisitor(null);
            await fetchVisitors();
            // Notify other tabs to refresh logs
            localStorage.setItem('visitor-logs-refresh', Date.now().toString());
        } catch {
            toast.error("Failed to time out visitor.");
        } finally {
            setLoading(false);
        }
    };

    // Handler for Time In (QR code modal)
    const handleTimeInSuccess = async () => {
        await fetchVisitors(); // Refresh the table immediately after time in
    };

    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <AddAppointmentModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddVisitorSuccess}
            />
            {/* Edit Visitor Modal */}
            {editVisitor && (
                <UpdateVisitorModal
                    isOpen={!!editVisitor}
                    onClose={() => setEditVisitor(null)}
                    onSubmit={handleEditVisitorSubmit}
                    initialData={editVisitor}
                />
            )}
            {/* QR Prompt Modal */}
            {showQRPrompt && qrVisitor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Visitor Registered!</h3>
                        <p className="mb-6 text-center">Do you want to generate a QR code for this visitor?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowQRPrompt(false); setQrVisitor(null); }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                No, Thanks
                            </button>
                            <button
                                onClick={() => { setShowQRPrompt(false); }}
                                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                            >
                                Yes, Generate QR
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {qrVisitor && !showQRPrompt && (
                <GeneratingQr visitor={qrVisitor} onClose={() => setQrVisitor(null)} onTimeInSuccess={handleTimeInSuccess} />
            )}
            {/* Time Out Modal */}
            {showTimeOutModal && timeOutVisitor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Time Out Visitor</h3>
                        <p className="mb-6 text-center">Has the visitor's QR code been retrieved? This will record their time out.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => { setShowTimeOutModal(false); setTimeOutVisitor(null); }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTimeOutConfirm}
                                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                            >
                                Yes, Time Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800 p-2">
                        Total Visitors: {filteredVisitors.length}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                        <input
                            type="text"
                            placeholder="Search by name, purpose, or department"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            onClick={() => setSearchTerm("")}
                            className="px-3 py-2 rounded-md bg-[#f0f0f0] text-gray-700 text-sm border hover:bg-gray-200"
                        >
                            Clear
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-1 bg-green-800 text-white px-3 py-2 rounded-md text-sm hover:bg-green-900"
                        >
                            + Add Visitor
                        </button>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-md overflow-x-auto">
                    <table className="w-full min-w-[700px] text-sm text-left text-gray-700 table-fixed">
                        <thead className="bg-[#e3f1db] text-green-900">
                            <tr>
                                <th className="px-4 py-3 w-1/4">Name</th>
                                <th className="px-4 py-3 w-1/4">Purpose</th>
                                <th className="px-4 py-3 w-1/4">Department</th>
                                <th className="px-4 py-3 w-1/5">Date</th>
                                <th className="px-4 py-3 w-1/5">Time</th>
                                <th className="px-4 py-3 w-[110px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-6 text-gray-500">Loading...</td></tr>
                            ) : visitors.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-6 text-gray-500">No pre-registered visitors found.</td></tr>
                            ) : (
                                filteredVisitors.map((v) => (
                                    <tr key={v.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 truncate max-w-[180px]">{v.last_name}, {v.first_name} {v.middle_initial}</td>
                                        <td className="px-4 py-3">{v.purpose === 'Other' ? v.purpose_other : v.purpose}</td>
                                        <td className="px-4 py-3">{v.department === 'Other' ? v.department_other : v.department}</td>
                                        <td className="px-4 py-3">{v.date}</td>
                                        <td className="px-4 py-3">{v.time}</td>
                                        <td className="px-4 py-3 text-right w-[110px]">
                                            <div className="flex justify-end gap-2 min-w-[90px] items-center">
                                                <FaUserEdit
                                                    className="text-[2rem] text-gray-800 hover:text-blue-700 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1"
                                                    title="Edit visitor"
                                                    onClick={() => handleEditVisitor(v)}
                                                />
                                                <FaQrcode
                                                    className={`text-[2rem] text-gray-800 ${v.time_in && !v.time_out ? 'opacity-40 cursor-not-allowed' : 'hover:text-blue-700'} transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1`}
                                                    title="Generate QR Code"
                                                    onClick={() => {
                                                        if (v.time_in && !v.time_out) return; // Disable if already timed in but not yet timed out
                                                        // Always set time_in to the current time when generating QR
                                                        const now = new Date();
                                                        const timeIn = now.toLocaleTimeString('en-GB', { hour12: false });
                                                        setVisitors(prev => prev.map(vis => vis.id === v.id ? { ...vis, time_in: timeIn, time_out: null } : vis));
                                                        setQrVisitor(v);
                                                        setShowQRPrompt(true);
                                                        // Optionally: localStorage.setItem('visitor-logs-refresh', Date.now().toString());
                                                    }}
                                                    disabled={v.time_in && !v.time_out}
                                                />
                                                <FaSignOutAlt
                                                    className={`text-[2rem] text-gray-800 ${(!v.time_in || v.time_out) ? 'opacity-40 cursor-not-allowed' : 'hover:text-red-700'} transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full p-1`}
                                                    title="Time Out visitor"
                                                    onClick={() => {
                                                        if (!v.time_in || v.time_out) return; // Disable if not timed in or already timed out
                                                        // Always set time_out to the current time
                                                        const now = new Date();
                                                        const timeOut = now.toLocaleTimeString('en-GB', { hour12: false });
                                                        setVisitors(prev => prev.map(vis => vis.id === v.id ? { ...vis, time_out: timeOut } : vis));
                                                        handleTimeOut(v);
                                                        // Optionally: localStorage.setItem('visitor-logs-refresh', Date.now().toString());
                                                    }}
                                                    disabled={!v.time_in || v.time_out}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
