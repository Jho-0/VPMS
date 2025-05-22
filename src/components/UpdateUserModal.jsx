//UpdateUserModal.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function UpdateUserModal({ isOpen, onClose, userData, refreshUsers }) {
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        status: "",
    });

    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (userData) {
            setFormData({
                username: userData.username || "",
                firstName: userData.first_name || "",
                lastName: userData.last_name || "",
                email: userData.email || "",
                role: userData.role || "",
                status: userData.is_active ? "Active" : "Inactive",
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClear = () => {
        setFormData({
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            role: "",
            status: "",
        });
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
                    <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Update User</h2>
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username"
                                className="w-1/2 border rounded px-3 py-2 text-sm"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-1/2 border rounded px-3 py-2 text-sm"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="w-1/2 border rounded px-3 py-2 text-sm"
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="w-1/2 border rounded px-3 py-2 text-sm"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-1/2 border rounded px-3 py-2 text-sm"
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="receptionist">Receptionist</option>
                            </select>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-1/2 border rounded px-3 py-2 text-sm"
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    const emptyFields = Object.entries(formData).filter(
                                        ([, value]) => value.trim() === ""
                                    );
                                    if (emptyFields.length > 0) {
                                        toast.error("Please fill in all fields");
                                        return;
                                    }
                                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                    if (!emailRegex.test(formData.email)) {
                                        toast.error("Please enter a valid email address");
                                        return;
                                    }
                                    // Check if there are any changes
                                    const hasChanges =
                                        formData.username !== (userData.username || "") ||
                                        formData.firstName !== (userData.first_name || "") ||
                                        formData.lastName !== (userData.last_name || "") ||
                                        formData.email !== (userData.email || "") ||
                                        formData.role !== (userData.role || "") ||
                                        formData.status !== (userData.is_active ? "Active" : "Inactive");
                                    if (!hasChanges) {
                                        toast.info("No changes detected.");
                                        return;
                                    }
                                    setShowConfirm(true);
                                }}
                                className="w-1/3 bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 transition-colors"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleClear();
                                }}
                                className="w-1/3 bg-gray-200 text-gray-700 py-2 rounded font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleClear();
                                    onClose();
                                }}
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
                        <h3 className="text-xl font-semibold text-blue-800 mb-4 text-center">Confirm Update</h3>
                        <p className="mb-6 text-center">Are you sure you want to update this user?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const token = localStorage.getItem("access_token");
                                        const res = await fetch(`http://localhost:8000/api/update-user/${userData.id}/`, {
                                            method: "PUT",
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: `Bearer ${token}`,
                                            },
                                            body: JSON.stringify({
                                                username: formData.username,
                                                first_name: formData.firstName,
                                                last_name: formData.lastName,
                                                email: formData.email,
                                                role: formData.role.toLowerCase(),
                                                is_active: formData.status === "Active",
                                            }),
                                        });

                                        if (!res.ok) {
                                            const contentType = res.headers.get("content-type");
                                            let errorMsg = "Failed to update user";
                                            if (contentType && contentType.includes("application/json")) {
                                                const err = await res.json();
                                                errorMsg = JSON.stringify(err);
                                            } else {
                                                const errText = await res.text();
                                                errorMsg = errText;
                                            }
                                            throw new Error(errorMsg);
                                        }

                                        toast.success("User updated successfully");
                                        await refreshUsers();
                                        handleClear();
                                        setShowConfirm(false);
                                        onClose();
                                    } catch (error) {
                                        console.error(error);
                                        toast.error("Failed to update user");
                                    }
                                }}
                                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
