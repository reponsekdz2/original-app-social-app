import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { User } from '../../types.ts';
import Icon from '../Icon.tsx';
import VerifiedBadge from '../VerifiedBadge.tsx';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const usersData = await api.getAdminUsers('');
            setUsers(usersData);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateUser = async (user: User, updates: { is_admin?: boolean, is_verified?: boolean }) => {
        if (!window.confirm(`Are you sure you want to update ${user.username}?`)) return;
        try {
            await api.updateAdminUser(user.id, updates);
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    const handleDeleteUser = async (user: User) => {
        if (!window.confirm(`Are you sure you want to PERMANENTLY DELETE ${user.username}? This action cannot be undone.`)) return;
        try {
            await api.deleteAdminUser(user.id);
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <h3 className="font-bold mb-4 text-lg">User Management</h3>
            <input 
                type="text"
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 mb-4 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Joined</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                                <td className="px-4 py-3 font-medium flex items-center gap-3">
                                    <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                                    {user.username}
                                </td>
                                <td className="px-4 py-3">{user.email}</td>
                                {/* Fix: Add a check for the optional created_at property before formatting. */}
                                <td className="px-4 py-3">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                                <td className="px-4 py-3">
                                    {user.isAdmin && <span className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-red-500 text-white">Admin</span>}
                                    {user.isVerified && <VerifiedBadge />}
                                </td>
                                <td className="px-4 py-3 text-right space-x-1">
                                    <button onClick={() => handleUpdateUser(user, { is_admin: !user.isAdmin })} className="p-1 text-xs">{user.isAdmin ? 'Revoke Admin' : 'Make Admin'}</button>
                                    <button onClick={() => handleUpdateUser(user, { is_verified: !user.isVerified })} className="p-1 text-xs">{user.isVerified ? 'Unverify' : 'Verify'}</button>
                                    <button onClick={() => handleDeleteUser(user)} className="p-1 text-xs text-red-500">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {isLoading && <p className="text-center py-4">Loading users...</p>}
                 {!isLoading && filteredUsers.length === 0 && <p className="text-center py-4">No users found.</p>}
            </div>
        </div>
    );
};

export default UserManagement;
