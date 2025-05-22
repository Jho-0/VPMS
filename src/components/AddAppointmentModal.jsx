import React, { useState } from "react";
import { toast } from "react-toastify";

export default function AddAppointmentModal({ isOpen, onClose }) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        middleInitial: "",
        age: "",
        address: "",
        contactNumber: "",
        purpose: "",
        department: "",
        date: "",
        time: "",
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const handleFinalSubmit = async () => {
        setLoading(true);
        // Prepare data for backend
        const payload = {
            first_name: form.firstName,
            last_name: form.lastName,
            middle_initial: form.middleInitial,
            age: form.age,
            address: form.address,
            contact_number: form.contactNumber,
            purpose: form.purpose === "Other" ? (form.purposeOther || "Other") : form.purpose,
            purpose_other: form.purpose === "Other" ? (form.purposeOther || "") : "",
            department: form.department === "Other" ? (form.departmentOther || "Other") : form.department,
            department_other: form.department === "Other" ? (form.departmentOther || "") : "",
            date: form.date,
            time: form.time,
        };
        try {
            const res = await fetch("http://192.168.100.13:8000/api/visitor/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || JSON.stringify(err));
            }
            toast.success("Registration submitted successfully!");
            setForm({
                firstName: "",
                lastName: "",
                middleInitial: "",
                age: "",
                address: "",
                contactNumber: "",
                purpose: "",
                department: "",
                date: "",
                time: "",
            });
            setShowConfirm(false);
            onClose();
        } catch {
            toast.error("Failed to submit registration. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
                <div className="bg-white rounded-lg shadow-lg p-12 w-full max-w-2xl relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
                        aria-label="Close"
                    >
                        ×
                    </button>
                    <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Visitor Registration</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="w-1/2 border rounded px-3 py-2 text-sm"
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="w-1/2 border rounded px-3 py-2 text-sm"
                                required
                            />
                            <input
                                type="text"
                                name="middleInitial"
                                value={form.middleInitial}
                                onChange={handleChange}
                                placeholder="M.I."
                                className="w-16 border rounded px-3 py-2 text-sm"
                                maxLength={2}
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="age"
                                value={form.age}
                                onChange={handleChange}
                                placeholder="Age"
                                className="w-1/3 border rounded px-3 py-2 text-sm"
                                min={0}
                                required
                            />
                            <input
                                type="text"
                                name="contactNumber"
                                value={form.contactNumber}
                                onChange={handleChange}
                                placeholder="Contact Number (PH)"
                                className="w-2/3 border rounded px-3 py-2 text-sm"
                                pattern="09[0-9]{9}"
                                title="Enter a valid PH mobile number (e.g. 09XXXXXXXXX)"
                                required
                            />
                        </div>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Address (Barangay, Municipality/City, Province)"
                            className="w-full border rounded px-3 py-2 text-sm"
                            required
                        />
                        {/* Purpose of Visit Dropdown */}
                        <div>
                            <select
                                name="purpose"
                                value={form.purpose}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 text-sm mb-2"
                                required
                            >
                                <option value="">Purpose of Visit</option>
                                <option value="Check-up / Consultation">Check-up / Consultation</option>
                                <option value="Laboratory Tests">Laboratory Tests</option>
                                <option value="Buying Medicine">Buying Medicine</option>
                                <option value="Visiting a Patient">Visiting a Patient</option>
                                <option value="Maternity Check-up">Maternity Check-up</option>
                                <option value="Dental Check-up">Dental Check-up</option>
                                <option value="Mental Health Consultation">Mental Health Consultation</option>
                                <option value="Other">Other (please specify)</option>
                            </select>
                            {form.purpose === "Other" && (
                                <input
                                    type="text"
                                    name="purposeOther"
                                    value={form.purposeOther || ""}
                                    onChange={e => setForm({ ...form, purposeOther: e.target.value })}
                                    placeholder="Please specify your purpose"
                                    className="w-full border rounded px-3 py-2 text-sm mt-1"
                                    required
                                />
                            )}
                        </div>
                        {/* Department to Visit Dropdown */}
                        <div>
                            <select
                                name="department"
                                value={form.department}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 text-sm mb-2"
                                required
                            >
                                <option value="">Department to Visit</option>
                                <option value="Outpatient Department (OPD)">Outpatient Department (OPD)</option>
                                <option value="Laboratory / Diagnostics">Laboratory / Diagnostics</option>
                                <option value="Pharmacy">Pharmacy</option>
                                <option value="Wards / Nurse Station">Wards / Nurse Station</option>
                                <option value="OB-GYN Clinic / Maternal Care Services">OB-GYN Clinic / Maternal Care Services</option>
                                <option value="Dental Clinic">Dental Clinic</option>
                                <option value="Mental Health Services">Mental Health Services</option>
                                <option value="Other">Other (please specify)</option>
                            </select>
                            {form.department === "Other" && (
                                <input
                                    type="text"
                                    name="departmentOther"
                                    value={form.departmentOther || ""}
                                    onChange={e => setForm({ ...form, departmentOther: e.target.value })}
                                    placeholder="Please specify the department"
                                    className="w-full border rounded px-3 py-2 text-sm mt-1"
                                    required
                                />
                            )}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-1/2 border rounded px-3 py-2 text-sm"
                                min={new Date().toISOString().split("T")[0]}
                                required
                            />
                            <input
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                className="w-1/2 border rounded px-3 py-2 text-sm"
                                required
                            />
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button
                                type="submit"
                                className="w-1/3 bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition-colors"
                            >
                                Submit Registration
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({
                                    firstName: "",
                                    lastName: "",
                                    middleInitial: "",
                                    age: "",
                                    address: "",
                                    contactNumber: "",
                                    purpose: "",
                                    department: "",
                                    date: "",
                                    time: "",
                                })}
                                className="w-1/3 bg-gray-200 text-gray-700 py-2 rounded font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-1/3 bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
                    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                        <h3 className="text-xl font-semibold text-green-800 mb-4 text-center">Confirm Registration Submission</h3>
                        <p className="mb-6 text-center">Are you sure you want to submit this registration?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinalSubmit}
                                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
