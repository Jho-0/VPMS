import { useState, useEffect } from "react";
import axios from "axios";
import { MdPersonAddAlt } from "react-icons/md";
import AddUserModal from "../components/AddUserModal";
import UpdateUserModal from "../components/UpdateUserModal";
import { FaUserEdit } from "react-icons/fa";


export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);


    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const res = await axios.get("http://localhost:8000/api/get-user/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, roleFilter]);

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? user.is_active === (statusFilter === "active") : true;
        const matchesRole = roleFilter ? user.role === roleFilter : true;
        return matchesSearch && matchesStatus && matchesRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="flex flex-col min-h-screen overflow-hidden">
            <AddUserModal isOpen={showModal} onClose={() => setShowModal(false)} refreshUsers={fetchUsers} />
            <UpdateUserModal
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                userData={selectedUser}
                refreshUsers={fetchUsers}
            />
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800 p-2">
                        Total Users: {filteredUsers.length}
                    </h2>

                    <div className="flex items-center gap-2 flex-wrap">
                        <input
                            type="text"
                            placeholder="Search by username"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="receptionist">Receptionist</option>
                        </select>

                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("");
                                setRoleFilter("");
                            }}
                            className="px-3 py-2 rounded-md bg-[#f0f0f0] text-gray-700 text-sm border hover:bg-gray-200"
                        >
                            Reset
                        </button>

                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-1 bg-green-800 text-white px-3 py-2 rounded-md text-sm hover:bg-green-900"
                        >
                            <MdPersonAddAlt /> Add User
                        </button>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-b-md overflow-x-auto">
                    <table className="w-full min-w-[700px] text-sm text-left text-gray-700 table-fixed">
                        <thead className="bg-[#e3f1db] text-green-900">
                            <tr>
                                <th className="px-4 py-3 w-1/4">Username</th>
                                <th className="px-4 py-3 w-1/4">Role</th>
                                <th className="px-4 py-3 w-1/4">Status</th>
                                <th className="px-4 py-3 w-1/5">Date Added</th>
                                <th className="px-4 py-3 w-1/10 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-6 text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                currentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 truncate max-w-[180px]">{user.username}</td>
                                        <td className="px-4 py-3 capitalize">
                                            <span
                                                className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${user.role === "admin" ? "bg-blue-600" : "bg-yellow-500"}`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 capitalize">
                                            <span
                                                className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${user.is_active ? "bg-green-500" : "bg-red-500"}`}
                                            >
                                                {user.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.date_joined
                                                ? new Date(user.date_joined).toLocaleDateString()
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <FaUserEdit
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsUpdateOpen(true);
                                                }}
                                                className="text-3xl text-gray-800 hover:text-blue-700 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full p-1 float-right"
                                                title="Edit user"
                                            >
                                            </FaUserEdit>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-green-700 text-white" : "bg-gray-100"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
