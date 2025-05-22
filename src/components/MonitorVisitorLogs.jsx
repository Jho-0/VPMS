import { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

export default function MonitorVisitorLogs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [visitors, setVisitors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    useEffect(() => {
        const fetchVisitors = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/visitor-list/");
                if (!res.ok) throw new Error("Failed to fetch visitors");
                const data = await res.json();
                setVisitors(data);
            } catch {
                setVisitors([]);
            }
        };
        fetchVisitors();
        // Listen for storage events to update logs if another tab times out a visitor
        const onStorage = (e) => {
            if (e.key === 'visitor-logs-refresh') fetchVisitors();
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // Only show current visitors: have time_in but no time_out
    const currentVisitors = visitors.filter(v => v.time_in && !v.time_out);

    // Search by name, purpose, department, or location
    const filteredVisitors = currentVisitors.filter((v) => {
        const name = `${v.last_name} ${v.first_name} ${v.middle_initial}`.toLowerCase();
        const purpose = (v.purpose === 'Other' ? v.purpose_other : v.purpose).toLowerCase();
        const department = (v.department === 'Other' ? v.department_other : v.department).toLowerCase();
        const latestLocation = (v.location_history && v.location_history.length > 0)
            ? v.location_history[v.location_history.length - 1].location.toLowerCase()
            : "";
        return (
            name.includes(searchTerm.toLowerCase()) ||
            purpose.includes(searchTerm.toLowerCase()) ||
            department.includes(searchTerm.toLowerCase()) ||
            latestLocation.includes(searchTerm.toLowerCase())
        );
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);
    const paginatedVisitors = filteredVisitors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Helper for latest location
    const getLatestLocation = (v) => {
        if (v.location_history && v.location_history.length > 0) {
            return v.location_history[v.location_history.length - 1].location;
        }
        return "-";
    };

    // Helper for time formatting
    const formatTime = (t) => t ? t.slice(0, 5) : "-";

    return (
        <div className="flex-grow min-h-screen bg-[#f6fdf4] overflow-hidden">
            <div className="flex-grow w-full bg-[#f6fdf4]">
                <div className="bg-[#f6fdf4] rounded-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800 p-2">
                            Current Visitors: {filteredVisitors.length}
                        </h2>
                        <div className="flex gap-2 items-center pr-1">
                            <input
                                type="text"
                                placeholder="Search by name, purpose, department, or location"
                                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />

                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-md shadow-sm">
                        <table className="w-full text-sm text-left text-gray-700">
                            <thead className="bg-[#e3f1db] text-gray-800">
                                <tr>
                                    <th className="px-4 py-3">Visitor Name</th>
                                    <th className="px-4 py-3">Purpose of Visit</th>
                                    <th className="px-4 py-3">Department to Visit</th>
                                    <th className="px-4 py-3">Current Location</th>
                                    <th className="px-4 py-3">Time In</th>
                                    <th className="px-4 py-3">Time Out</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedVisitors.length > 0 ? (
                                    paginatedVisitors.map((v, idx) => (
                                        <tr key={v.id || idx}>
                                            <td className="px-4 py-2">{v.last_name}, {v.first_name} {v.middle_initial}</td>
                                            <td className="px-4 py-2">{v.purpose === 'Other' ? v.purpose_other : v.purpose}</td>
                                            <td className="px-4 py-2">{v.department === 'Other' ? v.department_other : v.department}</td>
                                            <td className="px-4 py-2">{getLatestLocation(v)}</td>
                                            <td className="px-4 py-2">{formatTime(v.time_in)}</td>
                                            <td className="px-4 py-2">{formatTime(v.time_out)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-gray-500">No current visitors found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Controls - only show if more than 1 page */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
                                <div className="ml-2">
                                    Results: {filteredVisitors.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage + 1)}-{Math.min(currentPage * itemsPerPage, filteredVisitors.length)} of {filteredVisitors.length}
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        className="px-2 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >&lt;</button>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            className={`px-3 py-1 border rounded font-semibold ${currentPage === i + 1 ? 'bg-green-800 text-white' : 'bg-white hover:bg-gray-100'}`}
                                            onClick={() => setCurrentPage(i + 1)}
                                        >{i + 1}</button>
                                    ))}
                                    <button
                                        className="px-2 py-1 bg-white border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                    >&gt;</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <footer className="fixed bottom-0 left-64 w-[calc(100%-16rem)] text-center py-3 bg-[#a4d4a0] text-sm text-[#2e2e2e] font-medium">
                    Lacsandile Medical Clinic and Diagnostic Center (LMCDDC)
                </footer>
            </div>
        </div>
    );
}
