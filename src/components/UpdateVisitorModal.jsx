import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';

export default function UpdateVisitorModal({ isOpen, onClose, onSubmit, initialData }) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        middleInitial: "",
        age: "",
        address: "",
        contactNumber: "",
        purpose: "",
        purposeOther: "",
        department: "",
        departmentOther: "",
        date: "",
        time: "",
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                firstName: initialData.first_name || "",
                lastName: initialData.last_name || "",
                middleInitial: initialData.middle_initial || "",
                age: initialData.age || "",
                address: initialData.address || "",
                contactNumber: initialData.contact_number || "",
                purpose: initialData.purpose || "",
                purposeOther: initialData.purpose_other || "",
                department: initialData.department || "",
                departmentOther: initialData.department_other || "",
                date: initialData.date || "",
                time: initialData.time || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormChanged()) {
            toast.info("No changes detected.");
            return;
        }
        onSubmit(form);
        toast.success("Visitor updated successfully!");
    };

    // Helper to check if form has changed from initialData
    const isFormChanged = () => {
        if (!initialData) return false;
        return (
            form.firstName !== (initialData.first_name || "") ||
            form.lastName !== (initialData.last_name || "") ||
            form.middleInitial !== (initialData.middle_initial || "") ||
            String(form.age) !== String(initialData.age || "") ||
            form.address !== (initialData.address || "") ||
            form.contactNumber !== (initialData.contact_number || "") ||
            form.purpose !== (initialData.purpose || "") ||
            (form.purpose === "Other" && form.purposeOther !== (initialData.purpose_other || "")) ||
            form.department !== (initialData.department || "") ||
            (form.department === "Other" && form.departmentOther !== (initialData.department_other || "")) ||
            form.date !== (initialData.date || "") ||
            form.time !== (initialData.time || "")
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
            <div className="bg-white rounded-lg shadow-lg p-12 w-full max-w-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl font-bold"
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Edit Visitor</h2>
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
                            className="w-1/2 bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition-colors"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
