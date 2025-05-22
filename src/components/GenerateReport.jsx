import { useState } from "react";
import { FaCalendarAlt, FaFileAlt, FaDownload } from "react-icons/fa";

export default function GenerateReport() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('');

    const handleGenerateReport = (e) => {
        e.preventDefault();
        console.log('Generating report with:', { startDate, endDate, reportType });
    };

    const handleClearFilters = () => {
        setStartDate('');
        setEndDate('');
        setReportType('');
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f6fdf4] overflow-hidden items-center">
            <div className="flex-grow w-full bg-[#f6fdf4]">
                <h2 className="text-lg font-bold text-gray-800 mb-6 pb-2">Generate Report</h2>

                <form onSubmit={handleGenerateReport}>
                    <div className="mb-6">
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaFileAlt className="text-gray-600" />Type of Report</label>
                        <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full border border-gray-300 rounded p-2">
                            <option value="">Type of Report</option>
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <FaCalendarAlt className="text-gray-600" />
                                Start Date
                            </label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded p-2" />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"><FaCalendarAlt className="text-gray-600" />End Date</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-gray-300 rounded p-2" />
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button type="button" onClick={handleClearFilters} className="bg-yellow-500 hover:bg-[#fbc02d] text-white font-semibold px-6 py-2 rounded" >Clear Filters</button>
                        <button type="submit" className="bg-green-800 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded flex items-center gap-2" > <FaDownload /> Generate Report </button>
                    </div>
                </form>
            </div>

            {/* Fixed Footer */}
            <footer className="fixed bottom-0 left-64 w-[calc(100%-16rem)] text-center py-3 bg-[#a4d4a0] text-sm text-[#2e2e2e] font-medium">
                Lacsandile Medical Clinic and Diagnostic Center (LMCDDC)
            </footer>
        </div>
    );
}
