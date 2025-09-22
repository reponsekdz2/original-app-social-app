import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { User } from '../../types.ts';
import Icon from '../Icon.tsx';
import VerifiedBadge from '../VerifiedBadge.tsx';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

    const handleUpdateUser = async (user: User, updates: { is_admin?: boolean, is_verified?: boolean, status?: User['status'] }) => {
        if (!window.confirm(`Are you sure you want to update ${user.username}?`)) return;
        try {
            await api.updateAdminUser(user.id, updates);
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };
    
    const handleWarnUser = async (user: User) => {
        const reason = prompt(`Enter a reason for warning ${user.username}:`);
        if (reason) {
            await api.issueUserWarning(user.id, reason);
            // Optionally show a success message
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
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const getStatusColor = (status: User['status']) => ({
        active: 'bg-green-500/20 text-green-300',
        suspended: 'bg-yellow-500/20 text-yellow-300',
        banned: 'bg-red-500/20 text-red-400'
    }[status]);

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
                            <th className="px-4 py-3 hidden sm:table-cell">Email</th>
                            <th className="px-4 py-3 hidden lg:table-cell">Wallet</th>
                            <th className="px-4 py-3 hidden md:table-cell">Last Login</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/30">
                                <td className="px-4 py-3 font-medium flex items-center gap-3">
                                    <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                                    {user.username} {user.isVerified && <VerifiedBadge />}
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">{user.email}</td>
                                <td className="px-4 py-3 hidden lg:table-cell">${user.wallet_balance?.toFixed(2)}</td>
                                <td className="px-4 py-3 hidden md:table-cell">{user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-xs font-semibold mr-2 px-2.5 py-0.5 rounded ${getStatusColor(user.status)}`}>
                                        {user.status}
                                    </span>
                                    {user.isAdmin && <span className="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded bg-purple-500 text-white">Admin</span>}
                                </td>
                                <td className="px-4 py-3 text-right">
                                     <div className="relative inline-block text-left">
                                        <button onClick={() => setActiveDropdown(activeDropdown === user.id ? null : user.id)} className="p-1">
                                            <Icon className="w-5 h-5"><path d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></Icon>
                                        </button>
                                        {activeDropdown === user.id && (
                                            <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                                                <div className="py-1" role="menu" aria-orientation="vertical">
                                                    <a href="#" onClick={(e) => { e.preventDefault(); alert(`Functionality to view profile of ${user.username} to be implemented.`); setActiveDropdown(null); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">View Profile</a>
                                                    <div className="border-t border-gray-600 my-1"></div>
                                                    <a href="#" onClick={() => { handleUpdateUser(user, { status: 'active' }); setActiveDropdown(null); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Set Active</a>
                                                    <a href="#" onClick={() => { handleUpdateUser(user, { status: 'suspended' }); setActiveDropdown(null); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Suspend</a>
                                                    <a href="#" onClick={() => { handleUpdateUser(user, { status: 'banned' }); setActiveDropdown(null); }} className="block px-4 py-2 text-sm text-yellow-400 hover:bg-gray-600">Ban</a>
                                                     <a href="#" onClick={() => { handleWarnUser(user); setActiveDropdown(null); }} className="block px-4 py-2 text-sm text-yellow-400 hover:bg-gray-600">Warn</a>
                                                    <div className="border-t border-gray-600 my-1"></div>
                                                    <a href="#" onClick={() => { handleDeleteUser(user); setActiveDropdown(null); }} className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-600">Delete User</a>
                                                </div>
                                            </div>
                                        )}
                                     </div>
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