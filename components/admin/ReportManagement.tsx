import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService.ts';
import type { Report } from '../../types.ts';

const ReportManagement: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'pending' | 'resolved' | 'dismissed'>('pending');

    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                const data = await api.getAdminAllReports();
                setReports(data);
            } catch (error) {
                console.error("Failed to fetch reports", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleUpdateStatus = async (reportId: number, status: 'resolved' | 'dismissed') => {
        await api.updateReportStatus(reportId, status);
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
    };
    
    const filteredReports = reports.filter(r => r.status === filter);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Report Management</h2>
             <div className="flex gap-2 border-b border-gray-700">
                <button onClick={() => setFilter('pending')} className={`py-2 px-4 ${filter === 'pending' ? 'border-b-2 border-red-500 font-semibold' : 'text-gray-400'}`}>Pending</button>
                <button onClick={() => setFilter('resolved')} className={`py-2 px-4 ${filter === 'resolved' ? 'border-b-2 border-green-500 font-semibold' : 'text-gray-400'}`}>Resolved</button>
                <button onClick={() => setFilter('dismissed')} className={`py-2 px-4 ${filter === 'dismissed' ? 'border-b-2 border-gray-500 font-semibold' : 'text-gray-400'}`}>Dismissed</button>
            </div>
            <div className="overflow-x-auto">
                 <table className="min-w-full bg-gray-800 rounded-lg">
                    <thead className="bg-gray-900">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold">Reporter ID</th>
                            <th className="p-3 text-left text-sm font-semibold">Reported Entity</th>
                            <th className="p-3 text-left text-sm font-semibold">Reason</th>
                            <th className="p-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-4 text-center">Loading reports...</td></tr>
                        ) : filteredReports.map(report => (
                            <tr key={report.id}>
                                <td className="p-3 text-xs">{report.reporter_id}</td>
                                <td className="p-3 text-xs">{report.entity_type}: {report.reported_entity_id}</td>
                                <td className="p-3">{report.reason}</td>
                                <td className="p-3 space-x-2">
                                    {filter === 'pending' && (
                                        <>
                                            <button onClick={() => handleUpdateStatus(report.id, 'resolved')} className="text-green-400 hover:underline text-sm">Resolve</button>
                                            <button onClick={() => handleUpdateStatus(report.id, 'dismissed')} className="text-gray-400 hover:underline text-sm">Dismiss</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default ReportManagement;