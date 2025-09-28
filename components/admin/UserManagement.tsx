import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { User } from '../../types.ts';
import Icon from '../Icon.tsx';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const data = await api.getAdminAllUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user? This action is irreversible.")) {
            await api.deleteUser(userId);
            setUsers(prev => prev.filter(u => u.id !== userId));
        }
    };
    
    const handleWarnUser = async (userId: string) => {
        const reason = prompt("Please enter a reason for the warning:");
        if (reason) {
            await api.warnUser(userId, reason);
            alert("Warning issued.");
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">User Management</h2>
            <input
                type="text"
                placeholder="Search users by username or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-gray-800 rounded-md border border-gray-700"
            />
             <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold">Username</th>
                            <th className="p-3 text-left text-sm font-semibold hidden md:table-cell">Email</th>
                            <th className="p-3 text-left text-sm font-semibold hidden sm:table-cell">Wallet</th>
                            <th className="p-3 text-left text-sm font-semibold">Status</th>
                            <th className="p-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {isLoading ? (
                            <tr><td colSpan={5} className="p-4 text-center">Loading users...</td></tr>
                        ) : filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td className="p-3">{user.username}</td>
                                <td className="p-3 hidden md:table-cell">{user.email}</td>
                                <td className="p-3 hidden sm:table-cell">${user.wallet_balance?.toFixed(2)}</td>
                                <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{user.status}</span></td>
                                <td className="p-3">
                                     <div className="relative group">
                                        <button className="p-1 hover:bg-gray-700 rounded-full">
                                            <Icon className="w-5 h-5"><path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" /></Icon>
                                        </button>
                                        <div className="absolute right-0 bottom-full mb-2 w-40 bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-10">
                                            <button onClick={() => handleWarnUser(user.id)} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-700">Issue Warning</button>
                                            <button onClick={() => {}} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-700">Suspend</button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10">Delete User</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;